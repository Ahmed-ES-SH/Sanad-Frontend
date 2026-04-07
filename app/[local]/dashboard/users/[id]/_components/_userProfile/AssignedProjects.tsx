"use client";

const projects = [
  {
    id: 1,
    name: "NEOM Bridge Phase 2",
    icon: "architecture",
    dueIn: "14D",
    progress: 75,
    members: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBoAnH-6fxyWrJGJe0u83K6YpKIORNfo9e6iHbBL_7UItzH1jOb1UU5lvDalND4K0mQZCUDnH1qtHASlz4QP8SD2kdbg6cmNB8xrcIaX1YlglI4ijUVWOlg6bonUJb20NODpyiaVjREclp2FSfR40Ds3MHcqHXWgugJHtPwK8DYbEWdzc5H8r98ZEJdomJd5HAPU22qvEqQWChjX3DSWDBe2qVuKJCVokzPajInCP99zJ5Xx16-luFzClg32jespjz6RKtYVy6r8gbh",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBuu5UXjyFwigYjKyjtPanHwF8q-obEI0jwVfh_kLWpJJ2iTAqfNYKQv5EmIirHkdXxj4D1491djCpT5JnExGKjjC7X_Zu5tlp_1KyZU3bkgMAY3atTRfx2BaeKra5E6RdM3rGScXx58m7dw-uaY7NEFPBgVYzgKLT8TwhhrId2myDM-XhEIwfvfQWXuZsvDgFNBVcowXy00IG36HuLRavaeO-0JJFeN69JKqoXQXqd96f3Bwx1aPmW1d1ROEn5qk4jMvALD3DUstf1",
    ],
    memberCount: 4,
  },
  {
    id: 2,
    name: "Al Khobar City Park",
    icon: "park",
    dueIn: "45D",
    progress: 30,
    members: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqvPdGA8OkNZ5TgawS333FpPrLW8N4QJYMvaCsmRkwByiZTWZS6rUwT-BlZc6ziaAsN9hCzdLfdQWk2UHXa8K7uoV7CF91Lq4ABvySToi8I-g8jDtZyu8GDsAUrGZJh_vjMGPyFOn-c2YGceS5lBl5Pqtt1RX7jmN_Jx05u6RoTu3kAhCenE72mGfeJ6LBwigkNBqMiqArE8TT_LSL52mx9TMTrzNrZyHIocuzP97O5PWnj4_pZB522gPtYOCuaVXy26Xj1t_JxVQr",
    ],
    memberCount: 2,
  },
];

const icons: Record<string, React.ReactNode> = {
  architecture: (
    <svg fill="currentColor" viewBox="0 0 20 20">
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
    </svg>
  ),
  park: (
    <svg fill="currentColor" viewBox="0 0 20 20">
      <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" />
    </svg>
  ),
};

export default function AssignedProjects() {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <h3 className="text-lg font-bold text-stone-900 mb-6">Assigned Projects</h3>
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 rounded-xl bg-stone-50 border border-transparent hover:border-stone-300 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm text-orange-500">
                {icons[project.icon]}
              </div>
              <span className="text-[10px] font-bold text-stone-400">
                DUE IN {project.dueIn}
              </span>
            </div>
            <h4 className="text-sm font-bold text-stone-800 group-hover:text-orange-600 transition-colors">
              {project.name}
            </h4>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex -space-x-2">
                {project.members.map((member, idx) => (
                  <img
                    key={idx}
                    className="w-6 h-6 rounded-full border-2 border-white object-cover"
                    alt="Project member"
                    src={member}
                  />
                ))}
                {project.memberCount > project.members.length && (
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-stone-100 flex items-center justify-center text-[8px] font-bold">
                    +{project.memberCount - project.members.length}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-black text-stone-800">
                  {project.progress}%
                </span>
              </div>
            </div>
          </div>
        ))}
        <button className="w-full flex items-center justify-center gap-2 text-orange-600 font-bold text-xs py-2 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
          <svg
            className="text-sm"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
          Assign New Project
        </button>
      </div>
    </div>
  );
}