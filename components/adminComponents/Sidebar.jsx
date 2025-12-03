"use client";

import { assets } from "@/assets/blog-img/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Sidebar = () => {
  return (
    <div className="bg-slate-100 text-sm">
      {/* Desktop / large screens – vertical sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:h-screen lg:w-64 xl:w-80 border-r border-black">
        {/* Logo */}
        <Link
          href="/"
          className="px-6 py-3 border-b border-black flex items-center"
        >
          <Image src={assets.logo} width={130} alt="Blogger logo" />
        </Link>

        {/* Nav buttons */}
        <div className="flex-1 px-4 pt-6 space-y-4">
          <Link
            href="/admin/addBlog"
            className="flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]"
          >
            <Image src={assets.add_icon} alt="" width={24} />
            <p>Add Blogs</p>
          </Link>

          <Link
            href="/admin/blogList"
            className="flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]"
          >
            <Image src={assets.blog_icon} alt="" width={24} />
            <p>Blog list</p>
          </Link>

          <Link
            href="/admin/subscription"
            className="flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]"
          >
            <Image src={assets.email_icon} alt="" width={24} />
            <p>Subscription</p>
          </Link>
        </div>
      </div>

      {/* Mobile / tablet – only logo in top bar */}
      <div className="lg:hidden w-full border-b border-black">
        <div className="flex items-center px-3 sm:px-4 py-2 bg-slate-100">
          <Link href="/" className="flex-shrink-0">
            <Image src={assets.logo} width={110} alt="Blogger logo" />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* Mobile “tabs” nav – to be used inside pages */
export const MobileAdminNav = ({ active = "blogList" }) => {
  const baseClasses =
    "flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm border border-black shadow-[-4px_4px_0px_#000000] whitespace-nowrap";

  const isActive = (name) =>
    name === active
      ? baseClasses + " bg-white text-black"
      : baseClasses + " bg-white";

  return (
    <div className="mb-5 overflow-x-auto py-4 lg:hidden">
      <div className="flex flex-nowrap gap-3 w-max px-1 sm:px-0">
        <Link href="/admin/addBlog" className={isActive("addBlog")}>
          <Image src={assets.add_icon} alt="" width={18} />
          <span>Add Blogs</span>
        </Link>

        <Link href="/admin/blogList" className={isActive("blogList")}>
          <Image src={assets.blog_icon} alt="" width={18} />
          <span>Blog list</span>
        </Link>

        <Link href="/admin/subscription" className={isActive("subscription")}>
          <Image src={assets.email_icon} alt="" width={18} />
          <span>Subscription</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
