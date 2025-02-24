"use client"

import { logout } from "@/lib"
import { ColumnDef } from "@tanstack/react-table"
import axios from "axios"
import { Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { axiosInstance } from "@/lib/axios"

export type Hospital = {
  id: number
  name: string
  points: number
  stock: number
  index: number
}

export const columns: ColumnDef<Hospital>[] = [
  {
    accessorKey: "index",
    header: () => <div className="w-4">No</div>,
    cell: ({ row }) => {
      return <div className="text-center w-4">{row.index + 1}</div>
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <div className="">{row.original.name}</div>
    }
  },
  {
    accessorKey: "points",
    header: "Points",
    cell: ({ row }) => {
      return <div className="">{row.original.points}</div>
    }
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      return <div className="">{row.original.stock}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = Number(row.original.id)

      const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this data?")) {
          return null
        }
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        try {
          axiosInstance.delete(`${baseUrl}/api/v1/reward/delete/${id}`)
            .then(function () {
              toast.success('Reward has been deleted')
              setTimeout(() => {
                window.location.reload()
              }, 1500)
            })
            .catch(function (error) {
              console.log(error);
            })
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status == 401) {
            logout();
          }
          console.log(error)
        }
      }
      return (
        <div className="w-8">
          <div className="flex flex-row gap-2 w-32">
            <Link href={`/reward/${id}`}>
              <button className="bg-secondary p-2">
                <Eye className="w-4" />
              </button>
            </Link>
            <Link href={`/reward/${id}/edit`}>
              <button className="bg-secondary p-2">
                <Pencil className="w-4" />
              </button>
            </Link>
            <button className="bg-secondary p-2"
              onClick={() => {
                handleDelete(Number(id))
              }}
            >
              <Trash2 className="w-4 text-red-600" />
            </button>
          </div>
        </div>
      )
    },
  },
]
