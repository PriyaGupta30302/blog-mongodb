import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import { Admin } from "@/lib/models/AdminModel";

export async function DELETE(req) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    await Admin.findByIdAndDelete(id);

    return NextResponse.json({ message: "Admin deleted" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
