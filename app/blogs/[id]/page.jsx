"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import BlogContent from "@/components/adminComponents/BlogContent";
import Image from "next/image";
import Link from "next/link";
import "@/components/adminComponents/editor-styles.css";
import { assets } from "@/assets/blog-img/assets";

export default function BlogDetailPage() {
  const params = useParams();
  const { id } = params;

  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchBlog() {
      const res = await fetch(`/api/blog/getBlog?id=${id}`);
      const blog = await res.json();
      setData(blog && blog._id ? blog : null);
    }
    if (id) fetchBlog();
  }, [id]);

  if (!data) return <div className="text-center p-12">Blog not found</div>;

  return (
    <>
      <div className="bg-gray-200 py-5 px-5 md:px-12 lg:px-28">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image
              src={assets.logo}
              width={180}
              alt=""
              className="w-[130px] sm:w-auto cursor-pointer"
            />
          </Link>

          <Link href="/login">
            <button className="flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-7px_7px_0px_#000000] cursor-pointer active:bg-gray-100">
              Get Started <Image src={assets.arrow} alt="" />
            </button>
          </Link>
        </div>

        <div className="text-center my-24">
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">
            {data.title}
          </h1>
          {data.authorImg && (
            <img
              src={data.authorImg}
              alt="Author"
              width={60}
              height={60}
              className="mx-auto mt-6 border border-white rounded-full"
            />
          )}
          <p className="mt-1 pb-2 text-lg max-w-[740px] mx-auto">
            {data.author}
          </p>
        </div>
      </div>

      <div className="mx-5 max-w-[1240px] md:mx-auto mt-[-100px] mb-10">
        {data.image && (
          <img
            src={data.image}
            alt="Blog"
            width={1280}
            height={520}
            className="border-4 border-white mx-auto "
          />
        )}
        <BlogContent html={data.description} />

        <div className="flex my-10 px-2">
          <Image src={assets.facebook_icon} alt="" width={40} />
          <Image src={assets.twitter_icon} alt="" width={40} />
          <Image src={assets.googleplus_icon} alt="" width={40} />
        </div>
      </div>
    </>
  );
}
