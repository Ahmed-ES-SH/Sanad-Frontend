"use client";

const activities = [
  {
    id: 1,
    action: "Approved Project",
    workflow: "Construction",
    resource: "NEOM Bridge Phase 2",
    date: "22 Oct, 2023",
    time: "14:22",
    ip: "192.168.1.45",
    icon: "check",
    iconBg: "bg-emerald-50 text-emerald-600",
    iconColor: "text-emerald-600",
  },
  {
    id: 2,
    action: "Updated Milestones",
    workflow: "Timeline",
    resource: "Al Khobar Park",
    date: "21 Oct, 2023",
    time: "09:15",
    ip: "192.168.1.45",
    icon: "edit",
    iconBg: "bg-blue-50 text-blue-600",
    iconColor: "text-blue-600",
  },
  {
    id: 3,
    action: "Portal Login",
    workflow: "Device: MacOS / Safari",
    resource: "System Portal",
    date: "21 Oct, 2023",
    time: "08:00",
    ip: "192.168.1.45",
    icon: "login",
    iconBg: "bg-orange-50 text-orange-600",
    iconColor: "text-orange-600",
  },
];

const icons: Record<string, React.ReactNode> = {
  check: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  edit: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  ),
  login: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export default function ActivityTable() {
  return (
    <div className="surface-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="heading-md font-bold text-primary-text">
          Recent Activity
        </h3>
        <button className="text-sm font-medium text-primary hover:text-primary/80">
          Download Report
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-surface-200">
              <th className="pb-2 text-xs font-medium text-secondary-text uppercase tracking-wider">
                Action
              </th>
              <th className="pb-2 text-xs font-medium text-secondary-text uppercase tracking-wider">
                Resource
              </th>
              <th className="pb-2 text-xs font-medium text-secondary-text uppercase tracking-wider">
                Date & Time
              </th>
              <th className="pb-2 text-xs font-medium text-secondary-text uppercase tracking-wider text-right">
                IP Address
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200">
            {activities.map((activity) => (
              <tr
                key={activity.id}
                className="hover:bg-surface-50 transition-colors"
              >
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.iconBg}`}
                    >
                      {icons[activity.icon]}
                    </div>
                    <div>
                      <p className="font-medium text-primary-text">{activity.action}</p>
                      <p className="text-xs text-secondary-text">{activity.workflow}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 text-sm font-medium text-primary-text">{activity.resource}</td>
                <td className="py-3 text-sm text-secondary-text">
                  {activity.date} • {activity.time}
                </td>
                <td className="py-3 text-sm text-secondary-text text-right tabular-nums">
                  {activity.ip}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="w-full mt-4 py-2 border border-dashed border-surface-300 rounded-lg text-xs font-medium text-secondary-text hover:border-primary hover:text-primary transition-all">
        View All Activity Log Entries
      </button>
    </div>
  );
}