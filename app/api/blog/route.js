import { ConnectDB } from "@/lib/config/db";
import { Blog } from "@/lib/models/BlogModel";

await ConnectDB();

export async function POST(request) {
  try {
    const body = await request.json();
    const blogDoc = new Blog(body);
    await blogDoc.save();
    return new Response(JSON.stringify({ message: "Blog saved 2", blog: blogDoc }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET(request) {
  try {
    const blogs = await Blog.find({});
    return new Response(JSON.stringify(blogs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
