import TopNavBar from "@/app/_components/_dashboard/DashboardPage/TopNavBar";
import { SideNavBar } from "@/app/_components/_services/add/SideNavBar";
import { getAuthCookie } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function UserDashboardLayout({
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
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {children}
      </div>
    </div>
  );
}
