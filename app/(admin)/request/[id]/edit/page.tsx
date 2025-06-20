"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import Cookies from 'js-cookie';

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [donationData, setDonationData] = useState({
        referenceCode: '',
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
    const [formData, setFormData] = useState({
        bloodType: "",
        donorGender: "",
        donorDOB: ""
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`/api/v1/donation/detail/${id}`);
                const data = response.data.data;

                // Format dates for display
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

                const neededAt = data.donationRequest?.needed_at ?
                    new Date(data.donationRequest.needed_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }) : '';

                // Format DOB for date input (YYYY-MM-DD)
                const donorDOBFormatted = data.donorDOB ?
                    new Date(data.donorDOB).toISOString().split('T')[0] : '';

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

                setFormData({
                    bloodType: data.bloodType || "",
                    donorGender: data.donorGender || "",
                    donorDOB: donorDOBFormatted
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axiosInstance.put(`/api/v1/donation/update/${id}`, {
                bloodType: formData.bloodType,
                donorGender: formData.donorGender,
                donorDOB: formData.donorDOB
            });

            toast.success('Donation request updated successfully');
            router.push(`/request/${id}`);
        } catch (error) {
            console.error("Error updating donation request:", error);
            toast.error('An error occurred while updating donation request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusAction = async (action: string) => {
        setActionLoading(action);

        try {
            let requestBody: any = { type: action };

            if (action === 'REJECT') {
                if (!rejectionReason.trim()) {
                    toast.error('Rejection reason is required');
                    setActionLoading(null);
                    return;
                }
                const userId = Cookies.get('userId');
                requestBody = {
                    type: 'REJECT',
                    rejectionReason: rejectionReason,
                    updatedBy: Number(userId)
                };
            }

            await axiosInstance.patch(`/api/v1/donation/updateStatus/${id}`, requestBody);

            const actionText = action === 'VERIFY' ? 'verified' : action === 'CANCEL' ? 'canceled' : 'rejected';
            toast.success(`Donation request ${actionText} successfully`);

            setShowRejectionModal(false);
            setRejectionReason("");

            // Refresh the page to show updated status
            window.location.reload();
        } catch (error) {
            console.error(`Error ${action.toLowerCase()}ing donation request:`, error);
            toast.error(`An error occurred while ${action.toLowerCase()}ing donation request`);
        } finally {
            setActionLoading(null);
        }
    };

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

    if (loading) {
        return (
            <div className="h-full min-h-screen">
                <Navbar title="Edit Donation Request" />
                <div className="w-full h-[80vh] flex items-center justify-center">
                    <p className="text-lg">Loading donation data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full min-h-screen">
                <Navbar title="Edit Donation Request" />
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

    return (
        <div className="h-full min-h-screen">
            <Navbar title="Edit Donation Request" />

            {/* Rejection Modal */}
            {showRejectionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Reject Donation Request</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Rejection Reason
                            </label>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-md"
                                rows={4}
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter reason for rejection..."
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowRejectionModal(false);
                                    setRejectionReason("");
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleStatusAction('REJECT')}
                                disabled={actionLoading === 'REJECT'}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                            >
                                {actionLoading === 'REJECT' ? 'Rejecting...' : 'Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="py-6 px-8">
                <div className="w-full bg-white p-6 rounded-[8px]">
                    {/* Header with status and action buttons */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{donationData.referenceCode}</h2>
                            <p className="text-gray-600">Edit Donation Request</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(donationData.status)}`}>
                                {donationData.status.charAt(0).toUpperCase() + donationData.status.slice(1)}
                            </div>

                            {/* Action buttons based on status */}
                            {donationData.status === 'pending' && (
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleStatusAction('VERIFY')}
                                        disabled={actionLoading === 'VERIFY'}
                                        className="px-4 py-2 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 disabled:opacity-50"
                                    >
                                        {actionLoading === 'VERIFY' ? 'Verifying...' : 'Verify'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowRejectionModal(true)}
                                        disabled={actionLoading === 'REJECT'}
                                        className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}

                            {(donationData.status === 'confirmed' || donationData.status === 'pending') && (
                                <button
                                    type="button"
                                    onClick={() => handleStatusAction('CANCEL')}
                                    disabled={actionLoading === 'CANCEL'}
                                    className="px-4 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 disabled:opacity-50"
                                >
                                    {actionLoading === 'CANCEL' ? 'Canceling...' : 'Cancel'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Donation Information - Read Only */}
                    <div className="mb-8 bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Donor Name</label>
                                <p className="text-base text-gray-900">{donationData.donorName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                <p className="text-base text-gray-900">{donationData.donorEmail}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Phone</label>
                                <p className="text-base text-gray-900">{donationData.donorPhone}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Request Reason</label>
                                <p className="text-base text-gray-900">{donationData.requestReason}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Priority</label>
                                <p className="text-base text-gray-900">{donationData.priority}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Hospital</label>
                                <p className="text-base text-gray-900">{donationData.hospitalName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Editable Form */}
                    <form onSubmit={handleSubmit}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Editable Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-4">
                                <label className="block text-[16px] font-semibold text-black">Blood Type</label>
                                <select
                                    className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.bloodType}
                                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                                    required
                                >
                                    <option value="">Select Blood Type</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="block text-[16px] font-semibold text-black">Donor Gender</label>
                                <select
                                    className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.donorGender}
                                    onChange={(e) => setFormData({ ...formData, donorGender: e.target.value })}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-4">
                                <label className="block text-[16px] font-semibold text-black">Donor Date of Birth</label>
                                <input
                                    type="date"
                                    className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.donorDOB}
                                    onChange={(e) => setFormData({ ...formData, donorDOB: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Timeline Information */}
                        {(donationData.createdAt || donationData.confirmedAt || donationData.rejectedAt || donationData.donatedAt) && (
                            <div className="mt-8 border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {donationData.createdAt && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Created At</label>
                                            <p className="text-base text-gray-900">{donationData.createdAt}</p>
                                        </div>
                                    )}

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
                        )}

                        <div className="flex flex-row-reverse pt-6 gap-4">
                            <button
                                type="submit"
                                className="bg-primary text-white font-semibold text-[16px] py-4 px-14 rounded-[8px]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                            <Link href={`/request/${id}`}>
                                <button type="button" className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 