import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Log the user data before any API request
  const userAgentString = req.headers.get("user-agent");
  if (!userAgentString) {
    console.error("User-Agent header is missing");
    return NextResponse.next(); // or handle this case as needed
  }

  const parser = new UAParser(userAgentString);

  const deviceInfo = parser.getResult();

  const userInfo = {
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0",
    userAgent: userAgentString,
    os: `${deviceInfo.os.name} ${deviceInfo.os.version}`,
    device: deviceInfo.device.model || "Unknown Device",
    browser: `${deviceInfo.browser.name} ${deviceInfo.browser.version}`,
    time: Date.now(),
    referringUrl: req.headers.get("referer") || "",
  };

  console.log("User data:", userInfo);

  if (pathname === "/") {
    return NextResponse.redirect("https://analytixapp.vercel.app");
  }

  const trackingCookie = req.cookies.get("trackingCookie");
  const pathCookie = req.cookies.get("pathCookie");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const apiCheckResponse = await fetch(
      `https://your-api.com/check-path?path=${pathname}`,
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (
      !apiCheckResponse.ok ||
      !apiCheckResponse.headers
        .get("content-type")
        ?.includes("application/json")
    ) {
      console.error(
        `API validation failed for path: ${pathname}. Status: ${apiCheckResponse.status}`
      );
      return NextResponse.next();
    }

    const apiCheckData = await apiCheckResponse.json();

    if (apiCheckData.valid) {
      const redirectUrl = apiCheckData.url;

      if (!trackingCookie) {
        await fetch("https://your-api.com/send-user-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userInfo, pathname }),
        });
      }

      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set("trackingCookie", "true", {
        maxAge: 60 * 60 * 24 * 2,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      }); // 2 days
      response.cookies.set("pathCookie", pathname, {
        maxAge: 60 * 60 * 1,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      }); // 1 hour

      return response;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in middleware processing:", error.message);
    } else {
      console.error("Unknown error occurred:", error);
    }
  }

  return NextResponse.next();
}
