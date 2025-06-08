"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        userId: '',
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`/api/v1/faq/detail/${id}`);
                console.log('Response data:', response.data);

                // Access data directly from response
                const faqData = response.data.data;

                setFormData({
                    question: faqData.question,
                    answer: faqData.answer,
                    userId: faqData.userId || faqData.user?.id || '',
                });
            } catch (error) {
                console.error("Error fetching FAQ:", error);
                setError('An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

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

        try {
            const response = await axiosInstance.put(`/api/v1/faq/update/${id}`, {
                question: formData.question.trim(),
                answer: formData.answer.trim(),
            });

            console.log('Update response:', response.data);
            toast.success('FAQ successfully updated');

            // Wait a moment for the toast to be visible before redirecting
            setTimeout(() => {
                router.push(`/faq/${id}`);
            }, 1000);
        } catch (error) {
            console.error("Error updating FAQ:", error);
            setError('An error occurred while updating FAQ');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="h-full min-h-screen">
                <Navbar title="Edit FAQ" />
                <div className="w-full h-[80vh] flex items-center justify-center">
                    <p className="text-lg">Loading FAQ data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full min-h-screen">
                <Navbar title="Edit FAQ" />
                <div className="w-full h-[80vh] flex flex-col items-center justify-center text-red-500">
                    <p className="text-xl mb-4">{error}</p>
                    <Link href="/faq">
                        <button className="bg-primary text-white rounded-[4px] px-6 py-2">
                            Return to FAQs
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full min-h-screen">
            <Navbar title="Edit FAQ" />
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
                    <Link href={`/faq/${id}`}>
                        <button type="button" className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">Cancel</button>
                    </Link>
                    <button
                        type="submit"
                        className="bg-primary text-white font-semibold text-base rounded-[4px] w-[150px] py-4 ml-4"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
}