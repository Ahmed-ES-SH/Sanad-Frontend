"use client";

import { motion } from "framer-motion";
import { useState, useCallback } from "react";

const taskVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  }),
};

// Celebration sparkle for completed tasks
function CelebrationSparkle({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
      >
        <svg className="w-5 h-5 text-[#10b981]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </motion.div>
      {/* Sparkle particles */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#fbbf24] rounded-full"
            style={{
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: Math.cos(i * 60 * Math.PI / 180) * 16,
              y: Math.sin(i * 60 * Math.PI / 180) * 16,
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 0.6,
              delay: delay + 0.3 + i * 0.05,
              repeat: 1,
              repeatDelay: 2,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

// Image with error handling and fallback for task assignee avatars
function TaskAvatar({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  if (hasError) {
    // Generate initials
    const initials = alt
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div
        className={`${className} rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center`}
        role="img"
        aria-label={`Avatar for ${alt}`}
      >
        <span className="text-white font-bold text-xs">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} transition-opacity duration-200`}
      onError={handleError}
      loading="lazy"
    />
  );
}

interface Task {
  name: string;
  assignee: string;
  avatar?: string;
  priority: "low" | "medium" | "high";
  status: "completed" | "in-review" | "pending";
}

interface RecentTasksProps {
  tasks?: Task[];
  isLoading?: boolean;
  error?: Error | null;
  onViewAll?: () => void;
}

function LoadingSkeleton() {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <div className="w-8 h-8 bg-[#fcf2eb] rounded-lg animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[#fcf2eb] rounded w-48 animate-pulse" />
              <div className="h-3 bg-[#fcf2eb] rounded w-32 animate-pulse" />
            </div>
            <div className="h-6 w-16 bg-[#fcf2eb] rounded-lg animate-pulse" />
            <div className="h-6 w-20 bg-[#fcf2eb] rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onViewAll }: { onViewAll?: () => void }) {
  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#fcf2eb] flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-[#584237]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h4 className="text-[#1c1917] font-bold mb-2">No tasks yet</h4>
        <p className="text-[#584237]/70 text-sm mb-4">
          Tasks will appear here once added to this project.
        </p>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-[#f97316] text-sm font-bold hover:text-[#ea580c] hover:underline transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 rounded"
          >
            View All Tasks
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#fef2f2] flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h4 className="text-[#1c1917] font-bold mb-2">Unable to load tasks</h4>
        <p className="text-[#584237]/70 text-sm mb-4">
          {error.message || "We couldn't load the tasks. Please try again."}
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

export default function RecentTasks({
  tasks = [
    {
      name: "Concrete Core Sampling",
      assignee: "Faisal K.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHhpAMpz8cC538nINOGBWjaFdAsTYYyM5m2sGIqekWMqgyOjO2aCUESwoQ-YphQ6pzySw9qjHKZYyIpEJohPTtZS3AyRIMh2S4tqg5hPQG5hv3Vm45HmHw4UdUVEKzuAfpzw3SMx7KY5Z1S9BpSo0v61SFhHdUmaN0JldY_1B1s5Bu1awetQ0Hyp4lTvukF9uLQm_SaMICFiNG0PXRcU4d8RURRlTOqAAntNcSDslscmyyaaS3RjG3CXWC3BDg0ChtGyELaXa1AYj0",
      priority: "medium",
      status: "completed",
    },
    {
      name: "Expansion Joint Install",
      assignee: "Omar J.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuACn5fVUpAL0HEw34BO6R2QU5aa_Dwzvlw3lF-UymINZwG8s68VLyye5bxhqGIPlTawlcyws970IeKQUVGdqzBlUVty2pxNZtUwYEObWo-VYHV_AEtltyisfgDe9LwZsH02Y-AGg7Ee4HpAcmfma4cAssyxtAV0JTF6sk_KP8rEdVos1eejd2y81hPUGviyPwFtfV8Yr4Lo1FLWLYXNd0UyKRgWWaLrlJPCxXb6T-COapZ9eQi5FSiKBRwCd7fPYMg1FniokqCwbdCP",
      priority: "high",
      status: "in-review",
    },
    {
      name: "Safety Netting Removal",
      assignee: "Sara L.",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB2sYsK8ctPWb-M1vtS1CGcL57bA_7fFuO3sHCmQxHqGtK2En6EIvxLNbdwiyvnc4zSOJU3vSE7c1JepRU_pPnbUC-P-vbBb4KyXWloAqQKSzodOF9R-NypRZJOUdATvJfcNtcOnPTKLsXfDhSC-Z7RjB3-z1p2ThAvJReYNTotDmjHgXyIDMVDPMgN1TFjgaR9m6cNIWDqwqvnlrIRyGvGoZLPG5R5AsZafFjoLG-GeiDWs8OGydgN8vUJg90oks5vD9F7_7G6KS2X",
      priority: "low",
      status: "pending",
    },
  ],
  isLoading = false,
  error = null,
  onViewAll,
}: RecentTasksProps) {
  // Priority and status styling helpers
  const getPriorityStyles = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return { text: "text-[#dc2626]", bg: "bg-[#fef2f2]" };
      case "medium":
        return { text: "text-[#f97316]", bg: "bg-[#f97316]/10" };
      case "low":
        return { text: "text-[#584237]/70", bg: "bg-[#fcf2eb]" };
    }
  };

  const getStatusStyles = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return { text: "text-[#10b981]", bg: "bg-[#10b981]/10", icon: "✓ " };
      case "in-review":
        return { text: "text-[#f97316]", bg: "bg-[#f97316]/10", icon: "⏳ " };
      case "pending":
        return { text: "text-[#584237]/50", bg: "bg-[#fcf2eb]/50", icon: "○ " };
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <motion.div
        className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(52,47,43,0.06)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }}
      >
        <div className="p-6 bg-[#fcf2eb] flex justify-between items-center">
          <h3 className="font-bold text-[#1c1917] text-lg flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </span>
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
        className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(52,47,43,0.06)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }}
        role="alert"
        aria-live="polite"
      >
        <div className="p-6 bg-[#fcf2eb] flex justify-between items-center">
          <h3 className="font-bold text-[#1c1917] text-lg flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </span>
            Recent Tasks
          </h3>
        </div>
        <ErrorState error={error} />
      </motion.div>
    );
  }

  // Handle empty state
  if (!tasks || tasks.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(52,47,43,0.06)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }}
      >
        <div className="p-6 bg-[#fcf2eb] flex justify-between items-center">
          <h3 className="font-bold text-[#1c1917] text-lg flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </span>
            Recent Tasks
          </h3>
          <button
            onClick={onViewAll}
            className="text-[#f97316] text-sm font-bold hover:text-[#ea580c] hover:underline transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 rounded"
          >
            View All Tasks
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <EmptyState onViewAll={onViewAll} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(52,47,43,0.06)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }}
    >
      <div className="p-6 bg-[#fcf2eb] flex justify-between items-center">
        <h3 className="font-bold text-[#1c1917] text-lg flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </span>
          Recent Tasks
        </h3>
        <button 
          onClick={onViewAll}
          className="text-[#f97316] text-sm font-bold hover:text-[#ea580c] hover:underline transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 rounded"
          aria-label="View all tasks"
        >
          View All Tasks
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" role="table" aria-label="Recent tasks">
          <thead>
            <tr className="text-[#584237]/50 font-bold uppercase text-[10px] tracking-[0.15em] bg-[#fcf2eb]/50">
              <th className="px-6 py-4 font-bold" scope="col">Task Name</th>
              <th className="px-6 py-4 font-bold" scope="col">Assignee</th>
              <th className="px-6 py-4 font-bold" scope="col">Priority</th>
              <th className="px-6 py-4 text-right font-bold" scope="col">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#fcf2eb]" role="rowgroup">
            {tasks.map((task, index) => {
              const priorityStyles = getPriorityStyles(task.priority);
              const statusStyles = getStatusStyles(task.status);

              return (
                <motion.tr
                  key={index}
                  className="hover:bg-[#fcf2eb]/50 transition-all duration-200 group relative"
                  variants={taskVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  role="row"
                >
                  <td className="px-6 py-4">
                    <span 
                      className="font-bold text-[#1c1917] group-hover:text-[#9d4300] transition-colors block max-w-[200px] truncate"
                      title={task.name}
                    >
                      {task.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {task.avatar ? (
                        <TaskAvatar
                          src={task.avatar}
                          alt={task.assignee}
                          className="w-8 h-8 rounded-lg shadow-[0_2px_8px_rgba(52,47,43,0.06)]"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-[#fcf2eb] flex items-center justify-center">
                          <span className="text-[#584237]/50 text-xs font-bold">
                            {task.assignee.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="font-medium text-[#584237]/70 truncate max-w-[100px]" title={task.assignee}>
                        {task.assignee}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase inline-flex ${priorityStyles.text} ${priorityStyles.bg}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <span 
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-lg uppercase inline-flex ${statusStyles.text} ${statusStyles.bg}`}
                    >
                      {statusStyles.icon}{task.status === "in-review" ? "In Review" : task.status === "completed" ? "Completed" : "Pending"}
                    </span>
                    {task.status === "completed" && <CelebrationSparkle delay={index * 0.1 + 0.5} />}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
