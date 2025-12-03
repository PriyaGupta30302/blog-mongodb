// app/api/blog/updateBlog/route.js
import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import { Blog } from "@/lib/models/BlogModel";

export async function PUT(request) {
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

    const body = await request.json();

    const updatedBlog = await Blog.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    console.log("✏️ updateBlog: blog updated:", updatedBlog._id.toString(), "-", updatedBlog.title);

    // return same shape as createBlog for consistency
    return NextResponse.json(
      { message: "Blog updated", blog: updatedBlog },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ updateBlog error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
