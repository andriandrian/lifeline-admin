"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { axiosInstance } from "@/lib/axios"

export type Post = {
  id: number
  user: {
    firstname: string
    lastname: string
  }
  reason: string
  priority: string
  hospital: {
    name: string
  }
  index: number
}

export const columns: ColumnDef<Post>[] = [
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
    filterFn: (row, columnId, value) => {
      const firstname = row.original.user.firstname.toLowerCase();
      const lastname = row.original.user.lastname.toLowerCase();
      const fullname = `${firstname} ${lastname}`;
      return fullname.includes(value.toLowerCase());
    },
    cell: ({ row }) => {
      const firstname = row.original.user.firstname;
      const lastname = row.original.user.lastname;
      const fullname = firstname + ' ' + lastname;
      return <div className="">{fullname}</div>;
    }
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => {
      return <div className="">{row.original.reason}</div>
    }
  },
  {
    accessorKey: "hospital",
    header: "Hospital",
    cell: ({ row }) => {
      return <div className="">{row.original.hospital.name}</div>
    }
  },
  {
    accessorKey: "priority",
    header: "Priority",
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId);

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
      const priority = row.original.priority
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
    id: "actions",
    cell: ({ row }) => {
      const id = Number(row.original.id)

      const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this data?")) {
          return null
        }
        try {
          axiosInstance.delete(`/api/v1/donationRequest/delete/${id}`)
            .then(function () {
              toast.success('Post has been deleted')
              setTimeout(() => {
                window.location.reload()
              }, 1500)
            })
            .catch(function (error) {
              console.log(error);
            })
        } catch (error) {
          console.error("Error deleting post:", error);
        }
      }

      return (
        <div className="flex flex-row gap-2 w-32">
          <Link href={`/post/${id}`}>
            <button className="bg-secondary p-2">
              <Eye className="w-4" />
            </button>
          </Link>
          <Link href={`/post/${id}/edit`}>
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
