"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/blog-img/assets";

const Sidebar = () => {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setLoggingOut(false);
      router.push("/login"); // go to login page
    }
  };

  return (
    <div className="bg-slate-100 text-sm">
      {/* Desktop / large screens – vertical sidebar */}
      <div className="hidden xl:flex xl:flex-col xl:h-screen xl:w-80 border-r border-black">
        {/* Logo */}
        <Link
          href="/"
          className="px-6 py-3 active:bg-gray-100 border-b border-black flex items-center"
        >
          <Image src={assets.logo} width={130} alt="Blogger logo" />
        </Link>

        {/* Nav buttons */}
        <div className="flex-1 px-4 pt-6 space-y-4">
          <Link
            href="/admin/addBlog"
            className="flex items-center active:bg-gray-100 border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]"
          >
            <Image src={assets.add_icon} alt="" width={24} />
            <p>Add Blogs</p>
          </Link>

          <Link
            href="/admin/blogList"
            className="flex items-center active:bg-gray-100 border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]"
          >
            <Image src={assets.blog_icon} alt="" width={24} />
            <p>Blog list</p>
          </Link>

          <Link
            href="/admin/subscription"
            className="flex items-center active:bg-gray-100 border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]"
          >
            <Image src={assets.email_icon} alt="" width={24} />
            <p>Subscription</p>
          </Link>

          {/* Logout button */}
          <div className="pb-6">
            <button
              onClick={handleLogout}
              className="w-full cursor-pointer flex items-start justify-start border border-black gap-2 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]"
            >
              <Image
                src={assets.logout_icon}
                alt="logout_icon"
                width={24}
                height={24}
              />
              <span>{loggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / tablet – only logo in top bar */}
      <div className="lg:hidden w-full border-b border-black">
        <div className="flex items-center px-3 sm:px-4 py-2 bg-slate-100">
          <Link href="/" className="shrink-0">
            <Image src={assets.logo} width={110} alt="Blogger logo" />
          </Link>
        </div>
      </div>
    </div>
  );
};

/* Mobile “tabs” nav – to be used inside pages */
export const MobileAdminNav = ({ active = "blogList" }) => {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setLoggingOut(false);
      router.push("/login");
    }
  };

  const baseClasses =
    "flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm border border-black shadow-[-4px_4px_0px_#000000] whitespace-nowrap";

  const isActive = (name) =>
    name === active
      ? baseClasses + " bg-white text-black"
      : baseClasses + " bg-white";

  return (
    <div className="mb-5 overflow-x-auto py-4 xl:hidden">
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

        {/* Logout button – mobile tab */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 border border-black bg-white shadow-[-4px_4px_0px_#000000]"
        >
          <Image
            src={assets.logout_icon}
            alt="logout_icon"
            width={18}
            height={18}
          />
          <span>{loggingOut ? "Logging out..." : "Logout"}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
