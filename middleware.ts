import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Redirect root path to the main app
    if (pathname === "/") {
        return NextResponse.redirect("https://analytixapp.vercel.app");
    }

    // Retrieve cookies for tracking and stored path
    const trackingCookie = req.cookies.get("trackingCookie");
    const pathCookie = req.cookies.get("pathCookie");

    // If tracking cookie exists, bypass further processing
    if (trackingCookie) {
        return NextResponse.next();
    }

    try {
        // Validate the pathname with an API
        const apiCheckResponse = await fetch(`https://your-api.com/check-path?path=${pathname}`);

        // Check if the response is JSON
        if (!apiCheckResponse.ok || apiCheckResponse.headers.get("content-type")?.includes("application/json") === false) {
            console.error(`Invalid response from API for path: ${pathname}. Status: ${apiCheckResponse.status}`);
            return NextResponse.next(); // Skip further processing on error
        }

        const apiCheckData = await apiCheckResponse.json();

        if (apiCheckData.valid) {
            const redirectUrl = apiCheckData.url;

            // Collect user information
            const userInfo = {
                ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0",
                userAgent: req.headers.get("user-agent"),
                time: Date.now(),
                referringUrl: req.headers.get("referer") || "",
            };

            // Send user data to another API
            await fetch("https://your-api.com/send-user-info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userInfo, pathname }),
            });

            // Set cookies for tracking and pathname storage
            const response = NextResponse.redirect(redirectUrl);
            response.cookies.set("trackingCookie", "true", {
                maxAge: 60 * 60 * 24 * 2, // 2 days
                httpOnly: true,
                secure: true,
            });
            response.cookies.set("pathCookie", pathname, {
                maxAge: 60 * 60 * 24 * 2, // 2 days
                httpOnly: true,
                secure: true,
            });

            return response;
        }
    } catch (error) {
        console.error("Error processing middleware:", error);
    }

    // Default: Proceed to the next middleware or request handler
    return NextResponse.next();
}
