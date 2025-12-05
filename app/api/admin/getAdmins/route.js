import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import { Admin } from "@/lib/models/AdminModel"; // adjust path if different

export async function GET() {
  try {
    await ConnectDB();
    const admins = await Admin.find().sort({ _id: -1 });
    return NextResponse.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}
