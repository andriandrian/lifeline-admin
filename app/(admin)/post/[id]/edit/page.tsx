"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";

export default function Page() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [hospitals, setHospitals] = useState<{ id: number, name: string }[]>([]);
    const [additionalInfo, setAdditionalInfo] = useState({
        userName: '',
        userEmail: '',
        hospitalName: '',
        hospitalAddress: '',
        createdAt: '',
        verifiedAt: '',
        closedAt: '',
        patientDob: ''
    });
    const [formData, setFormData] = useState({
        reason: "",
        description: "",
        userId: "",
        bloodType: "",
        hospitalId: "",
        patientRecordNumber: "",
        patientGender: "",
        patientAge: "",
        needed_at_str: "",
        priority: ""
    });

    // Close Donation Request
    const handleCloseDonationRequest = async () => {
        if (!confirm("Are you sure you want to close this donation request?")) {
            return;
        }

        setIsClosing(true);

        try {
            await axiosInstance.patch(`/api/v1/donationRequest/updateStatus/${id}`, {
                type: 'CLOSE'
            });

            toast.success('Donation Request closed successfully');

            // Redirect to the donation requests list
            router.push('/post');
        } catch (error) {
            console.error("Error closing donation request:", error);
            toast.error('An error occurred while closing the donation request');
        } finally {
            setIsClosing(false);
        }
    }

    // Fetch hospitals for dropdown
    useEffect(() => {
        async function fetchHospitals() {
            try {
                const response = await axiosInstance.get('/api/v1/hospital/list');
                setHospitals(response.data.data.data);
            } catch (error) {
                console.error("Error fetching hospitals:", error);
            }
        }
        fetchHospitals();
    }, []);

    // Fetch existing donation request details
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axiosInstance.get(`/api/v1/donationRequest/detail/${id}`);
                const Data = response.data.data;

                // Convert date to YYYY-MM-DD format for date input
                const neededAtDate = Data.needed_at ?
                    new Date(Data.needed_at).toISOString().split('T')[0] :
                    '';

                // Calculate patient age
                const patientDob = Data.patient_dob ? new Date(Data.patient_dob) : null;
                const patientAge = patientDob ?
                    Math.floor((Date.now() - patientDob.getTime()) / (1000 * 60 * 60 * 24 * 365)) :
                    '';

                // Format dates
                const createdAt = Data.createdAt ?
                    new Date(Data.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : '';

                const verifiedAt = Data.verifiedAt ?
                    new Date(Data.verifiedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : 'Not Verified';

                const closedAt = Data.closedAt ?
                    new Date(Data.closedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : 'Not Closed';

                // Set additional info
                setAdditionalInfo({
                    userName: `${Data.user.firstname} ${Data.user.lastname}`.trim(),
                    userEmail: Data.user.email,
                    hospitalName: Data.hospital.name,
                    hospitalAddress: Data.hospital.address,
                    createdAt: createdAt,
                    verifiedAt: verifiedAt,
                    closedAt: closedAt,
                    patientDob: patientDob ? patientDob.toLocaleDateString() : ''
                });

                // Set form data
                setFormData({
                    reason: Data.reason || "",
                    description: Data.description || "",
                    userId: String(Data.userId) || "",
                    bloodType: Data.bloodType || "",
                    hospitalId: String(Data.hospitalId) || "",
                    patientRecordNumber: Data.patientRecordNumber || "",
                    patientGender: Data.patientGender || "",
                    patientAge: String(patientAge) || "",
                    needed_at_str: neededAtDate,
                    priority: Data.priority || ""
                });
            } catch (error) {
                console.error("Error fetching donation request:", error);
                setError('An error occurred while fetching donation request');
            }
        }

        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate form data
        if (!formData.reason.trim()) {
            toast.error("Reason is required");
            setIsSubmitting(false);
            return;
        }

        if (!formData.description.trim()) {
            toast.error("Description is required");
            setIsSubmitting(false);
            return;
        }

        if (!formData.hospitalId) {
            toast.error("Hospital is required");
            setIsSubmitting(false);
            return;
        }

        try {
            await axiosInstance.put(`/api/v1/donationRequest/update/${id}`, {
                reason: formData.reason.trim(),
                description: formData.description.trim(),
                userId: Number(localStorage.getItem('userId')),
                bloodType: formData.bloodType,
                hospitalId: Number(formData.hospitalId),
                patientRecordNumber: formData.patientRecordNumber,
                patientGender: formData.patientGender,
                patientAge: formData.patientAge,
                needed_at_str: formData.needed_at_str,
                priority: formData.priority || "low"
            });

            toast.success('Donation Request updated successfully');

            // Redirect to the donation request detail page
            router.push(`/post/${id}`);
        } catch (error) {
            console.error("Error updating donation request:", error);
            toast.error('An error occurred while updating donation request');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (error) {
        return (
            <div className="h-full min-h-screen">
                <Navbar title="Edit Donation Request" />
                <div className="w-full h-[80vh] flex flex-col items-center justify-center text-red-500">
                    <p className="text-xl mb-4">{error}</p>
                    <Link href="/post">
                        <button className="bg-primary text-white rounded-[4px] px-6 py-2">
                            Return to Donation Requests
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full min-h-screen">
            <Navbar title="Edit Donation Request" />
            <form className="py-6 px-8" onSubmit={handleSubmit}>
                <div className="w-full bg-white p-6 rounded-[8px]">
                    {/* Close Donation Request Button - Only show if not closed */}
                    {additionalInfo.closedAt === 'Not Closed' && (
                        <div className="flex justify-end mb-4">
                            <button
                                type="button"
                                onClick={handleCloseDonationRequest}
                                disabled={isClosing}
                                className="bg-red-500 text-white font-semibold text-[14px] py-2 px-6 rounded-[4px] hover:bg-red-600 transition-colors"
                            >
                                {isClosing ? 'Closing...' : 'Close Donation Request'}
                            </button>
                        </div>
                    )}

                    <div className="flex flex-row gap-6">
                        <div className="w-full">
                            {/* Additional Information Section */}
                            <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                                <div>
                                    <label className="block text-[14px] text-gray-600 mb-1">Requester Name</label>
                                    <p className="text-[16px] font-medium">{additionalInfo.userName}</p>
                                </div>
                                <div>
                                    <label className="block text-[14px] text-gray-600 mb-1">Requester Email</label>
                                    <p className="text-[16px] font-medium">{additionalInfo.userEmail}</p>
                                </div>
                                <div>
                                    <label className="block text-[14px] text-gray-600 mb-1">Hospital</label>
                                    <p className="text-[16px] font-medium">{additionalInfo.hospitalName}</p>
                                </div>
                                <div>
                                    <label className="block text-[14px] text-gray-600 mb-1">Hospital Address</label>
                                    <p className="text-[16px] font-medium">{additionalInfo.hospitalAddress}</p>
                                </div>
                                <div>
                                    <label className="block text-[14px] text-gray-600 mb-1">Created At</label>
                                    <p className="text-[16px] font-medium">{additionalInfo.createdAt}</p>
                                </div>
                                <div>
                                    <label className="block text-[14px] text-gray-600 mb-1">Verified At</label>
                                    <p className="text-[16px] font-medium">{additionalInfo.verifiedAt}</p>
                                </div>
                                <div>
                                    <label className="block text-[14px] text-gray-600 mb-1">Closed At</label>
                                    <p className={`text-[16px] font-medium ${additionalInfo.closedAt === 'Not Closed' ? 'text-green-600' : 'text-red-600'}`}>
                                        {additionalInfo.closedAt}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-[14px] text-gray-600 mb-1">Patient Date of Birth</label>
                                    <p className="text-[16px] font-medium">{additionalInfo.patientDob}</p>
                                </div>
                            </div>

                            {/* Existing Form Fields */}
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Reason</label>
                                </div>
                                <input
                                    type="text"
                                    className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Description</label>
                                </div>
                                <textarea
                                    className="p-4 min-h-[150px] border border-gray2 rounded-[4px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Hospital</label>
                                </div>
                                <select
                                    className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.hospitalId}
                                    onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Hospital</option>
                                    {hospitals.map((hospital) => (
                                        <option key={hospital.id} value={hospital.id}>
                                            {hospital.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Blood Type</label>
                                </div>
                                <select
                                    className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.bloodType}
                                    onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                                >
                                    <option value="">Select Blood Type</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="AB">AB</option>
                                    <option value="O">O</option>
                                </select>
                            </div>
                            <div className="flex flex-row gap-6 mt-6">
                                <div className="w-1/2 flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Patient Record Number</label>
                                    </div>
                                    <input
                                        type="text"
                                        className="border border-gray2 rounded-[4px] p-4"
                                        value={formData.patientRecordNumber}
                                        onChange={(e) => setFormData({ ...formData, patientRecordNumber: e.target.value })}
                                    />
                                </div>
                                <div className="w-1/2 flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Patient Gender</label>
                                    </div>
                                    <select
                                        className="border border-gray2 rounded-[4px] p-4"
                                        value={formData.patientGender}
                                        onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-row gap-6 mt-6">
                                <div className="w-1/2 flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Patient Age</label>
                                    </div>
                                    <input
                                        type="number"
                                        className="border border-gray2 rounded-[4px] p-4"
                                        value={formData.patientAge}
                                        onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                                    />
                                </div>
                                <div className="w-1/2 flex flex-col gap-4">
                                    <div className="flex flex-row w-full justify-between">
                                        <label className="block text-[16px] font-semibold text-black">Needed At</label>
                                    </div>
                                    <input
                                        type="date"
                                        className="border border-gray2 rounded-[4px] p-4"
                                        value={formData.needed_at_str}
                                        onChange={(e) => setFormData({ ...formData, needed_at_str: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 mt-6">
                                <div className="flex flex-row w-full justify-between">
                                    <label className="block text-[16px] font-semibold text-black">Priority</label>
                                </div>
                                <select
                                    className="border border-gray2 rounded-[4px] p-4"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="low">Low</option>
                                    <option value="mid">Mid</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row-reverse pt-6">
                    <button
                        type="submit"
                        className="bg-primary text-white font-semibold text-[16px] py-4 px-14 rounded-[8px] ml-4"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                    <Link href="/post">
                        <button type="button" className="bg-white border-[1px] border-gray2 text-gray2 font-semibold text-base rounded-[4px] w-[150px] py-4">
                            Cancel
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    );
}