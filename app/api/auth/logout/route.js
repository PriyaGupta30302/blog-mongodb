import { NextResponse } from "next/server";

export async function POST() {
  // remove the "token" cookie
  const res = NextResponse.json({ message: "Logged out" });

  res.cookies.set("token", "", {
    path: "/",
    maxAge: 0,
  });

  return res;
}
