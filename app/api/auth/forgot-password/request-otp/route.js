import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import { Admin } from "@/lib/models/AdminModel";
import { sendOtpEmail } from "@/lib/utils/sendOtpEmail";

export async function POST(request) {
  try {
    await ConnectDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
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

    // generate OTP like register route
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    admin.otpCode = otp;
    admin.otpExpiresAt = expires;
    await admin.save();

    // send email same way as register
    await sendOtpEmail(email, otp);

    return NextResponse.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("forgot-password request-otp error", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
