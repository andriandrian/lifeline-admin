"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import axios from "axios";
import { useParams } from "next/navigation";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";

export default function Page() {
    const params = useParams();
    const id = params.id;
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`/api/v1/faq/detail/${id}`);
                console.log(response, 'response')

                const Data = await response.data.data.faq
                setFormData(
                    {
                        question: Data.question,
                        answer: Data.answer,
                    }
                )
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An error occurred');
                }
            }
        }

        fetchData();
    }, [id]);


    if (error) {
        return <div className="w-full h-screen flex items-center justify-center text-red-500
        ">{error}</div>;
    }

    return (
        <div className="h-full min-h-screen">
            <Navbar title="Frequently Asked Question Detail" />
            <form className="py-6 px-8">
                <div className="w-full bg-white p-6 rounded-[8px]">
                    <div className="flex flex-row gap-6">
                        <div className="w-full">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Question</label>
                                </div>
                                <p className="rounded-[4px] py-1">{formData.question}</p>

                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Answer</label>
                                </div>
                                <p className="rounded-[4px] py-1">{formData.answer}</p>

                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex flex-row justify-end pt-6">
                    <Link href="/reward">
                        <button className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">Back</button>
                    </Link>
                </div>
            </form>
        </div>
    );
}