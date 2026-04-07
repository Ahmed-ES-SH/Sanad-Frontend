import Sidebar from "@/app/_components/_dashboard/DashboardPage/Sidebar";
import TopNavBar from "@/app/_components/_dashboard/DashboardPage/TopNavBar";
import { getAuthCookie } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ local: string }>;
}) {
  const { local } = await params;
  const token = await getAuthCookie();

  if (!token) {
    redirect(`/${local}/signin`);
  }

  return (
    <div className="flex min-h-screen relative">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden mb-10 mt-12">
        <TopNavBar />
        {children}
      </div>
    </div>
  );
}
