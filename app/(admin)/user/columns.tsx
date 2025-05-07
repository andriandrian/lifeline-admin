"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil } from "lucide-react"
import Link from "next/link"

export type User = {
  id: number
  firstname: string
  email: string
  index: number
  is_admin: boolean
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "index",
    header: () => <div className="w-4">No</div>,
    cell: ({ row }) => {
      return <div className="text-center w-4">{row.index + 1}</div>
    },
  },
  {
    accessorKey: "firstname",
    header: "Name",
    cell: ({ row }) => {
      return <div className="">{row.original.firstname}</div>
    }
  },
  {
    accessorKey: "is_admin",
    header: "Admin",
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId) as boolean

      if (value === "All") {
        return true
      } else if (value === "1") {
        return rowValue === true
      } else if (value === "0") {
        return rowValue === false
      } else {
        return true
      }
    },
    cell: ({ row }) => {
      return <div className="">{row.original.is_admin ? "Yes" : "No"}</div>
    }
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return <div className="">{row.original.email}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = Number(row.original.id)


      return (
        <div className="w-8">
          <div className="flex flex-row gap-2 w-32">
            <Link href={`/user/${id}`}>
              <button className="bg-secondary p-2">
                <Eye className="w-4" />
              </button>
            </Link>
            <Link href={`/user/${id}/edit`}>
              <button className="bg-secondary p-2">
                <Pencil className="w-4" />
              </button>
            </Link>
          </div>
        </div>
      )
    },
  },
]
