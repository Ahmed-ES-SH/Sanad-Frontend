"use client";

import { motion, type Variants } from "framer-motion";

interface Milestone {
  status: "completed" | "current" | "upcoming";
  title: string;
  date: string;
}

const timelineItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  }),
};

// Subtle pulse animation for the current milestone
function CurrentMilestonePulse() {
  return (
    <motion.div
      className="absolute inset-0 rounded-full"
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(249, 115, 22, 0.4)",
          "0 0 0 8px rgba(249, 115, 22, 0)",
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

// Checkmark reveal for completed milestones
function CompletedCheck({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute -right-1 -top-1 w-4 h-4 bg-white rounded-full flex items-center justify-center"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 500, damping: 25 }}
    >
      <motion.svg
        className="w-2.5 h-2.5 text-[#10b981]"
        viewBox="0 0 20 20"
        fill="currentColor"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: delay + 0.1, duration: 0.3 }}
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </motion.svg>
    </motion.div>
  );
}

interface TimelineItemProps {
  milestone: Milestone;
  index: number;
}

function TimelineItem({ milestone, index }: TimelineItemProps) {
  const statusConfig = {
    completed: {
      statusColor: "text-[#10b981]",
      dotColor: "bg-[#10b981] shadow-[0_4px_12px_rgba(16,185,129,0.4)]",
      showCheck: true,
    },
    current: {
      statusColor: "text-[#f97316]",
      dotColor: "bg-[#f97316] shadow-[0_4px_12px_rgba(249,115,22,0.4)]",
      showCheck: false,
    },
    upcoming: {
      statusColor: "text-[#584237]/50",
      dotColor: "bg-[#d6d3d1] border-2 border-[#fcf2eb]",
      showCheck: false,
    },
  };

  const config = statusConfig[milestone.status];
  const statusLabel = {
    completed: "Completed",
    current: "In Progress",
    upcoming: "Upcoming",
  };

  return (
    <motion.div
      className="relative flex items-start gap-4 group"
      custom={index}
      variants={timelineItemVariants}
      initial="hidden"
      animate="visible"
      role="listitem"
      aria-label={`${milestone.title} - ${statusLabel[milestone.status]}`}
    >
      {/* Dot */}
      <motion.div
        className={`relative z-10 w-4 h-4 rounded-full ${config.dotColor} border-[3px] border-white mt-0.5 flex-shrink-0`}
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.2 }}
      >
        {/* Pulse effect for current milestone */}
        {milestone.status === "current" && <CurrentMilestonePulse />}

        {/* Checkmark for completed milestones */}
        {milestone.status === "completed" && <CompletedCheck delay={index * 0.15 + 0.3} />}
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-px">
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.15em] ${config.statusColor} mb-0.5 flex items-center gap-1.5`}
        >
          <span className="sr-only">{statusLabel[milestone.status]}</span>
          {milestone.status === "current" && (
            <motion.span
              className="w-1.5 h-1.5 bg-[#f97316] rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              aria-hidden="true"
            />
          )}
        </p>
        <p
          className={`text-sm font-bold ${milestone.status === "upcoming" ? "text-[#584237]/50" : "text-[#1c1917]"} transition-colors group-hover:text-[#9d4300] truncate`}
          title={milestone.title}
        >
          {milestone.title}
        </p>
        <p className="text-xs text-[#584237]/50 mt-0.5 font-medium">{milestone.date}</p>
      </div>
    </motion.div>
  );
}

interface ProjectTimelineProps {
  milestones?: Milestone[];
  isLoading?: boolean;
  error?: Error | null;
}

function LoadingSkeleton() {
  return (
    <div className="p-6">
      <div className="space-y-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-4 h-4 rounded-full bg-[#fcf2eb] animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-20 bg-[#fcf2eb] rounded animate-pulse" />
              <div className="h-4 w-40 bg-[#fcf2eb] rounded animate-pulse" />
              <div className="h-3 w-16 bg-[#fcf2eb] rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="p-5">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#fcf2eb] flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-[#584237]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <h4 className="text-[#1c1917] font-bold mb-2">No timeline available</h4>
        <p className="text-[#584237]/70 text-sm">
          Project milestones will appear here.
        </p>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <div className="p-5">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#fef2f2] flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h4 className="text-[#1c1917] font-bold mb-2">Unable to load timeline</h4>
        <p className="text-[#584237]/70 text-sm mb-4">
          {error.message || "We couldn't load the project timeline."}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-[#f97316] text-white text-sm font-bold rounded-lg hover:bg-[#ea580c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProjectTimeline({
  milestones = [
    {
      status: "completed",
      title: "Site Planning & Permitting",
      date: "Jan 2024",
    },
    {
      status: "completed",
      title: "Main Piling & Excavation",
      date: "Mar 2024",
    },
    {
      status: "current",
      title: "Foundation & Slab Work",
      date: "Current",
    },
    {
      status: "upcoming",
      title: "Structural Audit",
      date: "Apr 2024",
    },
  ],
  isLoading = false,
  error = null,
}: ProjectTimelineProps) {
  // Handle loading state
  if (isLoading) {
    return (
      <motion.div
        className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(52,47,43,0.06)] relative group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }}
      >
        {/* Subtle top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#ea580c]"></div>

        {/* Header */}
        <div className="p-5 bg-[#fcf2eb] flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </span>
          <h3 className="font-bold text-[#1c1917] text-base tracking-tight font-[family-name:var(--font-oswald)]">
            <span className="w-32 h-6 bg-[#fcf2eb] rounded animate-pulse"></span>
          </h3>
        </div>
        <LoadingSkeleton />
      </motion.div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <motion.div
        className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(52,47,43,0.06)] relative group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }}
        role="alert"
        aria-live="polite"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#ea580c]"></div>
        <div className="p-5 bg-[#fcf2eb] flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </span>
          <h3 className="font-bold text-[#1c1917] text-base tracking-tight font-[family-name:var(--font-oswald)]">
            Project Timeline
          </h3>
        </div>
        <ErrorState error={error} />
      </motion.div>
    );
  }

  // Handle empty state
  if (!milestones || milestones.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(52,47,43,0.06)] relative group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#ea580c]"></div>
        <div className="p-5 bg-[#fcf2eb] flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </span>
          <h3 className="font-bold text-[#1c1917] text-base tracking-tight font-[family-name:var(--font-oswald)]">
            Project Timeline
          </h3>
        </div>
        <EmptyState />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(52,47,43,0.06)] relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }}
    >
      {/* Subtle top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#ea580c]"></div>

        {/* Header */}
        <div className="p-6 bg-[#fcf2eb] flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </span>
          <h3 className="font-bold text-[#1c1917] text-base tracking-tight font-[family-name:var(--font-oswald)]">
            Project Timeline
          </h3>
        </div>

        {/* Timeline content */}
        <div className="p-6 relative">
        {/* Vertical Line */}
        <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#fb923c] via-[#e7e5e4] to-[#d6d3d1]"></div>

        <div className="space-y-5" role="list" aria-label="Project milestones">
            {milestones.map((milestone, index) => (
              <TimelineItem key={index} milestone={milestone} index={index} />
            ))}
        </div>
      </div>
    </motion.div>
  );
}
