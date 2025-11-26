import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import { Blog } from "@/lib/models/BlogModel";

// Handles GET requests to /api/blog/getBlog
export async function GET(request) {
  await ConnectDB();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");          // Add: read single id
  const category = searchParams.get("category");

  // If id param is given, fetch single blog
  if (id) {
    try {
      const blog = await Blog.findById(id);
      if (blog) {
        return NextResponse.json(blog, { status: 200 });
      } else {
        return NextResponse.json(null, { status: 404 });
      }
    } catch (error) {
      return NextResponse.json(null, { status: 500 });
    }
  }

  // Otherwise fetch all blogs (optionally filter by category)
  let query = {};
  if (category) query.category = category;

  const blogs = await Blog.find(query).sort({ date: -1 });
  return NextResponse.json(blogs, { status: 200 });
}
