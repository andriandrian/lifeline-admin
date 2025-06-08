"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { axiosInstance } from "@/lib/axios";

export default function Page() {
    const params = useParams();
    const id = params.id;
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        imageUrl: "",
        imageUrlFormatted: "",
        user: "",
        createdAt: "",
    });

    useEffect(() => {
        async function fetchData() {
            try {
                // Use the /api route which will be rewritten by Next.js
                const response = await axiosInstance.get(`/api/v1/news/detail/${id}`);
                console.log(response.data, 'response');

                const newsData = response.data.data;

                const date = new Date(newsData.createdAt)
                const formattedDate = date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });

                // Use the image URL directly from the API
                const imageUrlFormatted = newsData.imageUrl;

                setFormData({
                    title: newsData.title,
                    content: newsData.content,
                    imageUrl: newsData.imageUrl,
                    imageUrlFormatted: imageUrlFormatted,
                    user: newsData.user.firstname,
                    createdAt: formattedDate,
                });
            } catch (error) {
                console.error('Error fetching news data:', error);
                setError('Failed to load news data. Please try again later.');
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
            <Navbar title="News Detail" />
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
                                {formData.imageUrlFormatted &&
                                    <Image className="rounded-[4px] py-1 h-auto min-h-[200px] max-h-[300px]"
                                        src={formData.imageUrlFormatted}
                                        alt="Image"
                                        width={200}
                                        height={200}
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