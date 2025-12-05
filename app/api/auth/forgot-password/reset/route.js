import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import { Admin } from "@/lib/models/AdminModel";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await ConnectDB();
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Email, OTP and new password are required" },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return NextResponse.json(
        { error: "No admin found with this email" },
        { status: 404 }
      );
    }

    // check OTP
    if (
      !admin.otpCode ||
      !admin.otpExpiresAt ||
      admin.otpCode !== otp ||
      admin.otpExpiresAt < new Date()
    ) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // hash new password (same style as register)
    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;

    // clear OTP fields
    admin.otpCode = undefined;
    admin.otpExpiresAt = undefined;

    await admin.save();

    return NextResponse.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("forgot-password reset error", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
