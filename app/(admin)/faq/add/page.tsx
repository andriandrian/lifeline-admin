"use client"

import { useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import Link from "next/link";
import Cookies from 'js-cookie';

export default function Page() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        question: "",
        answer: ""
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate form fields
        if (!formData.question.trim()) {
            toast.error("Question is required");
            setIsSubmitting(false);
            return;
        }

        if (!formData.answer.trim()) {
            toast.error("Answer is required");
            setIsSubmitting(false);
            return;
        }

        // Get userId from cookies
        const userId = Cookies.get('userId');

        if (!userId) {
            toast.error("User ID not found. Please log in again.");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axiosInstance.post(`/api/v1/faq/create`, {
                question: formData.question.trim(),
                answer: formData.answer.trim(),
                userId: Number(userId)
            });

            console.log("Creation response:", response.data);

            // Show success toast first
            toast.success('FAQ has been created');

            // Wait a moment for the toast to be visible before redirecting
            setTimeout(() => {
                router.push(`/faq/${response.data.data.id || response.data.data.faq.id}`);
            }, 1000);
        } catch (error) {
            console.error("Error creating FAQ:", error);
            setError('An error occurred while creating FAQ');
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
            <Navbar title="Add FAQ" />
            <form className="py-6 px-8" onSubmit={handleSubmit}>
                <div className="w-full bg-white p-6 rounded-[8px]">
                    <div className="flex flex-row gap-6">
                        <div className="w-full">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Question</label>
                                </div>
                                <input type="text" className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Answer</label>
                                </div>
                                <textarea
                                    className="p-4 min-h-[150px] border border-gray2 rounded-[4px]"
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-end pt-6">
                    <Link href="/faq">
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