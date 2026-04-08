"use client";

import { motion, type Variants } from "framer-motion";
import UserOverview from "./_components/_userProfile/UserOverview";
import UserStats from "./_components/_userProfile/UserStats";
import ProfileTabs from "./_components/_userProfile/ProfileTabs";
import ActivityTable from "./_components/_userProfile/ActivityTable";
import AssignedProjects from "./_components/_userProfile/AssignedProjects";
import PerformanceBonus from "./_components/_userProfile/PerformanceBonus";
import UserActions from "./_components/_userProfile/UserActions";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export default function UserProfilePage({
  userData,
}: {
  userData: {
    id: string;
    name: string;
    title: string;
    memberSince: string;
    email: string;
    phone: string;
    location: string;
    avatarUrl: string;
    isVerified: boolean;
    status: string;
  };
}) {
  return (
    <>
      <motion.main
        className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Header Section */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {userData.name}
            </h2>
            <p className="text-sm font-medium text-stone-500 flex items-center gap-2">
              {userData.title}
              <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
              ID: #{userData.id}
            </p>
          </div>
          <div className="flex gap-3">
            <UserActions userName={userData.name} userId={userData.id} />
          </div>
        </motion.div>

        {/* Overview & Stats Layout */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-12 gap-6 mt-8"
        >
          {/* User Overview Card */}
          <UserOverview user={userData} />

          {/* Metrics Column */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            {/* Single Line Stats */}
            <UserStats />

            {/* Tabbed Interface Container */}
            <ProfileTabs />
          </div>
        </motion.div>

        {/* Bottom Grid: Activity & Projects */}
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-12 gap-6 mt-8"
        >
          {/* Activity Table */}
          <div className="col-span-12 lg:col-span-8">
            <ActivityTable />
          </div>

          {/* Projects Grid & Bonus */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <AssignedProjects />
            <PerformanceBonus />
          </div>
        </motion.div>
      </motion.main>
    </>
  );
}
