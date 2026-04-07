export default function UserStats() {
  const stats = [
    {
      label: "Total Projects",
      value: "24",
      subtext: "+3 this month",
      trend: "up",
      color: "text-primary-text",
    },
    {
      label: "Avg. Response",
      value: "1.2",
      unit: "hrs",
      subtext: "Top 5%",
      trend: "top",
      color: "text-primary-text",
    },
    {
      label: "Satisfaction",
      value: "98",
      unit: "%",
      stars: true,
      color: "text-primary-text",
    },
    {
      label: "Last Active",
      value: "Now Online",
      subtext: "Working on 'Project Oasis'",
      highlight: true,
      color: "text-primary-text",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`surface-card p-4 ${
            stat.highlight ? "border-l-4 border-primary" : ""
          }`}
        >
          <p className="caption-xs text-secondary-text uppercase tracking-wider">
            {stat.label}
          </p>
          <p className="display-sm font-bold text-primary-text">
            {stat.value}
            {stat.unit && (
              <span className="caption text-secondary-text ml-1">{stat.unit}</span>
            )}
          </p>
          {stat.trend === "up" && (
            <div className="mt-2 flex items-center gap-1">
              <svg
                className="w-3 h-3 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="caption text-emerald-600">{stat.subtext}</span>
            </div>
          )}
          {stat.trend === "top" && (
            <div className="mt-2 flex items-center gap-1">
              <svg
                className="w-3 h-3 text-amber-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
              </svg>
              <span className="caption text-amber-500">{stat.subtext}</span>
            </div>
          )}
          {stat.stars && (
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-3 h-3 text-amber-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-.364 1.118l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          )}
          {stat.highlight && (
            <p className="mt-1 caption-xs text-secondary-text">
              {stat.subtext}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}