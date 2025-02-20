"use client"

export default function Navbar(params: { title: string }) {

    return (
        <header className="flex flex-row justify-between bg-white px-4 py-3 md:py-7 md:px-8 items-center">
            <h1 className="text-base md:text-2xl font-medium">{params.title}</h1>
        </header>
    )
}