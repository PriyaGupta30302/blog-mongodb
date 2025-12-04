// lib/utils/sendOtpEmail.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: "Your Admin Registration OTP",
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    html: `<p>Your OTP code is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
  });
}
