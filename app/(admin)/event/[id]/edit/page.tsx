"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function Page() {
    const params = useParams();
    const id = params.id;
    const [picture, setPicture] = useState<File | null>(null);
    const [imgData, setImgData] = useState<string | ArrayBuffer | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        image: "",
        imageUrl: "",
        imageUrlFormatted: "",
        user: "",
        userId: "",
        createdAt: "",
        startDate: "",
        endDate: "",
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

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`/api/v1/event/detail/${id}`);
                console.log('Full response:', response);
                console.log('Response data:', response.data);

                // Access the data directly from the response
                const eventData = response.data.data;

                const createdDate = new Date(eventData.createdAt);
                const formattedDate = createdDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });

                const startDate = new Date(eventData.startDate);
                const formattedStartDate = startDate.toISOString().split('T')[0];

                const endDate = new Date(eventData.endDate);
                const formattedEndDate = endDate.toISOString().split('T')[0];

                // Use the image URL directly from the API without concatenation
                const imageUrlFormatted = eventData.imageUrl;

                setFormData({
                    title: eventData.title,
                    description: eventData.description,
                    location: eventData.location,
                    image: '',
                    imageUrl: eventData.imageUrl,
                    imageUrlFormatted: imageUrlFormatted,
                    user: eventData.user.firstname,
                    userId: eventData.user.id,
                    createdAt: formattedDate,
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                });
            } catch (error) {
                console.error("Error fetching event data:", error);
                setError('An error occurred while loading event data');
            }
        }

        fetchData();
    }, [id]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('userId', formData.userId);
            formDataToSend.append('startDate', formData.startDate);
            formDataToSend.append('endDate', formData.endDate);
            formDataToSend.append('location', formData.location);

            if (picture) {
                // Be explicit about the file name to ensure it's properly handled
                formDataToSend.append('image', picture, picture.name);
            }

            // Log the form data for debugging
            console.log("Sending form data:", {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                startDate: formData.startDate,
                endDate: formData.endDate,
                userId: formData.userId,
                image: picture ? picture.name : 'No new image'
            });

            // Use the Next.js API route which will be rewritten
            const response = await axiosInstance.put(`/api/v1/event/update/${id}`, formDataToSend);

            toast.success('Event updated successfully');
            console.log('Update response:', response.data);

            // Redirect to the event detail page
            window.location.href = `/event/${id}`;
        } catch (error) {
            console.error("Error updating event:", error);
            setError('An error occurred while updating event');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (error) {
        return (
            <div className="h-full min-h-screen">
                <Navbar title="Edit Event" />
                <div className="w-full h-[80vh] flex flex-col items-center justify-center text-red-500">
                    <p className="text-xl mb-4">{error}</p>
                    <Link href="/event">
                        <button className="bg-primary text-white rounded-[4px] px-6 py-2">
                            Return to Events
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full min-h-screen">
            <Navbar title="Edit Event" />
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
                                    <label className="block text-[16px] font-semibold text-black">Description</label>
                                </div>
                                <textarea name="description" className="p-4 min-h-[150px] border border-gray2 rounded-[4px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Location</label>
                                </div>
                                <input type="text" className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                                        <Image className="max-h-[200px] min-h-[200px] w-auto" src={imgData} alt="Preview" width={374.19} height={200} />
                                    )}
                                </div>
                                }
                                {formData.imageUrlFormatted && !imgData &&
                                    <Image src={formData.imageUrlFormatted} alt="Preview" width={200} height={200} />
                                }
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Start Date</label>
                                </div>
                                <input type="date" className="border border-gray2 rounded-[4px] p-4 w-fit"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">End Date</label>
                                </div>
                                <input type="date" className="border border-gray2 rounded-[4px] p-4 w-fit"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
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
                    </div>

                </div>
                <div className="flex flex-row-reverse pt-6">
                    <button
                        type="submit"
                        className="bg-primary text-white font-semibold text-[16px] py-4 px-14 rounded-[8px] ml-4"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                    <Link href="/event">
                        <button className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">Cancel</button>
                    </Link>
                </div>
            </form>
        </div>
    );
}