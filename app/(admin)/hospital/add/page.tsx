"use client"

import { useState } from "react";
import Navbar from "@/components/ui/navbar";
import Image from "next/image";
import { Plus } from "lucide-react";
import Cookies from 'js-cookie';

export default function Page() {
    const [picture, setPicture] = useState<File | null>(null);
    const [imgData, setImgData] = useState<string | ArrayBuffer | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: "",
        image: "",
        status: 1,
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
        const token = Cookies.get('token');
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                image_id: 4,
                status: formData.status,
                title: formData.title,
                description: formData.description,
                content: formData.content,
            }),
        };

        console.log(requestOptions);

        fetch(`${baseUrl}/news`, requestOptions)
            .then(async response => {
                const data = await response.json();
                console.log('Responsessssssss:', response.status, data);
                if (!response.ok) {
                    throw new Error(data.message || 'An error occurred while saving the banner');
                }
                console.log('Success:', data);
                // Add success handling here (e.g., redirect or show success message)
            })
            .catch(error => {
                console.error('Error:', error);
                setError(error instanceof Error ? error.message : 'An error occurred');
                // Add error handling here (e.g., show error message to user)
            });
    }

    if (error) {
        return <div className="w-full h-screen flex items-center justify-center text-red-500
        ">{error}</div>;
    }

    return (
        <div className="h-full min-h-screen">
            <Navbar title="News" />
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

                            <div className="flex flex-col gap-4 mt-4">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Description</label>
                                </div>
                                <textarea name="description" className="p-4 min-h-[150px] border-[1px] border-gray2 border-opacity-50"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex flex-col gap-4 mt-4">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Content</label>
                                </div>
                                <textarea name="description" className="p-4 min-h-[150px] border-[1px] border-gray2 border-opacity-50"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                />
                            </div>

                            <div className="flex flex-col gap-2 mt-4">
                                <label className="text-[16px] text-black font-semibold">Status</label>
                                <div className="flex flex-row gap-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="status"
                                            value={1}
                                            checked={formData.status === 1}
                                            onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                                            className="mr-2"
                                        />
                                        Active
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="status"
                                            value={0}
                                            checked={formData.status === 0}
                                            onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                                            className="mr-2"
                                        />
                                        Inactive
                                    </label>
                                </div>
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
                <div className="flex flex-row justify-end pt-6">
                    <button className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">Cancel</button>
                    <button className="bg-primary text-white rounded-[4px] w-[150px] py-4 ml-[30px]"
                        type="submit"
                    >Save</button>
                </div>
            </form>
        </div>
    );
}