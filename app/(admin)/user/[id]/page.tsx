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
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        gender: '',
        dob: '',
        blood_type: '',
        is_admin: false,
        point: 0,
        donation_count: 0,
        request_count: 0,
        last_login: '',
        created_at: '',
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`/api/v1/user/detail/${id}`);
                console.log(response, 'response')

                const Data = response.data.data;

                // Format dates for display
                const dobFormatted = Data.dob ? new Date(Data.dob).toLocaleDateString() : '';
                const lastLoginFormatted = Data.last_login ? new Date(Data.last_login).toLocaleString() : '';
                const createdAtFormatted = Data.created_at ? new Date(Data.created_at).toLocaleString() : '';

                setFormData({
                    firstname: Data.firstname || '',
                    lastname: Data.lastname || '',
                    email: Data.email || '',
                    phone: Data.phone || '',
                    gender: Data.gender || '',
                    dob: dobFormatted,
                    blood_type: Data.blood_type || '',
                    is_admin: Data.is_admin || false,
                    point: Data.point || 0,
                    donation_count: Data.donation_count || 0,
                    request_count: Data.request_count || 0,
                    last_login: lastLoginFormatted,
                    created_at: createdAtFormatted,
                });
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
        return <div className="w-full h-screen flex items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <div className="h-full min-h-screen">
            <Navbar title="User Detail" />
            <div className="py-6 px-8">
                <div className="w-full bg-white p-6 rounded-[8px]">
                    <div className="flex flex-row gap-6">
                        <div className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">First Name</label>
                                    </div>
                                    <p className="rounded-[4px] py-1 text-gray-700">{formData.firstname}</p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Last Name</label>
                                    </div>
                                    <p className="rounded-[4px] py-1 text-gray-700">{formData.lastname}</p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Email</label>
                                    </div>
                                    <p className="rounded-[4px] py-1 text-gray-700">{formData.email}</p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Phone</label>
                                    </div>
                                    <p className="rounded-[4px] py-1 text-gray-700">{formData.phone}</p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Gender</label>
                                    </div>
                                    <p className="rounded-[4px] py-1 text-gray-700 capitalize">{formData.gender}</p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Date of Birth</label>
                                    </div>
                                    <p className="rounded-[4px] py-1 text-gray-700">{formData.dob}</p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Blood Type</label>
                                    </div>
                                    <p className="rounded-[4px] py-1 text-gray-700">{formData.blood_type}</p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Is Admin</label>
                                    </div>
                                    <p className="rounded-[4px] py-1 text-gray-700">
                                        <span className={`px-2 py-1 rounded text-sm ${formData.is_admin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {formData.is_admin ? 'Yes' : 'No'}
                                        </span>
                                    </p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Points</label>
                                    </div>
                                    <p className="rounded-[4px] py-1 text-gray-700 font-semibold">{formData.point}</p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Donation Count</label>
                                    </div>
                                    <p className="rounded-[4px] py-1 text-gray-700">{formData.donation_count}</p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Request Count</label>
                                    </div>
                                    <p className="rounded-[4px] py-1 text-gray-700">{formData.request_count}</p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Last Login</label>
                                    </div>
                                    <p className="rounded-[4px] py-1 text-gray-700">{formData.last_login}</p>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Created At</label>
                                    </div>
                                    <p className="rounded-[4px] py-1 text-gray-700">{formData.created_at}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row justify-end pt-6 gap-4">
                    <Link href="/user">
                        <button className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">
                            Back to List
                        </button>
                    </Link>
                    <Link href={`/user/${id}/edit`}>
                        <button className="bg-primary text-white font-semibold text-base rounded-[4px] w-[150px] py-4">
                            Edit User
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}