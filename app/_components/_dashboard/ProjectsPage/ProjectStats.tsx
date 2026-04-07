"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import {
  FiGitBranch,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrendingUp,
} from "react-icons/fi";

//////////////////////////////////////////////////////
///////  Project stat card data with translation keys and optional urgency flag
//////////////////////////////////////////////////////
interface ProjectStatItem {
  labelKey: string;
  value: string;
  change?: string;
  subLabelKey?: string;
  isPositive?: boolean;
  isUrgent?: boolean;
  icon: React.ComponentType<{ size: number }>;
  iconBg: string;
  iconColor: string;
}

export default function ProjectStats() {
  const { local } = useVariables();
  const { ProjectsPage } = getTranslations(local);
  const t = ProjectsPage.ProjectStats;

  const stats: ProjectStatItem[] = [
    {
      labelKey: "totalActive",
      value: "42",
      change: "+12%",
      isPositive: true,
      icon: FiGitBranch,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      labelKey: "inProgress",
      value: "28",
      icon: FiRefreshCw,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      labelKey: "completed",
      subLabelKey: "completedSub",
      value: "14",
      icon: FiCheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      labelKey: "delayed",
      value: "3",
      isUrgent: true,
      icon: FiAlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-stone-100"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-2 rounded-lg ${stat.iconBg} ${stat.iconColor}`}
              >
                <Icon size={20} />
              </div>
              {stat.change && (
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    stat.isPositive
                      ? "text-green-600 bg-green-50"
                      : "text-red-600 bg-red-50"
                  }`}
                >
                  {stat.change}
                </span>
              )}
              {stat.isUrgent && (
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                  {t.urgent}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-stone-500">
              {stat.labelKey}
              {stat.subLabelKey && (
                <span className="text-[10px] font-normal">
                  {stat.subLabelKey}
                </span>
              )}
            </p>
            <p
              className={`text-3xl font-extrabold mt-1 ${
                stat.isUrgent ? "text-red-600" : "text-stone-900"
              }`}
            >
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
