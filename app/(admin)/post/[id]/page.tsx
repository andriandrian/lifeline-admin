"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import Cookies from 'js-cookie';
import axios from "axios";
import { logout } from "@/lib";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Page() {
    const params = useParams();
    const id = params.id;
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        imageUrl: "",
        user: "",
        createdAt: "",
    });

    useEffect(() => {
        const token = Cookies.get('token');
        async function fetchData() {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
                const config = {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }
                const response = await axios.get(`${baseUrl}/api/v1/news/detail/${id}`, config);
                console.log(response.data.data, 'response')

                const Data = response.data.data.news;
                const date = new Date(Data.createdAt)
                const formattedDate = date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
                setFormData({
                    title: Data.title,
                    content: Data.content,
                    imageUrl: Data.imageUrl,
                    user: Data.user.firstname,
                    createdAt: formattedDate,
                });
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status == 401) {
                    logout();
                }
                setError(error instanceof Error ? error.message : 'An error occurred');
            }
        }

        fetchData();
    }, [id]);

    if (error) {
        return <div className="w-full h-screen flex items-center justify-center text-red-500
        ">{error}</div>;
    }

    return (
        <div className="h-full min-h-screen">
            <Navbar title="Donation Request Detail" />
            <form className="py-6 px-8">
                <div className="w-full bg-white p-6 rounded-[8px]">
                    <div className="flex flex-row gap-6">
                        <div className="w-full">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Title</label>
                                </div>
                                <p className="rounded-[4px] py-1">
                                    {formData.title}
                                </p>
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Content</label>
                                </div>
                                <div className="py-1 whitespace-pre-line">{formData.content}</div>
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Image</label>
                                </div>
                                {formData.imageUrl &&
                                    <Image className="rounded-[4px] py-1 h-auto max-h-[300px]"
                                        src={formData.imageUrl}
                                        alt="Image"
                                        width={100}
                                        height={100}
                                    />
                                }
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Created by</label>
                                </div>
                                <p className="rounded-[4px] py-1">
                                    {formData.user}
                                </p>
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Created at</label>
                                </div>
                                <p className="rounded-[4px] py-1">
                                    {formData.createdAt}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex flex-row justify-end pt-6">
                    <Link href="/news">
                        <button className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">Back</button>
                    </Link>
                </div>
            </form>
        </div>
    );
}