"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useParams } from "next/navigation";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";

export default function Page() {
    const params = useParams();
    const id = params.id;
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        createdBy: '',
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
                    createdBy: faqData.user?.firstname || 'Unknown',
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

    if (loading) {
        return (
            <div className="h-full min-h-screen">
                <Navbar title="FAQ Detail" />
                <div className="w-full h-[80vh] flex items-center justify-center">
                    <p className="text-lg">Loading FAQ data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full min-h-screen">
                <Navbar title="FAQ Detail" />
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
            <Navbar title="FAQ Detail" />
            <div className="py-6 px-8">
                <div className="w-full bg-white p-6 rounded-[8px]">
                    <div className="flex flex-row gap-6">
                        <div className="w-full">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Question</label>
                                </div>
                                <p className="rounded-[4px] py-1 text-gray-700">{formData.question}</p>
                            </div>

                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Answer</label>
                                </div>
                                <div className="rounded-[4px] py-1 text-gray-700 whitespace-pre-line">
                                    {formData.answer}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Created By</label>
                                </div>
                                <p className="rounded-[4px] py-1 text-gray-700">{formData.createdBy}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row justify-end gap-4 pt-6">
                    <Link href="/faq">
                        <button className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">Back</button>
                    </Link>
                    <Link href={`/faq/${id}/edit`}>
                        <button className="bg-primary text-white font-semibold text-base rounded-[4px] w-[150px] py-4">Edit</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}