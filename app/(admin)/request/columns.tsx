"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil } from "lucide-react"
import Link from "next/link"

export type DonationRequest = {
    id: number
    referenceCode: string
    bloodType: string
    user: {
        firstname: string
        lastname: string
    }
    donationRequest: {
        reason: string
        priority: string
    }
    createdAt: string
    confirmedAt: string | null
    rejectedAt: string | null
    donatedAt: string | null
    index: number
}

export const columns: ColumnDef<DonationRequest>[] = [
    {
        accessorKey: "index",
        header: () => <div className="w-4">No</div>,
        cell: ({ row }) => {
            return <div className="text-center w-4">{row.index + 1}</div>
        },
    },
    {
        accessorKey: "referenceCode",
        header: "Reference Code",
        cell: ({ row }) => {
            return <div className="font-mono text-sm">{row.original.referenceCode}</div>
        }
    },
    {
        accessorKey: "donorName",
        header: "Donor Name",
        filterFn: (row, columnId, value) => {
            const firstname = row.original.user.firstname.toLowerCase();
            const lastname = row.original.user.lastname.toLowerCase();
            const fullname = `${firstname} ${lastname}`;
            return fullname.includes(value.toLowerCase());
        },
        cell: ({ row }) => {
            const firstname = row.original.user.firstname;
            const lastname = row.original.user.lastname;
            const fullname = `${firstname} ${lastname}`.trim();
            return <div className="">{fullname}</div>;
        }
    },
    {
        accessorKey: "bloodType",
        header: "Blood Type",
        cell: ({ row }) => {
            return <div className="font-semibold text-red-600">{row.original.bloodType}</div>
        }
    },
    {
        accessorKey: "reason",
        header: "Reason",
        cell: ({ row }) => {
            return <div className="max-w-[200px] truncate">{row.original.donationRequest.reason}</div>
        }
    },
    {
        accessorKey: "priority",
        header: "Priority",
        filterFn: (row, columnId, value) => {
            const rowValue = row.original.donationRequest.priority;

            if (value === "all") {
                return true
            } else if (value === "low") {
                return rowValue === "low"
            } else if (value === "mid") {
                return rowValue === "mid"
            } else if (value === "high") {
                return rowValue === "high"
            } else {
                return true
            }
        },
        cell: ({ row }) => {
            const priority = row.original.donationRequest.priority
            let prio = 1

            if (priority == "low") {
                prio = 1
            } else if (priority == "mid") {
                prio = 2
            } else if (priority == "high") {
                prio = 3
            }

            return (
                <div className="flex flex-row gap-2">
                    <div className={`rounded-[50px] ${prio === 1 ? "bg-[#EBF0FA]" : prio === 2 ? "bg-[#FEF4E8]" : "bg-[#FBEDEB]"} px-4 py-2`}>
                        <p className={`${prio === 1 ? "text-[#416DC4]" : prio === 2 ? "text-[#E99E2C]" : "text-[#DA4F4C]"} font-semibold text-[14px]`}>
                            {
                                prio === 1 ? "Low" : prio === 2 ? "Mid" : "High"
                            }
                        </p>
                    </div>
                </div >
            )
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        filterFn: (row, columnId, value) => {
            const original = row.original;
            let status = "pending";

            if (original.donatedAt) {
                status = "donated";
            } else if (original.rejectedAt) {
                status = "rejected";
            } else if (original.confirmedAt) {
                status = "confirmed";
            }

            if (value === "all") {
                return true;
            } else {
                return status === value;
            }
        },
        cell: ({ row }) => {
            const original = row.original;
            let status = "pending";
            let statusColor = "bg-yellow-100 text-yellow-800";

            if (original.donatedAt) {
                status = "donated";
                statusColor = "bg-green-100 text-green-800";
            } else if (original.rejectedAt) {
                status = "rejected";
                statusColor = "bg-red-100 text-red-800";
            } else if (original.confirmedAt) {
                status = "confirmed";
                statusColor = "bg-blue-100 text-blue-800";
            }

            return (
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor} inline-block`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
            );
        }
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt)
            const formattedDate = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })

            return <div className="text-sm text-gray-600">{formattedDate}</div>
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const id = Number(row.original.id)

            return (
                <div className="flex flex-row gap-2 w-32">
                    <Link href={`/request/${id}`}>
                        <button className="bg-secondary p-2">
                            <Eye className="w-4" />
                        </button>
                    </Link>
                    <Link href={`/request/${id}/edit`}>
                        <button className="bg-secondary p-2">
                            <Pencil className="w-4" />
                        </button>
                    </Link>
                </div>
            )
        },
    },
] 