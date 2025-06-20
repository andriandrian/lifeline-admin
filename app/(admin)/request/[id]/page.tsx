"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useParams } from "next/navigation";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";

export default function Page() {
    const params = useParams();
    const id = params.id;
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [donationData, setDonationData] = useState({
        referenceCode: '',
        bloodType: '',
        donorGender: '',
        donorDOB: '',
        donorName: '',
        donorEmail: '',
        donorPhone: '',
        requestReason: '',
        requestDescription: '',
        priority: '',
        patientRecordNumber: '',
        patientGender: '',
        hospitalName: '',
        neededAt: '',
        createdAt: '',
        confirmedAt: '',
        rejectedAt: '',
        rejectedReason: '',
        donatedAt: '',
        canceledAt: '',
        status: 'pending'
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`/api/v1/donation/detail/${id}`);
                const data = response.data.data;

                // Format dates
                const createdAt = data.createdAt ?
                    new Date(data.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : '';

                const confirmedAt = data.confirmedAt ?
                    new Date(data.confirmedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : '';

                const rejectedAt = data.rejectedAt ?
                    new Date(data.rejectedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : '';

                const donatedAt = data.donatedAt ?
                    new Date(data.donatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : '';

                const canceledAt = data.canceledAt ?
                    new Date(data.canceledAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : '';

                const donorDOB = data.donorDOB ?
                    new Date(data.donorDOB).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }) : '';

                const neededAt = data.donationRequest?.needed_at ?
                    new Date(data.donationRequest.needed_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }) : '';

                // Determine status
                let status = 'pending';
                if (data.donatedAt) {
                    status = 'donated';
                } else if (data.rejectedAt) {
                    status = 'rejected';
                } else if (data.canceledAt) {
                    status = 'canceled';
                } else if (data.confirmedAt) {
                    status = 'confirmed';
                }

                setDonationData({
                    referenceCode: data.referenceCode || '',
                    bloodType: data.bloodType || '',
                    donorGender: data.donorGender || '',
                    donorDOB: donorDOB,
                    donorName: `${data.user?.firstname || ''} ${data.user?.lastname || ''}`.trim(),
                    donorEmail: data.user?.email || '',
                    donorPhone: data.user?.phone || '',
                    requestReason: data.donationRequest?.reason || '',
                    requestDescription: data.donationRequest?.description || '',
                    priority: data.donationRequest?.priority || '',
                    patientRecordNumber: data.donationRequest?.patientRecordNumber || '',
                    patientGender: data.donationRequest?.patientGender || '',
                    hospitalName: data.donationRequest?.hospital?.name || '',
                    neededAt: neededAt,
                    createdAt: createdAt,
                    confirmedAt: confirmedAt,
                    rejectedAt: rejectedAt,
                    rejectedReason: data.rejectedReason || '',
                    donatedAt: donatedAt,
                    canceledAt: canceledAt,
                    status: status
                });
            } catch (error) {
                console.error("Error fetching donation data:", error);
                setError('An error occurred while fetching donation data');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="h-full min-h-screen">
                <Navbar title="Donation Request Detail" />
                <div className="w-full h-[80vh] flex items-center justify-center">
                    <p className="text-lg">Loading donation data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full min-h-screen">
                <Navbar title="Donation Request Detail" />
                <div className="w-full h-[80vh] flex flex-col items-center justify-center text-red-500">
                    <p className="text-xl mb-4">{error}</p>
                    <Link href="/request">
                        <button className="bg-primary text-white rounded-[4px] px-6 py-2">
                            Return to Requests
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'donated':
                return 'bg-green-100 text-green-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'canceled':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-[#FBEDEB] text-[#DA4F4C]';
            case 'mid':
                return 'bg-[#FEF4E8] text-[#E99E2C]';
            default:
                return 'bg-[#EBF0FA] text-[#416DC4]';
        }
    };

    return (
        <div className="h-full min-h-screen">
            <Navbar title="Donation Request Detail" />
            <div className="py-6 px-8">
                <div className="w-full bg-white p-6 rounded-[8px]">
                    {/* Header with status */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{donationData.referenceCode}</h2>
                            <p className="text-gray-600">Donation Request Details</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(donationData.status)}`}>
                            {donationData.status.charAt(0).toUpperCase() + donationData.status.slice(1)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Donor Information */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Donor Information</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Donor Name</label>
                                    <p className="text-base text-gray-900">{donationData.donorName || 'N/A'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Email</label>
                                    <p className="text-base text-gray-900">{donationData.donorEmail || 'N/A'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Phone</label>
                                    <p className="text-base text-gray-900">{donationData.donorPhone || 'N/A'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Blood Type</label>
                                    <p className="text-base font-semibold text-red-600">{donationData.bloodType}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Gender</label>
                                    <p className="text-base text-gray-900">{donationData.donorGender || 'N/A'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                                    <p className="text-base text-gray-900">{donationData.donorDOB || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Request Information */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Request Information</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Reason</label>
                                    <p className="text-base text-gray-900">{donationData.requestReason || 'N/A'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Description</label>
                                    <p className="text-base text-gray-900">{donationData.requestDescription || 'N/A'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Priority</label>
                                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(donationData.priority)}`}>
                                        {donationData.priority.charAt(0).toUpperCase() + donationData.priority.slice(1)}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Hospital</label>
                                    <p className="text-base text-gray-900">{donationData.hospitalName || 'N/A'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Patient Record Number</label>
                                    <p className="text-base text-gray-900">{donationData.patientRecordNumber || 'N/A'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Patient Gender</label>
                                    <p className="text-base text-gray-900">{donationData.patientGender || 'N/A'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Needed At</label>
                                    <p className="text-base text-gray-900">{donationData.neededAt || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline/Status Information */}
                    <div className="mt-8 border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Created At</label>
                                <p className="text-base text-gray-900">{donationData.createdAt || 'N/A'}</p>
                            </div>

                            {donationData.confirmedAt && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Confirmed At</label>
                                    <p className="text-base text-gray-900">{donationData.confirmedAt}</p>
                                </div>
                            )}

                            {donationData.rejectedAt && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Rejected At</label>
                                    <p className="text-base text-gray-900">{donationData.rejectedAt}</p>
                                </div>
                            )}

                            {donationData.donatedAt && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Donated At</label>
                                    <p className="text-base text-gray-900">{donationData.donatedAt}</p>
                                </div>
                            )}

                            {donationData.canceledAt && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Canceled At</label>
                                    <p className="text-base text-gray-900">{donationData.canceledAt}</p>
                                </div>
                            )}
                        </div>

                        {donationData.rejectedReason && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-600">Rejection Reason</label>
                                <p className="text-base text-gray-900 bg-red-50 p-3 rounded-md">{donationData.rejectedReason}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                    <Link href="/request">
                        <button className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">
                            Back
                        </button>
                    </Link>
                    <Link href={`/request/${id}/edit`}>
                        <button className="bg-primary text-white font-semibold text-base rounded-[4px] w-[150px] py-4">
                            Edit
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
} 