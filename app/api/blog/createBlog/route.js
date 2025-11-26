import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import { Blog } from "@/lib/models/BlogModel";

// Handles POST requests to /api/blog/createBlog
export async function POST(request) {
  await ConnectDB();
  const body = await request.json();

  const blogDoc = new Blog(body);
  await blogDoc.save();
  return NextResponse.json({ message: "Blog saved", blog: blogDoc }, { status: 201 });
}
