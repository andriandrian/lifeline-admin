import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import "../globals.css";
import SideNav from "@/components/ui/sideNav";
import { Toaster } from 'sonner'
import { redirect } from "next/navigation";
import { getSession } from "@/lib";
import { cookies } from 'next/headers';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: "Lifeline",
  description: "Lifeline Admin",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("Authorization")?.value;
  const refreshToken = cookieStore.get("RefreshToken")?.value;

  // Check for either valid access token or refresh token
  if (!accessToken && !refreshToken) {
    redirect('/login');
  }

  return (
    <div
      className={`${poppins.variable} antialiased flex flex-col lg:flex-row w-full relative`}
    >
      <div className="w-full right-0 lg:fixed z-40 lg:h-0">
        <SideNav />
      </div>
      <main className="w-full bg-red-50 flex flex-col lg:ml-[280px]">
        {children}
        <Toaster richColors position="top-right" />
      </main>
    </div>
  );
}
