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

                const Data = await response.data.data.news;
                const date = new Date(Data.createdAt)
                const formattedDate = date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
                setFormData(
                    {
                        title: Data.title,
                        content: Data.content,
                        imageUrl: Data.imageUrl,
                        user: Data.user.firstname,
                        createdAt: formattedDate,
                    }
                )
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status == 401) {
                    logout();
                }
                setError(error instanceof Error ? error.message : 'An error occurred');
            }
        }

        fetchData();
    }, [id]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = Cookies.get('token');
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
        try {
            axios.put(`${baseUrl}/api/v1/news/update/${id}`, {
                title: formData.title,
                content: formData.content,
            }, config)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 401) {
                logout();
            }
            setError(error instanceof Error ? error.message : 'An error occurred');
        }
    }

    if (error) {
        return <div className="w-full h-screen flex items-center justify-center text-red-500
        ">{error}</div>;
    }

    return (
        <div className="h-full min-h-screen">
            <Navbar title="Edit News" />
            <form className="py-6 px-8" onSubmit={handleSubmit}>
                <div className="w-full bg-white p-6 rounded-[8px]">
                    <div className="flex flex-row gap-6">
                        <div className="w-full">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Title</label>
                                </div>
                                <input type="text" className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Content</label>
                                </div>
                                <textarea name="description" className="p-4 min-h-[150px] border border-gray2 rounded-[4px]"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Image</label>
                                </div>
                                {formData.imageUrl &&
                                    <Image className="border border-gray2 rounded-[4px] p-4 h-auto max-h-[300px]"
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
                                <input type="text" className="rounded-[4px] py-1"
                                    value={formData.user}
                                    readOnly
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Created at</label>
                                </div>
                                <input type="text" className="rounded-[4px] py-1"
                                    value={formData.createdAt}
                                    readOnly
                                />
                            </div>
                        </div>
                        {/* <div className="w-1/2">
                            <div className="flex flex-col gap-4">
                                <label className="text-[14px] text-gray2">Alt Image</label>
                                <input type="text" className="border border-gray2 rounded-[4px] p-2" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label className="text-[14px] text-gray2">Link</label>
                                <input type="text" className="border border-gray2 rounded-[4px] p-2" />
                            </div>
                        </div> */}
                    </div>

                </div>
                <div className="flex flex-row-reverse pt-6">
                    <button
                        type="submit"
                        className="bg-primary text-white font-semibold text-[16px] py-4 px-14 rounded-[8px] ml-4"
                    >
                        Save
                    </button>
                    <Link href="/news">
                        <button className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">Cancel</button>
                    </Link>
                </div>
            </form>
        </div>
    );
}