"use client"

import { useEffect, useState } from "react";
import { columns } from "./columns"
import { DataTable } from "./data-table"
import Navbar from "@/components/ui/navbar";
import axios from "axios";
import { axiosInstance } from "@/lib/axios";

export default function Page() {
    const [data, setData] = useState<[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get('/api/v1/event/list');

                const Data = await response.data.data.data;
                setData(Data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setError(error.response.data.error);
                } else {
                    setError('An error occurred');
                }
            }
        }

        fetchData();
    }, []);

    if (error) {
        console.log(error);
        <div className="w-full h-screen flex items-center justify-center text-red-500
        ">{error}</div>;
    }

    return (
        <div className="h-full md:min-h-screen">
            <Navbar title="Event" />
            <div className="py-6 px-8">
                <div className="w-full bg-white p-6 rounded-[8px]">
                    <DataTable columns={columns} data={data} />
                </div>
            </div>
        </div>
    );
}