"use client"

import { useEffect, useState } from "react";
import { columns } from "./columns"
import { DataTable } from "./data-table"
import Navbar from "@/components/ui/navbar";
import axios from "axios";
import Cookies from 'js-cookie';
import { logout } from "@/lib";

export default function Page() {
    const [data, setData] = useState<[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = Cookies.get('token');
        async function fetchData() {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
                const config = {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }
                const response = await axios.get(`${baseUrl}/api/v1/news/list`, config);

                const Data = await response.data;
                setData(Data.data.news);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status == 401) {
                    logout();
                }
                setError(error instanceof Error ? error.message : 'An error occurred');
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
            <Navbar title="News" />
            <div className="py-6 px-8">
                <div className="w-full bg-white p-6 rounded-[8px]">
                    <DataTable columns={columns} data={data} />
                </div>
            </div>
        </div>
    );
}