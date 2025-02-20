"use client"

import Image from "next/image";
import Logo from "@/public/logo.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, Hospital, Inbox, LayoutDashboard, LogOut, Newspaper } from "lucide-react";

export default function SideNav() {
    const pathname = usePathname();

    return (
        <nav className="h-screen w-full bg-[#690B22] py-3 lg:w-fit lg:py-8 lg:items-center lg:justify-center flex lg:flex-col drop-shadow-md lg:max-w-[280px]">
            <Link href="/dashboard" as="/dashboard">
                <Image src={Logo} alt="Logo" className="hidden lg:block h-[85px] w-auto" height={80} priority />
            </Link>
            <div className="h-full flex flex-col justify-between">
                <ul className="mt-4 text-black px-6 flex flex-col gap-3" >
                    <li className={`px-5 py-3 rounded-[4px] min-w-[232px] ${pathname.startsWith("/dashboard") ? "bg-white bg-opacity-20 text-black" : "bg-transparent"}`}>
                        <Link href="/dashboard" className="flex flex-row gap-3 items-center">
                            <LayoutDashboard className="text-white" />
                            <p className={`text-white font-medium`}>Dashboard</p>
                        </Link>
                    </li>

                    <li className={`px-5 py-3 rounded-[4px] min-w-[232px] ${pathname.startsWith("/post") ? "bg-white bg-opacity-20 text-black" : "bg-transparent"}`}>
                        <Link href="/post" className="flex flex-row gap-3 items-center">
                            <Inbox className="text-white" />
                            <p className={`text-white font-medium`}>Post</p>
                        </Link>
                    </li>

                    <li className={`px-5 py-3 rounded-[4px] min-w-[232px] ${pathname.startsWith("/news") ? "bg-white bg-opacity-20 text-black" : "bg-transparent"}`}>
                        <Link href="/news" className="flex flex-row gap-3 items-center">
                            <Newspaper className="text-white" />
                            <p className={`text-white font-medium`}>News</p>
                        </Link>
                    </li>

                    <li className={`px-5 py-3 rounded-[4px] min-w-[232px] ${pathname.startsWith("/hospital") ? "bg-white bg-opacity-20 text-black" : "bg-transparent"}`}>
                        <Link href="/hospital" className="flex flex-row gap-3 items-center">
                            <Hospital className="text-white" />
                            <p className={`text-white font-medium`}>Hospital</p>
                        </Link>
                    </li>
                </ul>
                <ul>
                    <li className="flex flex-row justify-between px-10 py-3 rounded-[4px] min-w-[232px] bg-transparent">
                        <div className="flex flex-row gap-3 items-center">
                            <CircleUserRound className="text-white" />
                            <p className={`text-white font-medium`}>Admin</p>
                        </div>

                        <Link href="/logout" className="flex flex-row gap-3 items-center">
                            {/* <p className={`text-white font-medium`}>Logout</p> */}
                            <LogOut className="text-white" />
                        </Link>
                    </li>
                </ul>

            </div>
        </nav >
    )
}
