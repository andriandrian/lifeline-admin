"use client"

import { useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function Page() {
    const router = useRouter();
    const [picture, setPicture] = useState<File | null>(null);
    const [imgData, setImgData] = useState<string | ArrayBuffer | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        imageUrl: "",
        image: "",
        user: "",
        startDate: "",
        endDate: "",
    });

    const onChangePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            console.log(picture)
            console.log("picture: ", e.target.files);
            setPicture(e.target.files[0]);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                return setImgData(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
            setFormData({ ...formData, image: URL.createObjectURL(e.target.files[0]) });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.image == "") {
            return toast.error("Image is required");
        }
        const userId = localStorage.getItem("userId")
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("image", picture as Blob);
            formDataToSend.append("userId", userId as string);
            formDataToSend.append("startDate", formData.startDate);
            formDataToSend.append("endDate", formData.endDate);
            formDataToSend.append("location", formData.location);

            axiosInstance.post(`/api/v1/event/create`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then(function (response) {
                    toast.success('Event has been created')
                    router.push(`/event/${response.data.data.event.id}`)
                    console.log(response);
                })
                .catch(function (error) {
                    toast.error(error.response.data.error);
                    console.log(error);
                });
        } catch (error) {
            console.error("Error creating event:", error);
            setError('An error occurred while creating event');
        }
    }

    if (error) {
        return <div className="w-full h-screen flex items-center justify-center text-red-500
        ">{error}</div>;
    }

    return (
        <div className="h-full min-h-screen">
            <Navbar title="Add Event" />
            <form className="py-6 px-8" onSubmit={handleSubmit}>
                <div className="w-full bg-white p-6 rounded-[8px]">
                    <div className="flex flex-row gap-6">
                        <div className="w-full">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Title</label>
                                </div>
                                <input type="text" className="border border-gray2 rounded-[4px] p-4"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Description</label>
                                </div>
                                <textarea name="description" className="p-4 min-h-[150px] border border-gray2 rounded-[4px]"
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Location</label>
                                </div>
                                <input type="text" className="border border-gray2 rounded-[4px] p-4"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <label className="text-[16px] text-black font-semibold">Image</label>
                                <input
                                    name="image"
                                    type="file"
                                    id="image"
                                    className="hidden"
                                    onChange={onChangePicture}
                                />
                                <div className="flex flex-row gap-4 items-center">
                                    <label
                                        htmlFor="image"
                                        className="w-fit px-6 border-[2px] border-primary bg-transparent rounded-[4px] py-4 text-sm font-normal cursor-pointer block text-primary text-center items-center justify-center"
                                    >
                                        <div className="flex flex-row items-center justify-center gap-3">
                                            {/* <Image src={PlusIcon} alt="Plus Icon" /> */}
                                            <Plus className="text-primary" />
                                            <p className="font-semibold text-base">
                                                Upload Image
                                            </p>
                                        </div>
                                        {/* File name uploaded */}
                                    </label>
                                    {picture && <p>{picture.name}</p>}
                                </div>
                                {/* <input type="file" className="border border-primary bg-transparent text-primary rounded-[4px] p-2 w-fit" onChange={onChangePicture} /> */}
                                {imgData && <div>
                                    {typeof imgData === 'string' && (
                                        <Image className="max-h-[200px] min-h-[200px] w-auto" src={imgData} alt="Preview" width={374.19} height={200} />
                                    )}
                                </div>
                                }
                                {formData.image && !imgData &&
                                    <Image src={formData.image} alt="Preview" width={374.19} height={200} />
                                }
                            </div>
                            {/* <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Created by</label>
                                </div>
                                <input type="text" className="rounded-[4px] py-1"
                                    value={formData.user}
                                    readOnly
                                />
                            </div> */}
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Start Date</label>
                                </div>
                                <input type="date" className="border border-gray2 rounded-[4px] p-4 w-fit"
                                    required
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">End Date</label>
                                </div>
                                <input type="date" className="border border-gray2 rounded-[4px] p-4 w-fit"
                                    required
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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