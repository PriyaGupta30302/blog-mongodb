import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import { Admin } from "@/lib/models/AdminModel";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/utils/sendOtpEmail";

export async function POST(request) {
  try {
    await ConnectDB();
    const { firstName, lastName, email, password } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existing = await Admin.findOne({ email });

    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    if (existing && existing.isVerified) {
      return NextResponse.json(
        { error: "Admin already registered. Please login." },
        { status: 400 }
      );
    }

    if (existing && !existing.isVerified) {
      existing.firstName = firstName;
      existing.lastName = lastName;
      existing.password = hashed;
      existing.otpCode = otp;
      existing.otpExpiresAt = expires;
      await existing.save();
    } else if (!existing) {
      await Admin.create({
        firstName,
        lastName,
        email,
        password: hashed,
        isVerified: false,
        otpCode: otp,
        otpExpiresAt: expires,
      });
    }

    await sendOtpEmail(email, otp);

    return NextResponse.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("register request-otp error", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
