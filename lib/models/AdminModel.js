import mongoose, { Schema } from "mongoose";

const AdminSchema = new Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true }, // hashed
  isVerified: { type: Boolean, default: false },

  otpCode: String,
  otpExpiresAt: Date,
});

export const Admin =
  mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
