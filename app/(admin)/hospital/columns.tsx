"use client"

import { logout } from "@/lib"
import { ColumnDef } from "@tanstack/react-table"
import axios from "axios"
import { Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import Cookies from 'js-cookie';

export type Hospital = {
  id: number
  name: string
  phone: string
  address: string
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
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      return <div className="">{row.original.phone}</div>
    }
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      return <div className="">{row.original.address}</div>
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
        const token = Cookies.get('token');

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        try {
          axios.delete(`${baseUrl}/api/v1/hospital/delete/${id}`, config)
            .then(function () {
              toast.success('Hospital has been deleted')
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
        <div className="flex flex-row gap-2 w-32">
          <Link href={`/hospital/${id}`}>
            <button className="bg-secondary p-2">
              <Eye className="w-4" />
            </button>
          </Link>
          <Link href={`/hospital/${id}/edit`}>
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
      )
    },
  },
]
