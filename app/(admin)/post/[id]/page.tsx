"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";

export default function Page() {
    const params = useParams();
    const id = params.id;
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [rejectionNote, setRejectionNote] = useState("");
    const [selectedPriority, setSelectedPriority] = useState("high");
    const [formData, setFormData] = useState({
        name: '',
        bloodType: '',
        description: '',
        hospital: '',
        hospitalAddress: '',
        gender: '',
        reason: '',
        priority: '',
        hospitalPhone: '',
        age: '',
        patientRecordNumber: '',
        patientDob: '',
        neededAt: '',
        createdAt: '',
        verifiedAt: '',
        rejectedAt: '',
        rejectionNote: '',
        closedAt: '',
        status: 'pending'
    });

    // Status update functions
    const handleVerify = async () => {
        setIsProcessing(true);
        try {
            await axiosInstance.patch(`/api/v1/donationRequest/updateStatus/${id}`, {
                type: 'VERIFY',
                priority: selectedPriority
            });

            toast.success('Donation Request verified successfully');
            setShowVerifyModal(false);
            // Refresh the page data
            window.location.reload();
        } catch (error) {
            console.error("Error verifying donation request:", error);
            toast.error('An error occurred while verifying the donation request');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionNote.trim()) {
            toast.error('Rejection note is required');
            return;
        }

        setIsProcessing(true);
        try {
            await axiosInstance.patch(`/api/v1/donationRequest/updateStatus/${id}`, {
                type: 'REJECT',
                rejectionNote: rejectionNote.trim()
            });

            toast.success('Donation Request rejected successfully');
            setShowRejectModal(false);
            // Refresh the page data
            window.location.reload();
        } catch (error) {
            console.error("Error rejecting donation request:", error);
            toast.error('An error occurred while rejecting the donation request');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = async () => {
        if (!confirm("Are you sure you want to close this donation request?")) {
            return;
        }

        setIsProcessing(true);
        try {
            await axiosInstance.patch(`/api/v1/donationRequest/updateStatus/${id}`, {
                type: 'CLOSE'
            });

            toast.success('Donation Request closed successfully');
            // Refresh the page data
            window.location.reload();
        } catch (error) {
            console.error("Error closing donation request:", error);
            toast.error('An error occurred while closing the donation request');
        } finally {
            setIsProcessing(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return 'text-green-600';
            case 'rejected': return 'text-red-600';
            case 'closed': return 'text-gray-600';
            default: return 'text-yellow-600';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'mid': return 'text-orange-600 bg-orange-100';
            case 'low': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`/api/v1/donationRequest/detail/${id}`);
                console.log(response.data.data, 'response')

                if (!response.data || !response.data.data) {
                    throw new Error("Invalid API response structure");
                }

                const Data = response.data.data;

                if (!Data) {
                    throw new Error("Donation request not found");
                }

                // Format dates
                const createdAt = new Date(Data.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const verifiedAt = Data.verifiedAt ?
                    new Date(Data.verifiedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : null;

                const rejectedAt = Data.rejectedAt ?
                    new Date(Data.rejectedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : null;

                const closedAt = Data.closedAt ?
                    new Date(Data.closedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : null;

                const patientDob = Data.patient_dob ?
                    new Date(Data.patient_dob).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }) : '';

                const neededAt = Data.needed_at ?
                    new Date(Data.needed_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }) : '';

                // Calculate patient age if DOB is available
                const patientAge = Data.patient_dob ?
                    Math.floor((Date.now() - new Date(Data.patient_dob).getTime()) / (1000 * 60 * 60 * 24 * 365)) :
                    'Unknown';

                // Determine status based on actual API data, not formatted dates
                let status = 'pending';
                if (Data.closedAt) status = 'closed';
                else if (Data.rejectedAt) status = 'rejected';
                else if (Data.verifiedAt) status = 'verified';

                console.log('Status determination:', {
                    verifiedAt: Data.verifiedAt,
                    rejectedAt: Data.rejectedAt,
                    closedAt: Data.closedAt,
                    finalStatus: status
                });

                const fullname = Data.user ? `${Data.user.firstname || ''} ${Data.user.lastname || ''}`.trim() : 'Unknown';

                setFormData({
                    name: fullname,
                    bloodType: Data.bloodType || 'Unknown',
                    description: Data.description || 'No description',
                    hospital: Data.hospital ? Data.hospital.name : 'Unknown',
                    hospitalAddress: Data.hospital ? Data.hospital.address : 'Unknown',
                    gender: Data.patientGender || 'Unknown',
                    reason: Data.reason || 'No reason provided',
                    priority: Data.priority || 'Unknown',
                    hospitalPhone: Data.hospital ? Data.hospital.phone : 'Unknown',
                    age: String(patientAge),
                    patientRecordNumber: Data.patientRecordNumber || 'Unknown',
                    patientDob: patientDob,
                    neededAt: neededAt,
                    createdAt: createdAt,
                    verifiedAt: verifiedAt || '',
                    rejectedAt: rejectedAt || '',
                    rejectionNote: Data.rejectionNote || '',
                    closedAt: closedAt || '',
                    status: status
                });

                // Set selected priority for verification
                setSelectedPriority(Data.priority || 'high');
            } catch (error) {
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
            <Navbar title="Donation Request Detail" />
            <div className="py-6 px-8">
                <div className="w-full bg-white p-6 rounded-[8px]">
                    {/* Status and Action Buttons */}
                    <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div>
                                <label className="block text-[14px] text-gray-600 mb-1">Status</label>
                                <p className={`text-[18px] font-bold capitalize ${getStatusColor(formData.status)}`}>
                                    {formData.status}
                                </p>
                            </div>
                            {formData.status === 'verified' && (
                                <div>
                                    <label className="block text-[14px] text-gray-600 mb-1">Priority</label>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(formData.priority)}`}>
                                        {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons - Only show if status is pending */}
                        {formData.status === 'pending' && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowVerifyModal(true)}
                                    disabled={isProcessing}
                                    className="bg-green-500 text-white font-semibold text-[14px] py-2 px-4 rounded-[4px] hover:bg-green-600 transition-colors disabled:opacity-50"
                                >
                                    {isProcessing ? 'Processing...' : 'Verify'}
                                </button>
                                <button
                                    onClick={() => setShowRejectModal(true)}
                                    disabled={isProcessing}
                                    className="bg-red-500 text-white font-semibold text-[14px] py-2 px-4 rounded-[4px] hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    Reject
                                </button>
                            </div>
                        )}

                        {/* Debug info - remove in production */}
                        <div className="text-xs text-gray-500 bg-gray-100 p-2 rounded">
                            Status: {formData.status} |
                            VerifiedAt: {formData.verifiedAt || 'null'} |
                            RejectedAt: {formData.rejectedAt || 'null'} |
                            ClosedAt: {formData.closedAt || 'null'}
                        </div>

                        {/* Close button - Only show if verified and not closed */}
                        {formData.status === 'verified' && (
                            <button
                                onClick={handleClose}
                                disabled={isProcessing}
                                className="bg-gray-500 text-white font-semibold text-[14px] py-2 px-4 rounded-[4px] hover:bg-gray-600 transition-colors disabled:opacity-50"
                            >
                                {isProcessing ? 'Processing...' : 'Close Request'}
                            </button>
                        )}
                    </div>

                    {/* Status Information */}
                    <div className="grid grid-cols-2 gap-4 mb-6 bg-blue-50 p-4 rounded-lg">
                        <div>
                            <label className="block text-[14px] text-gray-600 mb-1">Created At</label>
                            <p className="text-[16px] font-medium">{formData.createdAt}</p>
                        </div>
                        {formData.verifiedAt && (
                            <div>
                                <label className="block text-[14px] text-gray-600 mb-1">Verified At</label>
                                <p className="text-[16px] font-medium text-green-600">{formData.verifiedAt}</p>
                            </div>
                        )}
                        {formData.rejectedAt && (
                            <div>
                                <label className="block text-[14px] text-gray-600 mb-1">Rejected At</label>
                                <p className="text-[16px] font-medium text-red-600">{formData.rejectedAt}</p>
                            </div>
                        )}
                        {formData.closedAt && (
                            <div>
                                <label className="block text-[14px] text-gray-600 mb-1">Closed At</label>
                                <p className="text-[16px] font-medium text-gray-600">{formData.closedAt}</p>
                            </div>
                        )}
                    </div>

                    {/* Rejection Note */}
                    {formData.rejectionNote && (
                        <div className="mb-6 bg-red-50 p-4 rounded-lg">
                            <label className="block text-[14px] text-gray-600 mb-1">Rejection Note</label>
                            <p className="text-[16px] font-medium text-red-700">{formData.rejectionNote}</p>
                        </div>
                    )}

                    <div className="flex flex-row gap-6">
                        <div className="w-full flex flex-row gap-6">
                            <div className="w-1/2 flex flex-col gap-6">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Requester Name</label>
                                    </div>
                                    <p className="rounded-[4px]">
                                        {formData.name}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Patient Age</label>
                                    </div>
                                    <p className="rounded-[4px]">
                                        {formData.age} years old
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Patient Date of Birth</label>
                                    </div>
                                    <p className="rounded-[4px]">
                                        {formData.patientDob}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Blood Type Needed</label>
                                    </div>
                                    <p className="rounded-[4px] font-bold text-red-600">
                                        {formData.bloodType}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Patient Gender</label>
                                    </div>
                                    <p className="rounded-[4px] capitalize">
                                        {formData.gender}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Patient Record Number</label>
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
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${getPriorityColor(formData.priority)}`}>
                                        {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Needed At</label>
                                    </div>
                                    <p className="rounded-[4px]">
                                        {formData.neededAt}
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
                                        <label className="block text-[16px] font-semibold text-black">Description</label>
                                    </div>
                                    <p className="rounded-[4px] whitespace-pre-line">
                                        {formData.description}
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
                                        <label className="block text-[16px] font-semibold text-black">Hospital Address</label>
                                    </div>
                                    <p className="rounded-[4px]">
                                        {formData.hospitalAddress}
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

                <div className="flex flex-row justify-end gap-4 pt-6">
                    <Link href="/post">
                        <button className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">
                            Back
                        </button>
                    </Link>
                    <Link href={`/post/${id}/edit`}>
                        <button className="bg-primary text-white font-semibold text-base rounded-[4px] w-[150px] py-4">
                            Edit
                        </button>
                    </Link>
                </div>
            </div>

            {/* Verify Modal */}
            {showVerifyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Verify Donation Request</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedPriority}
                                onChange={(e) => setSelectedPriority(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="low">Low</option>
                                <option value="mid">Mid</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowVerifyModal(false);
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                disabled={isProcessing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVerify}
                                disabled={isProcessing}
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                            >
                                {isProcessing ? 'Verifying...' : 'Verify'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Reject Donation Request</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rejection Note <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={rejectionNote}
                                onChange={(e) => setRejectionNote(e.target.value)}
                                placeholder="Please provide a reason for rejection..."
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                rows={4}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionNote("");
                                }}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                                disabled={isProcessing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={isProcessing || !rejectionNote.trim()}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                            >
                                {isProcessing ? 'Rejecting...' : 'Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}