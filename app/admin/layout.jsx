import { assets } from "@/assets/blog-img/assets";
import Sidebar from "@/components/adminComponents/Sidebar";
import Image from "next/image";
import { ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Layout({children}) {
    return (
        <>
            <div className="flex">
                <ToastContainer theme="dark"/>
                <Sidebar/>
                <div className="flex flex-col w-full  ">
                    <div className="flex items-center justify-between w-full py-[9.5px] max-h-[70px] px-12  border-b-2 border-black ">
                        <h3 className="font-medium">Admin Panel</h3>
                        <Image src={assets.profile_icon} width={40} alt="" />
                    </div>
                    {children}
                </div>
            </div>
            
        </>
    )
}