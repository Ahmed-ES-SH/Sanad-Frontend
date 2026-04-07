"use client";

import { motion } from "framer-motion";
import { useCallback, useState } from "react";

const documentVariants = {
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

// Document icon animation on hover
function DocumentIconAnimation({ iconBg, icon, iconColor }: { iconBg: string; icon: string; iconColor: string }) {
  return (
    <motion.div
      className={`p-3 ${iconBg} ${iconColor} rounded-xl shadow-lg`}
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
    </motion.div>
  );
}

interface Document {
  name: string;
  type: "pdf" | "blueprint" | "spreadsheet" | "other";
  meta: string;
}

interface ResourcesDocumentsProps {
  documents?: Document[];
  isLoading?: boolean;
  error?: Error | null;
  onUpload?: () => void;
  onDownload?: (doc: Document) => void;
}

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#fcf2eb] rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-[#fcf2eb] rounded w-40 animate-pulse" />
              <div className="h-3 bg-[#fcf2eb] rounded w-24 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onUpload }: { onUpload?: () => void }) {
  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#fcf2eb] flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-[#584237]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h4 className="text-[#1c1917] font-bold mb-2">No documents yet</h4>
        <p className="text-[#584237]/70 text-sm mb-4">
          Upload documents to share with your team.
        </p>
        {onUpload && (
          <button
            onClick={onUpload}
            className="px-4 py-2 bg-[#f97316] text-white text-sm font-bold rounded-lg hover:bg-[#ea580c] transition-colors focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
          >
            Upload Document
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
        <h4 className="text-[#1c1917] font-bold mb-2">Unable to load documents</h4>
        <p className="text-[#584237]/70 text-sm mb-4">
          {error.message || "We couldn't load the documents. Please try again."}
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

export default function ResourcesDocuments({
  documents = [
    {
      name: "Prime_Contract_V2.pdf",
      type: "pdf",
      meta: "Signed • 4.2 MB",
    },
    {
      name: "Site_Blueprints_B2.dwg",
      type: "blueprint",
      meta: "Updated 2d ago • 12.8 MB",
    },
    {
      name: "Material_Inventory_Q3.xlsx",
      type: "spreadsheet",
      meta: "Auto-synced • 840 KB",
    },
  ],
  isLoading = false,
  error = null,
  onUpload,
  onDownload,
}: ResourcesDocumentsProps) {
  const [downloadingIds, setDownloadingIds] = useState<Set<number>>(new Set());

  const handleDownload = useCallback((doc: Document, index: number) => {
    if (downloadingIds.has(index)) return;
    
    setDownloadingIds((prev) => new Set(prev).add(index));
    
    // Simulate download - in real app this would trigger actual download
    if (onDownload) {
      onDownload(doc);
    }
    
    // Reset after "download completes"
    setTimeout(() => {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }, 1000);
  }, [downloadingIds, onDownload]);

  // Get icon configuration based on document type
  const getDocIconConfig = (type: Document["type"]) => {
    switch (type) {
      case "pdf":
        return {
          iconBg: "bg-gradient-to-br from-[#ef4444] to-[#dc2626]",
          iconColor: "text-white",
          icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
        };
      case "blueprint":
        return {
          iconBg: "bg-gradient-to-br from-[#3b82f6] to-[#2563eb]",
          iconColor: "text-white",
          icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0-6v6m18-6v6",
        };
      case "spreadsheet":
        return {
          iconBg: "bg-gradient-to-br from-[#10b981] to-[#059669]",
          iconColor: "text-white",
          icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        };
      default:
        return {
          iconBg: "bg-gradient-to-br from-[#584237] to-[#1c1917]",
          iconColor: "text-white",
          icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
        };
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <motion.div
        className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(52,47,43,0.06)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 1, 0.5, 1] as const }}
      >
        <div className="p-6 bg-[#fcf2eb]">
          <h3 className="font-bold text-[#1c1917] text-lg flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <span className="w-48 h-6 bg-[#fcf2eb] rounded animate-pulse"></span>
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
        transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 1, 0.5, 1] as const }}
        role="alert"
        aria-live="polite"
      >
        <div className="p-6 bg-[#fcf2eb]">
          <h3 className="font-bold text-[#1c1917] text-lg flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            Resources & Documents
          </h3>
        </div>
        <ErrorState error={error} />
      </motion.div>
    );
  }

  // Handle empty state
  if (!documents || documents.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(52,47,43,0.06)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 1, 0.5, 1] as const }}
      >
        <div className="p-6 bg-[#fcf2eb]">
          <h3 className="font-bold text-[#1c1917] text-lg flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            Resources & Documents
          </h3>
        </div>
        <EmptyState onUpload={onUpload} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(52,47,43,0.06)]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 1, 0.5, 1] as const }}
    >
      <div className="p-6 bg-[#fcf2eb]">
        <h3 className="font-bold text-[#1c1917] text-lg flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-lg shadow-[#f97316]/25">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </span>
          Resources & Documents
        </h3>
      </div>
      <div className="p-3 space-y-2" role="list" aria-label="Project documents">
        {documents.map((doc, index) => {
          const iconConfig = getDocIconConfig(doc.type);
          const isDownloading = downloadingIds.has(index);

          return (
            <motion.a
              key={index}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-[#fcf2eb] transition-all duration-200 group"
              href="#"
              variants={documentVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              whileHover={{ x: 4 }}
              role="listitem"
              aria-label={`Download ${doc.name}`}
              onClick={(e) => {
                e.preventDefault();
                handleDownload(doc, index);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleDownload(doc, index);
                }
              }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <DocumentIconAnimation
                  iconBg={iconConfig.iconBg}
                  icon={iconConfig.icon}
                  iconColor={iconConfig.iconColor}
                />
                <div className="min-w-0">
                  <p
                    className="text-sm font-bold text-[#584237] group-hover:text-[#9d4300] transition-colors truncate"
                    title={doc.name}
                  >
                    {doc.name}
                  </p>
                  <p className="text-xs text-[#584237]/50 mt-0.5 font-medium truncate" title={doc.meta}>
                    {doc.meta}
                  </p>
                </div>
              </div>
              <motion.div
                className="w-10 h-10 rounded-lg bg-[#fcf2eb] flex items-center justify-center text-[#584237]/40 group-hover:bg-[#f97316]/10 group-hover:text-[#f97316] transition-all duration-200 flex-shrink-0"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-hidden="true"
              >
                {isDownloading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
              </motion.div>
            </motion.a>
          );
        })}
      </div>
      <motion.button
        className="w-full py-4 text-center text-sm font-bold text-[#f97316] border-t-2 border-[#fcf2eb] hover:bg-[#f97316]/5 transition-all duration-200 flex items-center justify-center gap-2 group focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#f97316] focus:ring-offset-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onUpload}
        aria-label="Upload a new document"
      >
        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Upload New File
      </motion.button>
    </motion.div>
  );
}
