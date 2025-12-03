// app/api/blog/getBlog/route.js
import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import { Blog } from "@/lib/models/BlogModel";

export async function GET(request) {
  try {
    await ConnectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const category = searchParams.get("category");

    // single blog by id
    if (id) {
      const blog = await Blog.findById(id);
      if (!blog) {
        return NextResponse.json(
          { error: "Blog not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(blog, { status: 200 });
    }

    // list (optional category filter)
    const query = {};
    if (category) query.category = category;

    const blogs = await Blog.find(query).sort({ date: -1 });

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("getBlog error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
