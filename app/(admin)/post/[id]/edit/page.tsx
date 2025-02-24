"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import axios from "axios";
import { logout } from "@/lib";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { X } from "lucide-react";
import { axiosInstance } from "@/lib/axios";

export default function Page() {
    const params = useParams();
    const id = params.id;
    const [priorityModal, setPriorityModal] = useState(false);
    const [closeModal, setCloseModal] = useState(false);
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

    const handleSetPriority = async (e: React.MouseEvent<HTMLButtonElement>) => {
        // e.preventDefault();
        console.log(e.currentTarget.textContent, 'priority')

        const formattedPriority = e.currentTarget.textContent?.toLowerCase();
        try {
            axiosInstance.patch(`/api/v1/donationRequest/updateStatus/${id}`, {
                priority: formattedPriority,
                type: 'VERIFY'
            })
                .then(function (response) {
                    console.log(response);
                    toast.success('Priority has been set')
                    setTimeout(() => {
                        window.location.reload()
                    }, 1500)
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 401) {
                logout();
            }
            setError(error instanceof Error ? error.message : 'An error occurred');
        }
    }

    const handleSubmitCloseRequest = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            axiosInstance.patch(`/api/v1/donationRequest/updateStatus/${id}`, {
                // reason: 'Donation Request Closed',
                type: 'CLOSE'
            })
                .then(function (response) {
                    console.log(response);
                    toast.success('Donation Request has been closed')
                    setTimeout(() => {
                        window.location.reload()
                    }, 1500)
                })
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 401) {
                logout();
            }
            setError(error instanceof Error ? error.message : 'An error occurred');
        }
    }

    const handleVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setPriorityModal(!priorityModal);
    }

    const handleClose = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setCloseModal(!closeModal);
    }

    if (error) {
        return <div className="w-full h-screen flex items-center justify-center text-red-500
        ">{error}</div>;
    }

    return (
        <div className="h-full min-h-screen">
            <Navbar title="Edit Donation Request" />
            {priorityModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 w-full h-full z-40 flex items-center justify-center">
                    <div className="bg-white  rounded-[8px] flex flex-col items-center justify-center">
                        <div className="flex flex-row w-full justify-end p-4">
                            <button onClick={() => setPriorityModal(!priorityModal)} className="">
                                <X />
                            </button>
                        </div>
                        <div className="py-10 pb-24 px-36 w-full items-center justify-center">
                            <h1 className="text-[20px] font-semibold text-black text-center">Set Priority</h1>
                            <div className="flex flex-row w-full gap-4 items-center justify-center mt-4">
                                <button
                                    value="low"
                                    onClick={handleSetPriority}
                                    className="px-4 py-2 text-[#416DC4] bg-[#EBF0FA] rounded-[25px] min-w-12">
                                    Low
                                </button>
                                <button
                                    value="mid"
                                    onClick={handleSetPriority}
                                    className="px-4 py-2 text-[#E99E2C] bg-[#FEF4E8] rounded-[25px] min-w-12">
                                    Mid
                                </button>
                                <button
                                    value="high"
                                    onClick={handleSetPriority}
                                    className="px-4 py-2 text-[#DA4F4C] bg-[#FBEDEB] rounded-[25px] min-w-12">
                                    High
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            )
            }
            {
                closeModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 w-full h-full z-40 flex items-center justify-center">
                        <div className="bg-white  rounded-[8px] flex flex-col items-center justify-center">
                            <div className="flex flex-row w-full justify-end p-4">
                                <button onClick={() => setCloseModal(!closeModal)} className="">
                                    <X />
                                </button>
                            </div>
                            <form onSubmit={handleSubmitCloseRequest} className="py-6 pb-12 px-12 w-[600px] items-center justify-center">
                                <h1 className="text-[20px] font-semibold text-black text-center">Close Donation Request</h1>
                                <textarea name="reason" className="w-full h-[200px] bg-[#F7F7F7] border border-gray2 rounded-[8px] mt-4 px-4 py-2" placeholder="Reason for closing the donation request" required
                                    value={formData.closeReason}
                                    onChange={(e) => setFormData({ ...formData, closeReason: e.target.value })}
                                />
                                <div className="flex flex-row w-full gap-4 items-center justify-end mt-4">
                                    <button
                                        type="submit"
                                        className="px-8 py-2 text-white bg-primary rounded-[12px] min-w-12">
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div >
                )
            }
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
                    {
                        formData.verifiedAt === 'Not Verified' ?
                            <button
                                onClick={handleVerify}
                                className="bg-primary text-white font-semibold text-[16px] py-4 px-14 rounded-[8px] ml-4"
                            >
                                Verify
                            </button>
                            : formData.closedAt === 'Not Closed' ?
                                <button
                                    onClick={handleClose}
                                    className="bg-primary text-white font-semibold text-[16px] py-4 px-14 rounded-[8px] ml-4"
                                >
                                    Close Donation Request
                                </button>
                                : null
                    }
                    <Link href="/post">
                        <button className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">Back</button>
                    </Link>
                </div>
            </form>
        </div>
    );
}