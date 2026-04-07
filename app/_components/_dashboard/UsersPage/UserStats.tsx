"use client";

import { FiUsers, FiZap, FiStar, FiTrendingUp } from "react-icons/fi";

//////////////////////////////////////////////////////
///////  User stat card data with translation keys for labels
//////////////////////////////////////////////////////
interface UserStatItem {
  labelKey: string;
  value: string;
  changeKey: string;
  isPositive: boolean | null;
  icon: React.ComponentType<{ size: number }>;
  iconBg: string;
  iconColor: string;
}

export default function UserStats() {
  const stats: UserStatItem[] = [
    {
      labelKey: "totalUsers",
      value: "1,284",
      changeKey: "onboardingTargets",
      isPositive: true,
      icon: FiUsers,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      labelKey: "activeNow",
      value: "42",
      changeKey: "realtimeTracking",
      isPositive: null,
      icon: FiZap,
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
    },
    {
      labelKey: "newThisMonth",
      value: "+12%",
      changeKey: "onboardingTargets",
      isPositive: true,
      icon: FiStar,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-between group transition-all hover:bg-stone-50 hover:shadow-md"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">
                {stat.labelKey}
              </p>
              <h3 className="text-3xl font-extrabold text-stone-900">
                {stat.value}
              </h3>
              <p
                className={`text-xs font-medium flex items-center gap-1 mt-2 ${
                  stat.isPositive === true
                    ? "text-green-600"
                    : stat.isPositive === false
                      ? "text-red-600"
                      : "text-stone-500"
                }`}
              >
                {stat.isPositive && <FiTrendingUp className="text-sm" />}
                {stat.changeKey}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-full ${stat.iconBg} flex items-center justify-center ${stat.iconColor} group-hover:bg-orange-500 group-hover:text-white transition-colors`}
            >
              <Icon size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
