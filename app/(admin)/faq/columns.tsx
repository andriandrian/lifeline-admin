"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { axiosInstance } from "@/lib/axios"

export type Hospital = {
  id: number
  question: string
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
    accessorKey: "question",
    header: "Question",
    cell: ({ row }) => {
      return <div className="">{row.original.question}</div>
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
        try {
          axiosInstance.delete(`/api/v1/faq/delete/${id}`)
            .then(function () {
              toast.success('FAQ has been deleted')
              setTimeout(() => {
                window.location.reload()
              }, 1500)
            })
            .catch(function (error) {
              console.log(error);
            })
        } catch (error) {
          console.log(error)
        }
      }
      return (
        <div className="w-8">
          <div className="flex flex-row gap-2 w-32">
            <Link href={`/faq/${id}`}>
              <button className="bg-secondary p-2">
                <Eye className="w-4" />
              </button>
            </Link>
            <Link href={`/faq/${id}/edit`}>
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
