import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import { Admin } from "@/lib/models/AdminModel";
import { SignJWT } from "jose";

const getSecretKey = () =>
  new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-key");

export async function POST(request) {
  try {
    await ConnectDB();
    const { email, otp } = await request.json();

    const admin = await Admin.findOne({ email });
    if (!admin || !admin.otpCode || !admin.otpExpiresAt) {
      return NextResponse.json(
        { error: "Invalid OTP or email" },
        { status: 400 }
      );
    }

    if (admin.otpCode !== otp) {
      return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 });
    }

    if (admin.otpExpiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    admin.isVerified = true;
    admin.otpCode = undefined;
    admin.otpExpiresAt = undefined;
    await admin.save();

    const token = await new SignJWT({
      sub: admin._id.toString(),
      email: admin.email,
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(getSecretKey());

    const res = NextResponse.json({ message: "Registration complete" });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (err) {
    console.error("register verify-otp error", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
