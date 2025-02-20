import Navbar from "@/components/ui/navbar"

export default function Home() {
    return (
        <div className="h-full md:min-h-screen w-full">
            <Navbar title="Dashboard" />
            <div className="flex items-center justify-center">
                <h1>Dashboard</h1>
            </div>
        </div>
    );
}