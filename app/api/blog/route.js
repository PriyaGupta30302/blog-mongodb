import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import { Blog } from "@/lib/models/BlogModel";

export async function GET(request) {
  await ConnectDB();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  // Optional: filter by category
  let query = {};
  if (category) {
    query.category = category;
  }

  const blogs = await Blog.find(query).sort({ date: -1 }); // latest first
  return NextResponse.json(blogs, { status: 200 });
}

// Your POST handler remains below...
export async function POST(request) {
  await ConnectDB();
  const body = await request.json();
  const blogDoc = new Blog(body);
  await blogDoc.save();
  return NextResponse.json({ message: "Blog saved", blog: blogDoc }, { status: 201 });
}
