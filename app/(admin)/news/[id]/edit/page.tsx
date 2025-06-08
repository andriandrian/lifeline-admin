"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export default function Page() {
    const params = useParams();
    const id = params.id;
    const [picture, setPicture] = useState<File | null>(null);
    const [imgData, setImgData] = useState<string | ArrayBuffer | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        image: "",
        imageUrl: "",
        imageUrlFormatted: "",
        user: "",
        userId: "",
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

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`/api/v1/news/detail/${id}`);
                console.log(response.data, 'response');

                const newsData = response.data.data;

                const imageUrlFormatted = newsData.imageUrl;

                setFormData({
                    title: newsData.title,
                    content: newsData.content,
                    image: '',
                    imageUrl: newsData.imageUrl,
                    imageUrlFormatted: imageUrlFormatted,
                    user: newsData.user.firstname,
                    userId: newsData.user.id,
                });
            } catch (error) {
                console.error("Error fetching news:", error);
                setError('An error occurred while fetching news');
            }
        }

        fetchData();
    }, [id]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', formData.content);
            formDataToSend.append('userId', formData.userId);
            if (picture) {
                formDataToSend.append('image', picture);
            }

            const response = await axiosInstance.put(`/api/v1/news/update/${id}`, formDataToSend);
            toast.success('News updated successfully');
            console.log(response);
        } catch (error) {
            console.error("Error updating news:", error);
            setError('An error occurred while updating news');
            toast.error('An error occurred while updating news');
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
                                <label className="text-[16px] text-black font-semibold">Image/Video</label>
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
                                            <Plus className="text-primary" />
                                            <p className="font-semibold text-base">
                                                Upload Image
                                            </p>
                                        </div>
                                        {/* File name uploaded */}
                                    </label>
                                    {picture && <p>{(picture as File).name}</p>}
                                </div>
                                {/* <input type="file" className="border border-primary bg-transparent text-primary rounded-[4px] p-2 w-fit" onChange={onChangePicture} /> */}
                                {imgData && <div>
                                    {typeof imgData === 'string' && (
                                        <Image className="max-h-[200px] min-h-[200px] w-auto" src={imgData} alt="Preview" width={374.19} height={200} />
                                    )}
                                </div>
                                }
                                {formData.imageUrlFormatted && !imgData &&
                                    <Image src={formData.imageUrlFormatted} alt="Preview" width={200} height={200} />
                                }
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