"use client";

import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const statVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  },
};

// Progress celebration animation - subtle sparkle effect on the progress bar
function ProgressSparkles() {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
    >
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{ top: "30%", left: `${30 + i * 25}%` }}
          animate={{
            y: [-4, 4, -4],
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 1.2,
            delay: 1.5 + i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  subtext?: string;
  variant?: "default" | "dark" | "accent";
  progress?: number;
  statusBadge?: {
    text: string;
    color: "success" | "warning" | "error" | "info";
  };
  isLoading?: boolean;
}

function StatCard({
  label,
  value,
  subtext,
  variant = "default",
  progress,
  statusBadge,
  isLoading = false,
}: StatCardProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <motion.div
        className={`p-5 rounded-2xl shadow-[0_12px_32px_rgba(52,47,43,0.06)] flex flex-col justify-between h-32 bg-white animate-pulse`}
        variants={statVariants}
      >
        <div className="flex justify-between items-start">
          <div className="h-4 w-20 bg-[#fcf2eb] rounded"></div>
          <div className="h-6 w-16 bg-[#fcf2eb] rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-8 w-24 bg-[#fcf2eb] rounded"></div>
          <div className="h-3 w-32 bg-[#fcf2eb] rounded"></div>
        </div>
      </motion.div>
    );
  }

  const baseClasses =
    "flex flex-col justify-between relative overflow-hidden group hover:shadow-[0_12px_32px_rgba(52,47,43,0.08)] transition-all duration-300";

  const variantClasses = {
    default: "bg-white p-5 h-32 rounded-2xl",
    dark: "bg-[#1c1917] p-6 h-40 rounded-2xl",
    accent: "bg-[#f97316] p-5 h-32 rounded-2xl",
  };

  const getStatusBadge = () => {
    if (!statusBadge) return null;

    const statusConfig = {
      success: { bg: "bg-[#10b981]/20", text: "text-[#34d399]" },
      warning: { bg: "bg-[#fbbf24]/20", text: "text-[#fbbf24]" },
      error: { bg: "bg-[#dc2626]/20", text: "text-[#fca5a5]" },
      info: { bg: "bg-[#3b82f6]/20", text: "text-[#93c5fd]" },
    };

    const config = statusConfig[statusBadge.color];

    return (
      <motion.span
        className={`${config.bg} ${config.text} px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5`}
        whileHover={{ scale: 1.05 }}
      >
        {statusBadge.color === "success" && (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {statusBadge.text}
      </motion.span>
    );
  };

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]}`}
      variants={statVariants}
      role="region"
      aria-label={`${label}: ${value}${subtext ? `, ${subtext}` : ""}`}
    >
      {/* Decorative elements */}
      {variant === "default" && (
        <div className="absolute -right-6 -top-6 w-20 h-20 bg-[#f97316]/5 rounded-full blur-2xl group-hover:bg-[#f97316]/10 transition-all duration-500"></div>
      )}
      {variant === "dark" && (
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#10b981]/10 rounded-full blur-3xl group-hover:bg-[#10b981]/20 transition-all duration-500"></div>
      )}

      <div className="flex justify-between items-start relative z-10">
        <span
          className={`text-xs font-semibold tracking-wide ${variant === "dark" ? "text-[#34d399]" : "text-[#584237]/70"}`}
        >
          {label}
        </span>
        {getStatusBadge()}
      </div>

      <div className="space-y-2 relative z-10">
        {variant === "default" && progress !== undefined && (
          <div className="w-full bg-[#fcf2eb] h-2 rounded-full overflow-hidden">
            <motion.div
              className="bg-linear-to-r from-[#f97316] to-[#fb923c] h-full rounded-full relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progress: ${progress}%`}
            >
              <ProgressSparkles />
            </motion.div>
          </div>
        )}

        {variant !== "accent" ? (
          <motion.p
            className={`text-${variant === "dark" ? "4xl font-black text-white" : "3xl font-black text-[#1c1917]"} tracking-tight`}
            initial={
              variant === "dark" ? { opacity: 0, y: 10 } : { scale: 0.8 }
            }
            animate={variant === "dark" ? { opacity: 1, y: 0 } : { scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {value}
          </motion.p>
        ) : (
          <p className="text-lg font-black text-white leading-tight">{value}</p>
        )}

        {subtext && (
          <p className="text-xs font-medium mt-1.5" title={subtext}>
            {variant === "dark" ? (
              <span className="text-[#a8a29e]">{subtext}</span>
            ) : variant === "accent" ? (
              <span className="text-[#fdba74] flex items-center gap-1.5">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                {subtext}
              </span>
            ) : (
              <span className="text-[#584237]/50">{subtext}</span>
            )}
          </p>
        )}
      </div>
    </motion.div>
  );
}

interface ProjectQuickStatsProps {
  progress?: number;
  budget?: {
    spent: number;
    total: number;
    status: "on-track" | "over" | "under";
  };
  tasks?: {
    completed: number;
    total: number;
  };
  nextMilestone?: {
    name: string;
    dueText: string;
  };
  isLoading?: boolean;
  error?: Error | null;
}

export default function ProjectQuickStats({
  progress = 75,
  budget = { spent: 42890, total: 60000, status: "on-track" },
  tasks = { completed: 12, total: 18 },
  nextMilestone = { name: "Structural Audit", dueText: "Due in 4 days" },
  isLoading = false,
  error = null,
}: ProjectQuickStatsProps) {
  // Handle error state
  if (error) {
    return (
      <motion.section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        role="alert"
        aria-live="polite"
      >
        <div className="col-span-full bg-white p-8 rounded-2xl shadow-[0_12px_32px_rgba(52,47,43,0.06)]">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#fef2f2] flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-[#dc2626]"
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
            </div>
            <h4 className="text-[#1c1917] font-bold mb-2">
              Unable to load project statistics
            </h4>
            <p className="text-[#584237]/70 text-sm mb-4">
              {error.message ||
                "Something went wrong while loading project stats."}
            </p>
          </div>
        </div>
      </motion.section>
    );
  }

  // Format currency with proper i18n handling
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.section
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Project Statistics"
    >
      {/* Stat Card 1 - Overall Progress */}
      <StatCard
        label="Progress"
        value={`${progress}%`}
        subtext="On schedule for Q3 finish"
        variant="default"
        progress={progress}
        isLoading={isLoading}
      />

      {/* Stat Card 2 - Budget Health */}
      <StatCard
        label="Budget"
        value={formatCurrency(budget.spent)}
        subtext={`of ${formatCurrency(budget.total)} total budget`}
        variant="dark"
        statusBadge={{
          text:
            budget.status === "on-track"
              ? "On Track"
              : budget.status === "over"
                ? "Over Budget"
                : "Under Budget",
          color:
            budget.status === "on-track"
              ? "success"
              : budget.status === "over"
                ? "error"
                : "info",
        }}
        isLoading={isLoading}
      />

      {/* Stat Card 3 - Active Tasks */}
      <StatCard
        label="Tasks"
        value={
          <span className="text-3xl font-black text-[#1c1917] tracking-tight">
            {tasks.completed}
            <span className="text-[#584237]/50 font-medium text-base">
              /{tasks.total}
            </span>
          </span>
        }
        subtext={`${tasks.total - tasks.completed} remaining`}
        variant="default"
        isLoading={isLoading}
      />

      {/* Stat Card 4 - Next Milestone */}
      <StatCard
        label="Next Milestone"
        value={nextMilestone.name}
        subtext={nextMilestone.dueText}
        variant="accent"
        isLoading={isLoading}
      />
    </motion.section>
  );
}
