"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { FiArrowRight, FiFilter, FiMoreVertical } from "react-icons/fi";

interface Project {
  id: number;
  name: string;
  category: string;
  client: string;
  status: "In Progress" | "Review" | "Drafting" | "Delayed";
  deadline: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  team: { avatar?: string; initials?: string }[];
}

const projects: Project[] = [
  {
    id: 1,
    name: "E-Commerce Redesign",
    category: "Web Development",
    client: "Global Retailers Co.",
    status: "In Progress",
    deadline: "Oct 24, 2023",
    icon: "language",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    team: [
      {
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      },
      {
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      },
      { initials: "+3" },
    ],
  },
  {
    id: 2,
    name: "Cloud Migration Phase 2",
    category: "Infrastructure",
    client: "Apex Financial",
    status: "Review",
    deadline: "Nov 05, 2023",
    icon: "cloud_done",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    team: [
      {
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      },
      {
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      },
    ],
  },
  {
    id: 3,
    name: "Brand Identity Update",
    category: "Design",
    client: "Lumina Tech",
    status: "Drafting",
    deadline: "Dec 12, 2023",
    icon: "edit_note",
    iconBg: "bg-stone-100",
    iconColor: "text-stone-600",
    team: [
      {
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
      },
    ],
  },
  {
    id: 4,
    name: "Mobile App MVP",
    category: "Development",
    client: "Swift Logix",
    status: "Delayed",
    deadline: "Oct 15, 2023",
    icon: "warning",
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    team: [
      {
        avatar:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
      },
      {
        avatar:
          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
      },
      {
        avatar:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face",
      },
    ],
  },
  {
    id: 5,
    name: "Security Audit Q4",
    category: "Compliance",
    client: "Nexus Systems",
    status: "In Progress",
    deadline: "Dec 20, 2023",
    icon: "security",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    team: [
      {
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
      },
    ],
  },
];

const statusStyles: Record<string, string> = {
  "In Progress": "bg-blue-100 text-blue-700",
  Review: "bg-amber-100 text-amber-700",
  Drafting: "bg-stone-200 text-stone-700",
  Delayed: "bg-red-100 text-red-700",
};

export default function ProjectTable() {
  const { local } = useVariables();
  const { ProjectsPage } = getTranslations(local);
  const t = ProjectsPage.ProjectTable;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-stone-900">{t.recentProjects}</h3>
        <div className="flex gap-2">
          <button className="p-2 text-stone-400 hover:text-stone-600 transition-colors">
            <FiFilter size={18} />
          </button>
          <button className="p-2 text-stone-400 hover:text-stone-600 transition-colors">
            <FiMoreVertical size={18} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 text-stone-500">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                {t.projectName}
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                {t.client}
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                {t.status}
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                {t.deadline}
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                {t.team}
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="hover:bg-stone-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${project.iconBg} flex items-center justify-center ${project.iconColor}`}
                    >
                      {project.icon === "language" && (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                      )}
                      {project.icon === "cloud_done" && (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                          />
                        </svg>
                      )}
                      {project.icon === "edit_note" && (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      )}
                      {project.icon === "warning" && (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      )}
                      {project.icon === "security" && (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-900">
                        {project.name}
                      </p>
                      <p className="text-xs text-stone-400">
                        {project.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-stone-900">
                  {project.client}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusStyles[project.status]}`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-stone-500">
                  {project.deadline}
                </td>
                <td className="px-6 py-4">
                  <div className="flex -space-x-2">
                    {project.team.map((member, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center overflow-hidden"
                      >
                        {member.avatar ? (
                          <img
                            alt={t.teamMember}
                            className="w-full h-full object-cover"
                            src={member.avatar}
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-stone-600">
                            {member.initials}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-stone-400 hover:text-orange-600 transition-colors">
                    <FiArrowRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-stone-50 flex items-center justify-between">
        <p className="text-xs font-medium text-stone-500">{t.showingText}</p>
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 rounded bg-white text-xs font-bold border border-stone-200 text-stone-700 disabled:opacity-50"
            disabled
          >
            {t.previous}
          </button>
          <button className="px-3 py-1.5 rounded bg-white text-xs font-bold border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors">
            {t.next}
          </button>
        </div>
      </div>
    </div>
  );
}
