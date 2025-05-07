"use client"

import { useEffect, useState } from "react";
import { columns } from "./columns"
import { DataTable } from "./data-table"
import Navbar from "@/components/ui/navbar";
import { axiosInstance } from "@/lib/axios";
import axios from "axios";

export default function Page() {
    const [data, setData] = useState<[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get('/api/v1/reward/list');

                const Data = response.data;
                setData(Data.data.data);
            } catch (error) {
                console.log(error instanceof Error ? error.message : 'An error occurred');
                if (axios.isAxiosError(error) && error.response?.status === 500) {
                    setError(error.response.data.message);
                }
            }
        }

        fetchData();
    }, []);

    if (error) {
        <div className="w-full h-screen flex items-center justify-center text-red-500
        ">{error}</div>;
    }

    return (
        <div className="h-full md:min-h-screen">
            <Navbar title="Reward" />
            <div className="py-6 px-8">
                <div className="w-full bg-white p-6 rounded-[8px]">
                    <DataTable columns={columns} data={data} />
                </div>
            </div>
        </div>
    );
}