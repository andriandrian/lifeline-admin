"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { axiosInstance } from "@/lib/axios"

export type News = {
  id: string
  title: string
  user: {
    firstname: string
  }
  createdAt: string
  index: number
}

export const columns: ColumnDef<News>[] = [
  {
    accessorKey: "index",
    header: () => <div className="w-4">No</div>,
    cell: ({ row }) => {
      return <div className="text-center w-4">{row.index + 1}</div>
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return <div className="">{row.original.title}</div>
    }
  },
  {
    accessorKey: "createdBy",
    header: "Created by",
    cell: ({ row }) => {
      return <div className="">{row.original.user.firstname}</div>
    }
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt)
      const formattedDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      return <div className="">{formattedDate}</div>
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
          axiosInstance.delete(`/api/v1/news/delete/${id}`)
            .then(function () {
              toast.success('News has been deleted')
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
        <div className="flex flex-row gap-2 w-32">
          <Link href={`/news/${id}`}>
            <button className="bg-secondary p-2">
              <Eye className="w-4" />
            </button>
          </Link>
          <Link href={`/news/${id}/edit`}>
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
