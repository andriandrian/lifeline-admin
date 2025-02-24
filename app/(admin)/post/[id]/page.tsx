"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import axios from "axios";
import { logout } from "@/lib";
import { useParams } from "next/navigation";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";

export default function Page() {
    const params = useParams();
    const id = params.id;
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        bloodType: '',
        description: '',
        hospital: '',
        gender: '',
        reason: '',
        priority: '',
        hospitalPhone: '',
        age: '',
        patientRecordNumber: '',
        createdAt: '',
        verifiedAt: '',
        closeReason: '',
        closedAt: ''
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`api/v1/donationRequest/detail/${id}`);
                console.log(response.data.data, 'response')

                const Data = await response.data.data.donationRequest;
                const date = new Date(Data.createdAt)
                const formattedDate = date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
                const fullname = Data.user.firstname + ' ' + Data.user.lastname;
                setFormData(
                    {
                        name: fullname,
                        bloodType: Data.bloodType,
                        description: Data.description,
                        hospital: Data.hospital.name,
                        gender: Data.patientGender,
                        reason: Data.reason,
                        priority: Data.priority,
                        hospitalPhone: Data.hospital.phone,
                        age: Data.patientAge,
                        patientRecordNumber: Data.patientRecordNumber,
                        createdAt: formattedDate,
                        verifiedAt: Data.verifiedAt ? Data.verifiedAt : 'Not Verified',
                        closedAt: Data.closedAt ? Data.closedAt : 'Not Closed',
                        closeReason: ''
                    }
                )
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status == 401) {
                    logout();
                }
                setError(error instanceof Error ? error.message : 'An error occurred');
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
            <Navbar title="Edit Donation Request" />
            <form className="py-6 px-8">
                <div className="w-full bg-white p-6 rounded-[8px]">
                    <div className="flex flex-row gap-6">
                        <div className="w-full flex flex-row gap-6">
                            <div className="w-1/2 flex flex-col gap-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Name</label>
                                    </div>
                                    <p className="rounded-[4px]">
                                        {formData.name}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Age</label>
                                    </div>
                                    <p className="rounded-[4px]">
                                        {formData.age}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Blood Type</label>
                                    </div>
                                    <p className="rounded-[4px]">
                                        {formData.bloodType}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Gender</label>
                                    </div>
                                    <p className="rounded-[4px]">
                                        {formData.gender}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Record Number</label>
                                    </div>
                                    <p className="rounded-[4px]">
                                        {formData.patientRecordNumber}
                                    </p>
                                </div>
                            </div>
                            <div className="w-1/2 flex flex-col gap-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Priority</label>
                                    </div>
                                    <p className="rounded-[4px]">
                                        {formData.priority == "low" ? "Low" : formData.priority == "medium" ? "Medium" : "High"}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Description</label>
                                    </div>
                                    <p className="rounded-[4px]">
                                        {formData.description}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Reason</label>
                                    </div>
                                    <p className="rounded-[4px]">
                                        {formData.reason}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Hospital</label>
                                    </div>
                                    <p className="rounded-[4px]">
                                        {formData.hospital}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Hospital Phone</label>
                                    </div>
                                    <p className="rounded-[4px]">
                                        {formData.hospitalPhone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="flex flex-row-reverse pt-6">
                    {/* <button
                        type="submit"
                        className="bg-primary text-white font-semibold text-[16px] py-4 px-14 rounded-[8px] ml-4"
                    >
                        Save
                    </button> */}
                    <Link href="/post">
                        <button className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">Back</button>
                    </Link>
                </div>
            </form>
        </div>
    );
}