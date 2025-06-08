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
        description: "",
        imageUrl: "",
        imageUrlFormatted: "",
        user: "",
        createdAt: "",
        startDate: "",
        endDate: "",
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`/api/v1/event/detail/${id}`);

                console.log('Full response:', response);
                console.log('Response data:', response.data);
                console.log('Response data.data:', response.data.data);
                console.log('Title from API:', response.data.data ? response.data.data.title : 'No title found');

                const Data = response.data.data;
                const createdAt = new Date(Data.createdAt)
                const formattedDate = createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
                const startDate = new Date(Data.startDate)
                const formatttedStartDate = startDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
                const endDate = new Date(Data.endDate)
                const formatttedEndDate = endDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })

                // Use the imageUrl directly from the API without concatenation
                // S3 URLs are already complete
                const imageUrlFormatted = Data.imageUrl;

                console.log('Image URL to display:', imageUrlFormatted);

                setFormData({
                    title: Data.title,
                    description: Data.description,
                    imageUrl: Data.imageUrl,
                    imageUrlFormatted: imageUrlFormatted,
                    user: Data.user.firstname,
                    startDate: formatttedStartDate,
                    endDate: formatttedEndDate,
                    createdAt: formattedDate,
                });
            } catch (error) {
                console.error("Error fetching events:", error);
                setError('An error occurred while fetching events');
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
            <Navbar title="Event Detail" />
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
                                    <label className="block text-[16px] font-semibold text-black">Description</label>
                                </div>
                                <div className="py-1 whitespace-pre-line">{formData.description}</div>
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
                                    <label className="block text-[16px] font-semibold text-black">Start date</label>
                                </div>
                                <p className="rounded-[4px] py-1">
                                    {formData.startDate}
                                </p>
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">End date</label>
                                </div>
                                <p className="rounded-[4px] py-1">
                                    {formData.endDate}
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
                    <Link href="/event">
                        <button className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">Back</button>
                    </Link>
                </div>
            </form>
        </div>
    );
}