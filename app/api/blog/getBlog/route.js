import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import { Blog } from "@/lib/models/BlogModel";

// Handles GET requests to /api/blog/getBlog
export async function GET(request) {
  await ConnectDB();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  let query = {};
  if (category) query.category = category;

  const blogs = await Blog.find(query).sort({ date: -1 });
  return NextResponse.json(blogs, { status: 200 });
}
