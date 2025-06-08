"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: '',
        dob: '',
        blood_type: '',
        is_admin: 0,
        point: 0,
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`/api/v1/user/detail/${id}`);
                console.log(response, 'response')

                const Data = response.data.data;

                // Format date for input field (YYYY-MM-DD)
                const dobFormatted = Data.dob ? new Date(Data.dob).toISOString().split('T')[0] : '';

                setFormData({
                    firstName: Data.firstname || '',
                    lastName: Data.lastname || '',
                    email: Data.email || '',
                    phone: Data.phone || '',
                    gender: Data.gender || '',
                    dob: dobFormatted,
                    blood_type: Data.blood_type || '',
                    is_admin: Data.is_admin ? 1 : 0, // Convert boolean to number
                    point: Data.point || 0,
                });
            } catch (error) {
                console.error("Error fetching user:", error);
                setError('An error occurred while fetching user');
            }
        }

        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                gender: formData.gender,
                phone: formData.phone,
                dob: formData.dob,
                blood_type: formData.blood_type
            };

            await axiosInstance.put(`/api/v1/user/update/${id}`, updateData);

            toast.success('User updated successfully');
            router.push(`/user/${id}`);
        } catch (error) {
            console.error("Error updating user:", error);
            setError('An error occurred while updating user');
        }
    };

    if (error) {
        return <div className="w-full h-screen flex items-center justify-center text-red-500
        ">{error}</div>;
    }

    return (
        <div className="h-full min-h-screen">
            <Navbar title="Edit User" />
            <form className="py-6 px-8" onSubmit={handleSubmit}>
                <div className="w-full bg-white p-6 rounded-[8px]">
                    <div className="flex flex-row gap-6">
                        <div className="w-full">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">First Name</label>
                                </div>
                                <input
                                    type="text"
                                    className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Last Name</label>
                                </div>
                                <input
                                    type="text"
                                    className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Email</label>
                                </div>
                                <input
                                    type="email"
                                    className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Phone</label>
                                </div>
                                <input
                                    type="tel"
                                    className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Gender</label>
                                </div>
                                <select
                                    className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Date of Birth</label>
                                </div>
                                <input
                                    type="date"
                                    className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.dob}
                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Blood Type</label>
                                </div>
                                <select
                                    className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.blood_type}
                                    onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                                    required
                                >
                                    <option value="">Select Blood Type</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="AB">AB</option>
                                    <option value="O">O</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Point</label>
                                </div>
                                <p className="rounded-[4px] py-1 text-gray-600">{formData.point} (Read-only)</p>
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
                    <Link href={`/user/${id}`}>
                        <button type="button" className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">
                            Cancel
                        </button>
                    </Link>
                    <button type="submit" className="bg-primary text-white font-semibold text-base rounded-[4px] w-[150px] py-4 ml-4">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}