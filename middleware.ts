import { NextRequest, NextResponse } from "next/server";

export async function middleware(req:NextRequest) {
    if(req.nextUrl.pathname === "/") {
      return NextResponse.redirect("https://analytixapp.vercel.app");
    }
    return NextResponse.next();
}