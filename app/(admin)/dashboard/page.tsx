"use client"

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/navbar";
import { axiosInstance } from "@/lib/axios";
import { Users, Heart, Gift, Calendar, TrendingUp, Activity, Hospital, MessageCircle } from "lucide-react";
import Link from "next/link";

interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    is_admin: boolean;
}

interface Donation {
    id: number;
    name: string;
    bloodType: string;
}

interface DashboardStats {
    totalUsers: number;
    totalDonations: number;
    totalRequests: number;
    totalRewards: number;
    totalHospitals: number;
    totalEvents: number;
    totalNews: number;
    totalFaqs: number;
    recentUsers: User[];
    recentDonations: Donation[];
}

export default function Home() {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalDonations: 0,
        totalRequests: 0,
        totalRewards: 0,
        totalHospitals: 0,
        totalEvents: 0,
        totalNews: 0,
        totalFaqs: 0,
        recentUsers: [],
        recentDonations: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                // Fetch all the statistics in parallel
                const [
                    usersResponse,
                    donationsResponse,
                    rewardsResponse,
                    hospitalsResponse,
                    eventsResponse,
                    newsResponse,
                    faqsResponse,
                ] = await Promise.allSettled([
                    axiosInstance.get('/api/v1/user/list'),
                    axiosInstance.get('/api/v1/donationRequest/list'),
                    axiosInstance.get('/api/v1/reward/list'),
                    axiosInstance.get('/api/v1/hospital/list'),
                    axiosInstance.get('/api/v1/event/list'),
                    axiosInstance.get('/api/v1/news/list'),
                    axiosInstance.get('/api/v1/faq/list'),
                ]);

                setStats({
                    totalUsers: usersResponse.status === 'fulfilled' ? usersResponse.value.data.data?.data?.length || 0 : 0,
                    totalDonations: donationsResponse.status === 'fulfilled' ? donationsResponse.value.data.data?.data?.length || 0 : 0,
                    totalRequests: donationsResponse.status === 'fulfilled' ? donationsResponse.value.data.data?.data?.length || 0 : 0,
                    totalRewards: rewardsResponse.status === 'fulfilled' ? rewardsResponse.value.data.data?.data?.length || 0 : 0,
                    totalHospitals: hospitalsResponse.status === 'fulfilled' ? hospitalsResponse.value.data.data?.data?.length || 0 : 0,
                    totalEvents: eventsResponse.status === 'fulfilled' ? eventsResponse.value.data.data?.data?.length || 0 : 0,
                    totalNews: newsResponse.status === 'fulfilled' ? newsResponse.value.data.data?.data?.length || 0 : 0,
                    totalFaqs: faqsResponse.status === 'fulfilled' ? faqsResponse.value.data.data?.data?.length || 0 : 0,
                    recentUsers: usersResponse.status === 'fulfilled' ? (usersResponse.value.data.data?.data?.slice(0, 5) || []) : [],
                    recentDonations: donationsResponse.status === 'fulfilled' ? (donationsResponse.value.data.data?.data?.slice(0, 5) || []) : [],
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, link }: {
        title: string;
        value: number;
        icon: React.ComponentType<{ className?: string }>;
        color: string;
        link: string;
    }) => {
        // Map colors to explicit Tailwind classes
        const getIconStyles = (borderColor: string) => {
            switch (borderColor) {
                case 'border-l-blue-500':
                    return { bg: 'bg-blue-100', text: 'text-blue-600' };
                case 'border-l-red-500':
                    return { bg: 'bg-red-100', text: 'text-red-600' };
                case 'border-l-green-500':
                    return { bg: 'bg-green-100', text: 'text-green-600' };
                case 'border-l-purple-500':
                    return { bg: 'bg-purple-100', text: 'text-purple-600' };
                case 'border-l-indigo-500':
                    return { bg: 'bg-indigo-100', text: 'text-indigo-600' };
                case 'border-l-orange-500':
                    return { bg: 'bg-orange-100', text: 'text-orange-600' };
                case 'border-l-teal-500':
                    return { bg: 'bg-teal-100', text: 'text-teal-600' };
                case 'border-l-emerald-500':
                    return { bg: 'bg-emerald-100', text: 'text-emerald-600' };
                default:
                    return { bg: 'bg-gray-100', text: 'text-gray-600' };
            }
        };

        const iconStyles = getIconStyles(color);

        return (
            <Link href={link}>
                <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 ${color}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{title}</p>
                            <p className="text-3xl font-bold text-gray-900">{loading ? '...' : value}</p>
                        </div>
                        <div className={`p-3 rounded-full ${iconStyles.bg}`}>
                            <Icon className={`w-6 h-6 ${iconStyles.text}`} />
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <div className="h-full md:min-h-screen w-full bg-gray-50">
            <Navbar title="Dashboard" />

            <div className="py-6 px-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Lifeline Admin</h1>
                    <p className="text-gray-600">Here&apos;s an overview of your blood donation management system.</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        icon={Users}
                        color="border-l-blue-500"
                        link="/user"
                    />
                    <StatCard
                        title="Donation Requests"
                        value={stats.totalDonations}
                        icon={Heart}
                        color="border-l-red-500"
                        link="/post"
                    />
                    <StatCard
                        title="Rewards"
                        value={stats.totalRewards}
                        icon={Gift}
                        color="border-l-green-500"
                        link="/reward"
                    />
                    <StatCard
                        title="Events"
                        value={stats.totalEvents}
                        icon={Calendar}
                        color="border-l-purple-500"
                        link="/event"
                    />
                    <StatCard
                        title="Hospitals"
                        value={stats.totalHospitals}
                        icon={Hospital}
                        color="border-l-indigo-500"
                        link="/hospital"
                    />
                    <StatCard
                        title="News Articles"
                        value={stats.totalNews}
                        icon={TrendingUp}
                        color="border-l-orange-500"
                        link="/news"
                    />
                    <StatCard
                        title="FAQs"
                        value={stats.totalFaqs}
                        icon={MessageCircle}
                        color="border-l-teal-500"
                        link="/faq"
                    />
                    <StatCard
                        title="System Health"
                        value={100}
                        icon={Activity}
                        color="border-l-emerald-500"
                        link="/dashboard"
                    />
                </div>

                {/* Recent Activity Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Recent Users */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
                            <Link href="/user" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {loading ? (
                                <div className="text-gray-500">Loading...</div>
                            ) : stats.recentUsers.length > 0 ? (
                                stats.recentUsers.map((user, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{user.firstname} {user.lastname}</p>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${user.is_admin ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                                            {user.is_admin ? 'Admin' : 'User'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500">No users found</div>
                            )}
                        </div>
                    </div>

                    {/* Recent Donation Requests */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Donation Requests</h2>
                            <Link href="/post" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {loading ? (
                                <div className="text-gray-500">Loading...</div>
                            ) : stats.recentDonations.length > 0 ? (
                                stats.recentDonations.map((donation, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{donation.name}</p>
                                            <p className="text-sm text-gray-600">Blood Type: {donation.bloodType}</p>
                                        </div>
                                        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                            Urgent
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500">No donation requests found</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/hospital/add" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <Hospital className="w-8 h-8 text-indigo-600 mb-2" />
                            <span className="text-sm font-medium text-gray-900">Add Hospital</span>
                        </Link>
                        <Link href="/event/add" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <Calendar className="w-8 h-8 text-purple-600 mb-2" />
                            <span className="text-sm font-medium text-gray-900">Add Event</span>
                        </Link>
                        <Link href="/news/add" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <TrendingUp className="w-8 h-8 text-orange-600 mb-2" />
                            <span className="text-sm font-medium text-gray-900">Add News</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}