import { assets } from "@/assets/blog-img/assets";
import Sidebar from "@/components/adminComponents/Sidebar";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }) {
  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-[#10131a]">
        <ToastContainer theme="dark" />

        {/* Sidebar */}
        <Sidebar />

        {/* Right side: header + page content */}
        <div className="flex flex-col flex-1 bg-white">
          {/* Top bar */}
          <div className="flex items-center justify-between w-full py-2.5 sm:py-[10.5px] max-h-[70px]  px-4 sm:px-6 lg:px-12 border-b-2 border-black">
            <h3 className="font-medium text-sm sm:text-base">Admin Panel</h3>
            <Image src={assets.profile_icon} width={40} alt="Admin profile" />
          </div>

          {/* Page body */}
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </>
  );
}
