"use client"

import Navbar from "@/components/ui/navbar"
// import { useEffect } from "react";

export default function Home() {

    // useEffect(() => {
    //     async function fetchData() {

    //     }

    //     fetchData()
    // }, [])

    return (
        <div className="h-full md:min-h-screen w-full">
            <Navbar title="Dashboard" />
            <div className="flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-2">Card 1</h2>
                        <p className="text-gray-700">Content for card 1</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-2">Card 2</h2>
                        <p className="text-gray-700">Content for card 2</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-2">Card 3</h2>
                        <p className="text-gray-700">Content for card 3</p>
                    </div>
                </div>
            </div>
        </div>
    );
}