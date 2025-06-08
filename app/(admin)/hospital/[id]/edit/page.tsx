"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";

export default function Page() {
    const params = useParams();
    const id = params.id;
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        website: "",
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`/api/v1/hospital/detail/${id}`);
                console.log(response, 'response')

                const Data = await response.data;
                setFormData(
                    {
                        name: Data.data.hospital.name,
                        address: Data.data.hospital.address,
                        phone: Data.data.hospital.phone,
                        email: Data.data.hospital.email,
                        website: Data.data.hospital.website,
                    }
                )
            } catch (error) {
                console.error("Error fetching hospital:", error);
                setError('An error occurred while fetching hospital');
            }
        }

        fetchData();
    }, [id]);


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            axiosInstance.put(`/api/v1/hospital/update/${id}`, {
                name: formData.name,
                address: formData.address,
                phone: formData.phone,
                email: formData.email,
                website: formData.website,
            })
                .then(function (response) {
                    toast.success('Hospital has been updated')
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            console.error("Error updating hospital:", error);
            setError('An error occurred while updating hospital');
        }
    }

    if (error) {
        return <div className="w-full h-screen flex items-center justify-center text-red-500
        ">{error}</div>;
    }

    return (
        <div className="h-full min-h-screen">
            <Navbar title="Edit Hospital" />
            <form className="py-6 px-8" onSubmit={handleSubmit}>
                <div className="w-full bg-white p-6 rounded-[8px]">
                    <div className="flex flex-row gap-6">
                        <div className="w-full">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Name</label>
                                </div>
                                <input type="text" className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Address</label>
                                </div>
                                <input type="text" className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Phone</label>
                                </div>
                                <input type="text" className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Email</label>
                                </div>
                                <input type="text" className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Website</label>
                                </div>
                                <input type="text" className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                />
                            </div>
                        </div>
                        {/* <div className="w-1/2">
                            <div className="flex flex-col gap-4">
                                <label className="text-[14px] text-gray2">Alt Image</label>
                                <input type="text" className="border border-gray2 rounded-[4px] p-2" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label className="text-[14px] text-gray2">Link</label>
                                <input type="text" className="border border-gray2 rounded-[4px] p-2" />
                            </div>
                        </div> */}
                    </div>

                </div>
                <div className="flex flex-row justify-end pt-6">
                    <button className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">Cancel</button>
                    <button className="bg-primary text-white rounded-[4px] w-[150px] py-4 ml-[30px]"
                        type="submit"
                    >Save</button>
                </div>
            </form>
        </div>
    );
}