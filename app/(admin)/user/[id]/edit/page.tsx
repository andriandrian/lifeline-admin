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
        blood_type: '',
        is_admin: 0,
        point: 0,
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`/api/v1/user/detail/${id}`);
                console.log(response, 'response')

                const Data = await response.data.data
                setFormData(
                    {
                        firstname: Data.firstname,
                        lastname: Data.lastname,
                        email: Data.email,
                        phone: Data.phone,
                        gender: Data.gender,
                        blood_type: Data.blood_type,
                        is_admin: Data.is_admin,
                        point: Data.point,
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
            <Navbar title="Edit User" />
            <form className="py-6 px-8">
                <div className="w-full bg-white p-6 rounded-[8px]">
                    <div className="flex flex-row gap-6">
                        <div className="w-full">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">First Name</label>
                                </div>
                                <p className="rounded-[4px] py-1">{formData.firstname}</p>
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Last Name</label>
                                </div>
                                <p className="rounded-[4px] py-1">{formData.lastname}</p>
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Email</label>
                                </div>
                                <p className="rounded-[4px] py-1">{formData.email}</p>
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Phone</label>
                                </div>
                                <p className="rounded-[4px] py-1">{formData.phone}</p>
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Point</label>
                                </div>
                                <p className="rounded-[4px] py-1">{formData.point}</p>
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Is Admin</label>
                                </div>
                                <select className="rounded-[4px] py-1 border-2 border-gray2 w-fit min-w-24 px-2" name="is_admin" id="is_admin" value={formData.is_admin} onChange={(e) => setFormData({ ...formData, is_admin: Number(e.target.value) })}>
                                    <option value={0}>No</option>
                                    <option value={1}>Yes</option>
                                </select>
                            </div>

                        </div>
                    </div>

                </div>
                <div className="flex flex-row justify-end pt-6">
                    <Link href="/user">
                        <button className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">Back</button>
                    </Link>
                    <button type="submit" className="bg-primary text-white font-semibold text-base rounded-[4px] w-[150px] py-4 ml-4">Save</button>
                </div>
            </form>
        </div>
    );
}