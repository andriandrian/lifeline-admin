"use client"

import Image from "next/image";
import Logo from "@/public/logo.svg";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarFold, CircleUserRound, Gift, Hospital, Inbox, LayoutDashboard, LogOut, MessageCircleQuestion, Newspaper, UserRound, HandHeart } from "lucide-react";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { logout } from "@/lib";

export default function SideNav() {
    const pathname = usePathname();
    const [name, setName] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        try {
            const user = Cookies.get('name');
            if (user) {
                setName(user);
            }
        } catch (error) {
            console.error("Error checking token:", error);
        }
    }, []);

    async function handleLogout() {
        if (confirm("Are you sure you want to logout?")) {
            try {
                // Call server action to remove httpOnly cookies
                await logout();

                // Remove client-side cookies
                Cookies.remove('name');

                // Add a small delay to ensure cookies are cleared
                await new Promise(resolve => setTimeout(resolve, 100));

                router.push('/login');
                router.refresh();
            } catch (error) {
                console.error("Logout error:", error);
            }
        }
    }

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

                    <li className={`px-5 py-3 rounded-[4px] min-w-[232px] ${pathname.startsWith("/request") ? "bg-white bg-opacity-20 text-black" : "bg-transparent"}`}>
                        <Link href="/request" className="flex flex-row gap-3 items-center">
                            <HandHeart className="text-white" />
                            <p className={`text-white font-medium`}>Request</p>
                        </Link>
                    </li>

                    <li className={`px-5 py-3 rounded-[4px] min-w-[232px] ${pathname.startsWith("/news") ? "bg-white bg-opacity-20 text-black" : "bg-transparent"}`}>
                        <Link href="/news" className="flex flex-row gap-3 items-center">
                            <Newspaper className="text-white" />
                            <p className={`text-white font-medium`}>News</p>
                        </Link>
                    </li>

                    <li className={`px-5 py-3 rounded-[4px] min-w-[232px] ${pathname.startsWith("/event") ? "bg-white bg-opacity-20 text-black" : "bg-transparent"}`}>
                        <Link href="/event" className="flex flex-row gap-3 items-center">
                            <CalendarFold className="text-white" />
                            <p className={`text-white font-medium`}>Event</p>
                        </Link>
                    </li>

                    <li className={`px-5 py-3 rounded-[4px] min-w-[232px] ${pathname.startsWith("/hospital") ? "bg-white bg-opacity-20 text-black" : "bg-transparent"}`}>
                        <Link href="/hospital" className="flex flex-row gap-3 items-center">
                            <Hospital className="text-white" />
                            <p className={`text-white font-medium`}>Hospital</p>
                        </Link>
                    </li>

                    <li className={`px-5 py-3 rounded-[4px] min-w-[232px] ${pathname.startsWith("/reward") ? "bg-white bg-opacity-20 text-black" : "bg-transparent"}`}>
                        <Link href="/reward" className="flex flex-row gap-3 items-center">
                            <Gift className="text-white" />
                            <p className={`text-white font-medium`}>Reward</p>
                        </Link>
                    </li>

                    <li className={`px-5 py-3 rounded-[4px] min-w-[232px] ${pathname.startsWith("/faq") ? "bg-white bg-opacity-20 text-black" : "bg-transparent"}`}>
                        <Link href="/faq" className="flex flex-row gap-3 items-center">
                            <MessageCircleQuestion className="text-white" />
                            <p className={`text-white font-medium`}>FAQ</p>
                        </Link>
                    </li>

                    <li className={`px-5 py-3 rounded-[4px] min-w-[232px] ${pathname.startsWith("/user") ? "bg-white bg-opacity-20 text-black" : "bg-transparent"}`}>
                        <Link href="/user" className="flex flex-row gap-3 items-center">
                            <UserRound className="text-white" />
                            <p className={`text-white font-medium`}>User</p>
                        </Link>
                    </li>

                </ul>
                <ul>
                    <li className="flex flex-row justify-between px-10 py-3 rounded-[4px] min-w-[232px] bg-transparent">
                        <div className="flex flex-row gap-3 items-center">
                            <CircleUserRound className="text-white" />
                            <p className={`text-white font-medium`}>
                                {/* {name} */}
                                {name ? name : "User"}
                            </p>
                        </div>

                        <button className="flex flex-row gap-3 items-center"
                            onClick={handleLogout} >
                            <LogOut className="text-white" />
                        </button>
                    </li>
                </ul>

            </div>
        </nav >
    )
}
