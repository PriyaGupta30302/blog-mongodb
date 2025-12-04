import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import { Admin } from "@/lib/models/AdminModel";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const getSecretKey = () =>
  new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-key");

export async function POST(request) {
  try {
    await ConnectDB();
    const { email, password } = await request.json();

    const admin = await Admin.findOne({ email, isVerified: true });
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await new SignJWT({
      sub: admin._id.toString(),
      email: admin.email,
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(getSecretKey());

    const res = NextResponse.json({ message: "Logged in" });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (err) {
    console.error("login error", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
