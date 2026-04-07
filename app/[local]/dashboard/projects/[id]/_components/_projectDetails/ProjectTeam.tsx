"use client";

import { motion, type Variants } from "framer-motion";
import { useState, useCallback } from "react";

const teamMemberVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  }),
};

// Fallback avatar component with initials
function FallbackAvatar({ name, size = 48 }: { name: string; size?: number }) {
  // Get initials from name
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Generate consistent color based on name
  const colors = [
    "from-[#f97316] to-[#ea580c]",
    "from-[#3b82f6] to-[#2563eb]",
    "from-[#10b981] to-[#059669]",
    "from-[#8b5cf6] to-[#7c3aed]",
    "from-[#ec4899] to-[#db2777]",
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;

  // Map size to Tailwind classes
  const sizeClasses = {
    48: "w-12 h-12",
    32: "w-8 h-8",
    24: "w-6 h-6",
  };
  const sizeClass = sizeClasses[size as keyof typeof sizeClasses] || "w-12 h-12";

  return (
    <div
      className={`${sizeClass} rounded-xl bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center shadow-[0_4px_12px_rgba(52,47,43,0.08)]`}
      role="img"
      aria-label={`Avatar for ${name}`}
    >
      <span className="text-white font-bold text-sm">{initials}</span>
    </div>
  );
}

// Image with error handling and fallback
function AvatarImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  if (hasError) {
    return <FallbackAvatar name={alt} size={48} />;
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`absolute inset-0 ${className} bg-[#fcf2eb] animate-pulse rounded-xl`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
}

// Ripple effect on hover for team member cards
function HoverRipple() {
  return (
    <motion.div
      className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
      initial={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
    >
      <motion.div
        className="absolute inset-0 bg-[#f97316]/5"
        initial={{ scale: 0, x: "50%", y: "50%" }}
        whileHover={{ scale: 2 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
}

interface TeamMember {
  name: string;
  role: string;
  avatar?: string;
  email?: string;
}

interface ProjectTeamProps {
  members?: TeamMember[];
  isLoading?: boolean;
  error?: Error | null;
  onAssign?: () => void;
}

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <div className="w-12 h-12 bg-[#fcf2eb] rounded-xl animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#fcf2eb] rounded w-32 animate-pulse" />
            <div className="h-3 bg-[#fcf2eb] rounded w-24 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onAssign }: { onAssign?: () => void }) {
  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#fcf2eb] flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-[#584237]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h4 className="text-[#1c1917] font-bold mb-2">No team members assigned</h4>
        <p className="text-[#584237]/70 text-sm mb-4">
          Add team members to this project.
        </p>
        {onAssign && (
          <button
            onClick={onAssign}
            className="px-4 py-2 bg-[#f97316] text-white text-sm font-bold rounded-lg hover:bg-[#ea580c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
          >
            Assign Team Member
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
        <h4 className="text-[#1c1917] font-bold mb-2">Unable to load team members</h4>
        <p className="text-[#584237]/70 text-sm mb-4">
          {error.message || "We couldn't load the team members. Please try again."}
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

export default function ProjectTeam({
  members = [
    {
      name: "Khalid Al-Zahrani",
      role: "Project Manager",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBw29Ek46x5ZYqV8sEO-9AuQ6emMJdThClXDHS6pscVxceSzNIvMErV3u2zI0SLPVtzii6YtZD7CiiJOeu1fnUW15g0Nsv813GZ-nEBB6ai7kF6H-aKii3_YHOBy_vWYFHucbx8N4BwDAFjsXyOFGt30gPwHgE9w92g2vGKaAv4lyBQ52OTrkNoAP9k5q6RnZjxhbjaQ01L9r4gugMa283XK5pVlibsMfvmKAlmBVZ7XxUI__A3Cx8bGSSiVOTNeSK8PsZEU2XckKoE",
    },
    {
      name: "Lina Mansour",
      role: "Structural Engineer",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5-csJt_sw4ZDCNkWORkF3UPHToA7GFUBm4N_3zagQUYhEXrC7Dxa8pSVCPdozFHfZeLuOossmf8lTlQc9pKRsN_TVhdj5Kt_bCpe8Z1MWD7Io-zuuXdZcKF2Q12uPCNBI9IJ1JLgh3xXU4SrqHeRSwg9Umoia7MPRa7-QECTszFwINjmqkZJbdAZBZQujC9KaO70Z-QEHJmzRwZyS9emnQJPOLbxpRpB_cddQ601MVjrD8VoBuLdzaqnW1AqLzEegScfayYIP3mcs",
    },
  ],
  isLoading = false,
  error = null,
  onAssign,
}: ProjectTeamProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = useCallback((memberName: string) => {
    setImageErrors((prev) => ({ ...prev, [memberName]: true }));
  }, []);

  // Handle loading state
  if (isLoading) {
    return (
      <motion.div
        className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(52,47,43,0.06)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 1, 0.5, 1] as const }}
      >
        <div className="p-6 bg-[#fcf2eb] flex items-center justify-between">
          <h3 className="font-bold text-[#1c1917] text-lg flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 1, 0.5, 1] as const }}
        role="alert"
        aria-live="polite"
      >
        <div className="p-6 bg-[#fcf2eb] flex items-center justify-between">
          <h3 className="font-bold text-[#1c1917] text-lg flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            Project Team
          </h3>
        </div>
        <ErrorState error={error} />
      </motion.div>
    );
  }

  // Handle empty state
  if (!members || members.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(52,47,43,0.06)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 1, 0.5, 1] as const }}
      >
        <div className="p-6 bg-[#fcf2eb] flex items-center justify-between">
          <h3 className="font-bold text-[#1c1917] text-lg flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            Project Team
          </h3>
        </div>
        <EmptyState onAssign={onAssign} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(52,47,43,0.06)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 1, 0.5, 1] as const }}
    >
      <div className="p-6 bg-[#fcf2eb] flex items-center justify-between">
        <h3 className="font-bold text-[#1c1917] text-lg flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          Project Team
        </h3>
        <span className="text-xs font-bold text-[#584237]/50 bg-[#fcf2eb] px-3 py-1 rounded-full">
          {members.length} {members.length === 1 ? "Member" : "Members"}
        </span>
      </div>
      <div className="p-6 space-y-3" role="list" aria-label="Team members">
          {members.map((member, index) => (
          <motion.div
            key={index}
            className="flex items-center justify-between p-4 rounded-xl hover:bg-[#fcf2eb] transition-all duration-200 group relative overflow-hidden"
            variants={teamMemberVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            whileHover={{ x: 4 }}
            role="listitem"
          >
            <HoverRipple />
            <div className="flex items-center gap-4 relative z-10 min-w-0">
              <div className="relative flex-shrink-0">
                {member.avatar && !imageErrors[member.name] ? (
                  <AvatarImage
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-xl object-cover shadow-[0_4px_12px_rgba(52,47,43,0.08)]"
                  />
                ) : (
                  <FallbackAvatar name={member.name} size={48} />
                )}
                <motion.div
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10b981] rounded-full border-2 border-white"
                  whileHover={{ scale: 1.2 }}
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <p
                  className="text-base font-bold text-[#1c1917] group-hover:text-[#9d4300] transition-colors truncate"
                  title={member.name}
                >
                  {member.name}
                </p>
                <p className="text-xs text-[#584237]/70 mt-0.5 font-medium truncate" title={member.role}>
                  {member.role}
                </p>
              </div>
            </div>
            <motion.button
              className="p-3 text-[#584237]/40 hover:text-[#9d4300] hover:bg-[#f97316]/5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2 flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Send email to ${member.name}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </motion.button>
          </motion.div>
        ))}
        
        {/* Add Team Member Button */}
        <motion.div
          className="flex items-center justify-between p-4 mt-2 rounded-xl border-2 border-dashed border-[#d6d3d1] hover:border-[#f97316] hover:bg-[#f97316]/5 transition-all duration-200 cursor-pointer group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          onClick={onAssign}
          role="button"
          tabIndex={0}
          aria-label="Assign a new team member"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onAssign?.();
            }
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#fcf2eb] flex items-center justify-center text-[#584237]/50 group-hover:bg-[#f97316]/10 group-hover:text-[#f97316] transition-colors flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[#584237]/50 group-hover:text-[#9d4300] transition-colors">
              Assign Technician...
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
