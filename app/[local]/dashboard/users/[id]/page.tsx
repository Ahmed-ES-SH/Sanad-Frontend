import TopNavBar from "@/app/_components/_dashboard/DashboardPage/TopNavBar";
import UserProfileClient from "./UserProfileClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserProfilePage({ params }: PageProps) {
  const { id } = await params;

  // In a real app, fetch user data based on id
  const userData = {
    id,
    name: "Ahmed Al-Saud",
    title: "Senior Project Manager",
    memberSince: "Jan 2022",
    email: "a.alsaud@sanad.sa",
    phone: "+966 50 123 4567",
    location: "Riyadh, Saudi Arabia",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuArftahrQCuve21nKxTu8G0TTIfyWFgvMmKD_wyWhC7GrupYtz0AqIz0I3suUv28XZv6Yv51-y0AP-6J9WguYMtIGaPNqVGCknzaZAso6CZW7JyvpbMZwhDdP6YNgTFlgM0M2RxdbvADACGnkdt_iVR8Tv2ql5bDfqOH4e3lhaRU--ySwma9SiGpNUFUb5KzlvHFWSxmt5n5E7IpLoVQrCY7wPhRiKMx3XkYGiquPh3V85zwtq6baH91K3gEIVMzgRdL1pPMaGvKpiF",
    isVerified: true,
    status: "Active",
  };

  return <UserProfileClient userData={userData} />;
}