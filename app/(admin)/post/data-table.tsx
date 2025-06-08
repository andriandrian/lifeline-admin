"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
        state: {
            columnFilters,
        },
    })

    return (
        <div>
            <div className="flex items-center py-4 gap-6">
                <Input
                    placeholder="Search"
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="w-full p-4 h-full"
                />
                <div>
                    <select
                        value={(table.getColumn("priority")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("priority")?.setFilterValue(event.target.value)
                        }
                        className="border border-gray2 rounded-[4px] p-4 border-opacity-30"
                    >
                        <option value="">All</option>
                        <option value="low">Low</option>
                        <option value="mid">Mid</option>
                        <option value="high">High</option>
                    </select>
                </div>
                {/* <Link href="/news/add" className="flex flex-row px-6 py-4 rounded-sm items-center bg-primary text-white">
                    <Plus className="mr-2" />
                    <p className="text-[16px] font-semibold text-nowrap pr-4">
                        Add Post
                    </p>
                </Link> */}
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-row justify-between items-center py-1">
                <div>
                    <span className="text-black">
                        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} -{" "}
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                            table.getCoreRowModel().rows.length
                        )}{" "}
                        of {table.getCoreRowModel().rows.length}
                    </span>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="border-none"
                    >
                        <ChevronLeft />
                    </Button>
                    <div>
                        {[...Array(table.getPageCount()).keys()].map((page) => (
                            <Button
                                key={page}
                                // variant={table.getState().pagination.pageIndex === page ? "default" : "outline"}
                                variant="outline"
                                size="sm"
                                onClick={() => table.setPageIndex(page)}
                                className={`border-none ${table.getState().pagination.pageIndex === page ? "text-black" : "text-gray2"}`}
                            >
                                {page + 1}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="border-none"
                    >
                        <ChevronRight />
                    </Button>
                </div>
            </div>
        </div >
    )
}
