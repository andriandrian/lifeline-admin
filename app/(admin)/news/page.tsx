"use client"

import { useEffect, useState } from "react";
import { columns } from "./columns"
import { DataTable } from "./data-table"
import Navbar from "@/components/ui/navbar";

export default function Page() {
    const [data, setData] = useState<[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
                const response = await fetch(`${baseUrl}/news`);

                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }

                const Data = await response.json();
                console.log(Data.data.news, 'data');
                setData(Data.data.news);
            } catch (error) {
                console.log(error);
                setError(error instanceof Error ? error.message : 'An error occurred');
            }
        }

        fetchData();
    }, []);

    if (error) {
        console.log(error);
        // <div className="w-full h-screen flex items-center justify-center text-red-500
        // ">{error}</div>;
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