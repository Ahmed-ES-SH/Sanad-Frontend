"use client";

import { motion } from "framer-motion";

// Blueprint line animation for decorative accent
const blueprintLineVariants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.5, ease: [0.4, 0, 0.2, 1] as const }
  }
};

// Truncate text to specified number of lines with ellipsis
function truncateLines(text: string, maxLines: number = 3): string {
  const words = text.split(' ');
  let result = '';
  let currentLineLength = 0;
  const maxLineLength = 80; // Approximate characters per line
  
  for (const word of words) {
    if (currentLineLength + word.length + 1 > maxLineLength * currentLineLength / maxLineLength) {
      if (currentLineLength > 0) {
        result += '\n';
        currentLineLength = 0;
      }
      if (result.split('\n').length >= maxLines) {
        return result.trim() + '...';
      }
    }
    result += (currentLineLength > 0 ? ' ' : '') + word;
    currentLineLength += word.length + 1;
  }
  return result;
}

interface ProjectOverviewProps {
  description?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
  priority?: string;
  isLoading?: boolean;
  error?: Error | null;
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-[#fcf2eb] rounded w-3/4"></div>
      <div className="h-4 bg-[#fcf2eb] rounded w-1/2"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="h-3 bg-[#fcf2eb] rounded w-16 mb-2"></div>
            <div className="h-5 bg-[#fcf2eb] rounded w-24"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <div className="p-7">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#fef2f2] flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h4 className="text-[#1c1917] font-bold mb-2">Unable to load project overview</h4>
        <p className="text-[#584237]/70 text-sm mb-4 max-w-md">
          {error?.message || "We couldn't load the project details. Please try again."}
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

function EmptyState() {
  return (
    <div className="p-7">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#fcf2eb] flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-[#584237]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h4 className="text-[#1c1917] font-bold mb-2">No project overview available</h4>
        <p className="text-[#584237]/70 text-sm">
          Project details will appear here once added.
        </p>
      </div>
    </div>
  );
}

export default function ProjectOverview({
  description = "This infrastructure project involves the expansion and structural reinforcement of the second main bridge connecting the NEOM Industrial City with the Residential Hub. The scope includes deep-water piling, pre-stressed concrete slab installation, and the integration of a smart monitoring system for structural integrity. Currently entering the critical structural audit phase prior to final surfacing.",
  startDate = "Jan 12, 2024",
  endDate = "Dec 05, 2024",
  category = "Infrastructure",
  priority = "High",
  isLoading = false,
  error = null,
}: ProjectOverviewProps) {
  // Handle loading state
  if (isLoading) {
    return (
      <motion.div 
        className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(52,47,43,0.06)] relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }}
      >
        <div className="p-6 flex items-center justify-between bg-[#fcf2eb]">
          <h3 className="font-bold text-[#1c1917] text-lg flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className="w-32 h-6 bg-[#fcf2eb] rounded animate-pulse"></span>
          </h3>
        </div>
        <div className="p-7">
          <LoadingSkeleton />
        </div>
      </motion.div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <motion.div 
        className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(52,47,43,0.06)] relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }}
        role="alert"
        aria-live="polite"
      >
        <div className="p-6 flex items-center justify-between bg-[#fcf2eb]">
          <h3 className="font-bold text-[#1c1917] text-lg flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Project Overview
          </h3>
        </div>
        <ErrorState error={error} />
      </motion.div>
    );
  }

  // Handle empty state (no description)
  if (!description) {
    return (
      <motion.div 
        className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(52,47,43,0.06)] relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] as const }}
      >
        <div className="p-6 flex items-center justify-between bg-[#fcf2eb]">
          <h3 className="font-bold text-[#1c1917] text-lg flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Project Overview
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
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      {/* Decorative corner accent with blueprint animation */}
      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80" preserveAspectRatio="none">
          <motion.path
            d="M 80 0 L 80 80 L 0 80"
            fill="none"
            stroke="#f97316"
            strokeWidth="1"
            variants={blueprintLineVariants}
            initial="initial"
            animate="animate"
          />
          <motion.path
            d="M 60 10 L 60 30 M 50 20 L 70 20"
            fill="none"
            stroke="#f97316"
            strokeWidth="0.5"
            opacity="0.5"
            variants={blueprintLineVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3, duration: 1.5, ease: [0.4, 0, 0.2, 1] as const }}
          />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#f97316]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <div className="p-6 flex items-center justify-between bg-[#fcf2eb]">
        <h3 className="font-bold text-[#1c1917] text-lg flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Project Overview
        </h3>
        <button 
          className="text-[#584237]/50 hover:text-[#9d4300] p-2 rounded-lg hover:bg-[#f97316]/5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
          aria-label="Expand project overview"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>
      <div className="p-7">
        {/* Description with proper text handling for long content */}
        <p 
          className="text-[#584237] leading-relaxed text-base font-medium"
          style={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-word',
          }}
          title={description.length > 200 ? description : undefined}
        >
          {description}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 -mx-7 px-7 pb-7 bg-[#fcf2eb]/50">
          <div className="group/item min-w-0">
            <p className="text-xs text-[#584237]/50 uppercase font-bold tracking-wider mb-2">Start Date</p>
            <p className="text-base font-bold text-[#1c1917] group-hover/item:text-[#9d4300] transition-colors truncate" title={startDate}>
              {startDate}
            </p>
          </div>
          <div className="group/item min-w-0">
            <p className="text-xs text-[#584237]/50 uppercase font-bold tracking-wider mb-2">End Date</p>
            <p className="text-base font-bold text-[#1c1917] group-hover/item:text-[#9d4300] transition-colors truncate" title={endDate}>
              {endDate}
            </p>
          </div>
          <div className="group/item min-w-0">
            <p className="text-xs text-[#584237]/50 uppercase font-bold tracking-wider mb-2">Category</p>
            <p className="text-base font-bold text-[#1c1917] group-hover/item:text-[#9d4300] transition-colors truncate" title={category}>
              {category}
            </p>
          </div>
          <div className="group/item">
            <p className="text-xs text-[#584237]/50 uppercase font-bold tracking-wider mb-2">Priority</p>
            <span 
              className="inline-flex text-xs font-bold text-[#dc2626] bg-[#fef2f2] px-3 py-1.5 rounded-lg whitespace-nowrap"
              role="status"
              aria-label={`Priority: ${priority}`}
            >
              {priority}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
