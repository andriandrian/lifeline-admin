"use client"

import { useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Plus } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import Link from "next/link";
import Cookies from 'js-cookie';

export default function Page() {
    const router = useRouter();
    const [picture, setPicture] = useState<File | null>(null);
    const [imgData, setImgData] = useState<string | ArrayBuffer | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        image: "",
        user: "",
        createdAt: "",
    });

    const onChangePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Validate file type
            if (!file.type.includes('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            // Validate file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image must be less than 5MB');
                return;
            }

            setPicture(file);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                return setImgData(reader.result);
            });
            reader.readAsDataURL(file);
            setFormData({ ...formData, image: URL.createObjectURL(file) });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate form fields
        if (!formData.title.trim()) {
            toast.error("Title is required");
            setIsSubmitting(false);
            return;
        }

        if (!formData.content.trim()) {
            toast.error("Content is required");
            setIsSubmitting(false);
            return;
        }

        if (formData.image === "" && !picture) {
            toast.error("Image is required");
            setIsSubmitting(false);
            return;
        }

        const userId = Cookies.get('userId');

        if (!userId) {
            toast.error("User ID not found. Please log in again.");
            setIsSubmitting(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title.trim());
            formDataToSend.append('content', formData.content.trim());
            if (picture) {
                // Be explicit about the file name to ensure it's properly handled
                formDataToSend.append('image', picture, picture.name);
            }
            formDataToSend.append('userId', userId);

            // Log the form data for debugging
            console.log("Sending userId:", userId);
            console.log("Sending title:", formData.title);
            console.log("Sending content:", formData.content);
            console.log("Sending image:", picture ? picture.name : "No image");

            // Log formdata entries
            for (const pair of formDataToSend.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }

            // Use the /api route which will be rewritten by Next.js
            const response = await axiosInstance.post(`/api/v1/news/create`, formDataToSend);

            console.log("API Response:", response.data);
            toast.success('News has been created');
            router.push(`/news/${response.data.data.id}`);
        } catch (error) {
            console.error("Error submitting form:", error);
            setError('An error occurred while creating news');
            toast.error('An error occurred while creating news');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (error) {
        return <div className="w-full h-screen flex items-center justify-center text-red-500
        ">{error}</div>;
    }

    return (
        <div className="h-full min-h-screen">
            <Navbar title="Add News" />
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
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Content</label>
                                </div>
                                <textarea name="description" className="p-4 min-h-[150px] border border-gray2 rounded-[4px]"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    required
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
                                    accept="image/*"
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
                                    </label>
                                    {picture && <p>{picture.name}</p>}
                                </div>
                                {imgData && <div>
                                    {typeof imgData === 'string' && (
                                        <Image className="max-h-[200px] min-h-[200px] w-auto" src={imgData} alt="Preview" width={200} height={200} />
                                    )}
                                </div>
                                }
                                {formData.image && !imgData &&
                                    <Image src={formData.image} alt="Preview" width={374.19} height={200} />
                                }
                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex flex-row justify-end pt-6">
                    <Link href="/news">
                        <button type="button" className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">Cancel</button>
                    </Link>
                    <button
                        className="bg-primary text-white rounded-[4px] w-[150px] py-4 ml-[30px]"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
}