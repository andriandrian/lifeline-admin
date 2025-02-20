import Link from "next/link"
import { Home } from "lucide-react"

export default function NotFound() {
    return (
        <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-background w-full">
            <div className="container flex max-w-[64rem] flex-col items-center justify-center gap-4 text-center">
                <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">404</h1>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">Page not found</h2>
                <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been moved or deleted.
                </p>
                <button className="gap-2 bg-black rounded-md py-3 px-4 text-white">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Home className="size-4" />
                        Return Home
                    </Link>
                </button>
            </div>
        </main>
    )
}

