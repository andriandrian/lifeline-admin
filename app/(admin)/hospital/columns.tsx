"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "index",
    header: () => <div className="w-4">No</div>,
    cell: ({ row }) => {
      return <div className="text-center w-4">{row.index + 1}</div>
    },
  },
  {
    accessorKey: "title",
    header: "Name",
    cell: ({ row }) => {
      return <div className="">{row.original.amount}</div>
    }
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return <div className="">{row.original.status}</div>
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId);

      if (value === "all") {
        return true
      } else if (value === "active") {
        return rowValue === 1
      } else if (value === "inactive") {
        return rowValue === 0
      } else {
        return true
      }
    },
    cell: ({ row }) => {
      const status = Number(row.original.status)

      return (
        <div className="flex flex-row gap-2">
          <div className={`rounded-[50px] ${status === 1 ? "bg-[#dcf7e3]" : "bg-[#ebebeb]"} px-4 py-2`}>
            <p className={`${status === 1 ? "text-[#2FA84F]" : "text-gray2"} font-semibold text-[14px]`}>
              {status === 1 ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id

      return (
        <div className="flex flex-row gap-2 w-32">
          <Link href={`/news/${id}`}>
            <button className="bg-secondary p-2">
              <Eye />
            </button>
          </Link>
          <Link href={`/news/${id}/edit`}>
            <button className="bg-secondary p-2">
              <Pencil />
            </button>
          </Link>
          <button className="bg-secondary p-2">
            <Trash2 />
          </button>
        </div>
      )
    },
  },
]
