"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useParams } from "next/navigation";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export default function Page() {
    const params = useParams();
    const id = params.id;
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        points: 0,
        stock: 0,
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`/api/v1/reward/detail/${id}`);
                console.log(response, 'response')

                const Data = await response.data.data.reward
                setFormData(
                    {
                        name: Data.name,
                        description: Data.description,
                        points: Data.points,
                        stock: Data.stock,
                    }
                )
            } catch (error) {
                console.error("Error fetching reward:", error);
                setError('An error occurred while fetching reward');
            }
        }

        fetchData();
    }, [id]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            axiosInstance.put(`/api/v1/reward/update/${id}`, {
                name: formData.name,
                description: formData.description,
                points: formData.points,
                stock: formData.stock,
            })
                .then(function (response) {
                    toast.success('Reward updated successfully');
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        }
    }

    if (error) {
        return <div className="w-full h-screen flex items-center justify-center text-red-500
        ">{error}</div>;
    }

    return (
        <div className="h-full min-h-screen">
            <Navbar title="Edit Reward" />
            <form className="py-6 px-8" onSubmit={handleSubmit}>
                <div className="w-full bg-white p-6 rounded-[8px]">
                    <div className="flex flex-row gap-6">
                        <div className="w-full">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Name</label>
                                </div>
                                <input type="text" className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Description</label>
                                </div>
                                <input type="text" className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">stock</label>
                                </div>
                                <input type="number" className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">points</label>
                                </div>
                                <input type="number" className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.points}
                                    onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex flex-row justify-end pt-6">
                    <Link href="/reward">
                        <button className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">Back</button>
                    </Link>
                    <button type="submit" className="bg-primary text-white font-semibold text-base rounded-[4px] w-[150px] py-4 ml-4">Save</button>
                </div>
            </form>
        </div>
    );
}