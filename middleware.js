import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const getSecretKey = () =>
  new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-key");

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // if logged-in admin tries to go to /login or /register → send to /admin/blogList
  if (pathname === "/login" || pathname === "/register") {
    if (!token) return NextResponse.next();

    try {
      const { payload } = await jwtVerify(token, getSecretKey());
      if (payload.role === "admin") {
        return NextResponse.redirect(new URL("/admin/blogList", req.url));
      }
    } catch {}
    return NextResponse.next();
  }

  // protect /admin/*
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, getSecretKey());
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    } catch (err) {
      console.error("middleware jwt error", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
};
