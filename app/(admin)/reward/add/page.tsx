"use client"

import { useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import Link from "next/link";

export default function Page() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        points: 0,
        stock: 0,
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate form fields
        if (!formData.name.trim()) {
            toast.error("Name is required");
            setIsSubmitting(false);
            return;
        }

        if (!formData.description.trim()) {
            toast.error("Description is required");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axiosInstance.post(`/api/v1/reward/create`, {
                name: formData.name,
                description: formData.description,
                points: formData.points,
                stock: formData.stock,
            });

            console.log("Creation response:", response.data);

            // Show success toast first
            toast.success('Reward has been created');

            // Wait a moment for the toast to be visible before redirecting
            setTimeout(() => {
                router.push(`/reward/${response.data.data.id || response.data.data.reward.id}`);
            }, 1000);
        } catch (error) {
            console.error("Error creating reward:", error);
            setError('An error occurred while creating reward');
            toast.error('An error occurred while creating reward');
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
            <Navbar title="Add Reward" />
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
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Description</label>
                                </div>
                                <input type="text" className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Stock</label>
                                </div>
                                <input
                                    className="border border-gray2 rounded-[4px] p-4"
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Points</label>
                                </div>
                                <input
                                    className="border border-gray2 rounded-[4px] p-4"
                                    type="number"
                                    value={formData.points}
                                    onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>


                </div>
                <div className="flex flex-row justify-end pt-6">
                    <Link href="/reward">
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