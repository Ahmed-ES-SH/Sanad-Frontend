interface UserData {
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
}

interface UserOverviewProps {
  user: UserData;
}

export default function UserOverview({ user }: UserOverviewProps) {
  return (
    <div className="col-span-12 lg:col-span-4 surface-card p-6">
      <div className="absolute top-0 right-0 p-2">
        <span className="surface-badge surface-badge-primary">
          {user.status}
        </span>
      </div>
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative mb-6">
          <img
            className="w-24 h-24 rounded-full border-4 border-surface-200 shadow-lg object-cover"
            alt={user.name}
            src={user.avatarUrl}
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-white/80">
            {user.isVerified && (
              <svg
                className="w-3 h-3 text-orange-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
        <h3 className="text-lg font-bold text-primary-text">
          {user.name}
        </h3>
        <p className="text-sm text-secondary-text">
          Member since {user.memberSince}
        </p>
        <div className="w-full space-y-3 text-left text-sm">
          <div className="flex items-center gap-3">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002-2v10a2 2 0 002 2z"
              />
            </svg>
            <div>
              <p className="font-medium text-secondary-text uppercase tracking-wider">
                Email Address
              </p>
              <p className="font-medium text-primary-text">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 011.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <div>
              <p className="font-medium text-secondary-text uppercase tracking-wider">
                Phone Number
              </p>
              <p className="font-medium text-primary-text">{user.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <p className="font-medium text-secondary-text uppercase tracking-wider">
                Location
              </p>
              <p className="font-medium text-primary-text">{user.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}