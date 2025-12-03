// app/api/blog/deleteBlog/route.js
import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import { Blog } from "@/lib/models/BlogModel";

export async function DELETE(request) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Blog id is required" },
        { status: 400 }
      );
    }

    const deleted = await Blog.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    console.log("🗑️ deleteBlog: blog deleted:", deleted._id.toString(), "-", deleted.title);

    return NextResponse.json(
      { success: true, message: "Blog deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ deleteBlog error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
