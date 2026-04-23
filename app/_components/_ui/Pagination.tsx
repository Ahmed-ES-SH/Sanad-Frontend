"use client";

import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

// Pagination Component for Orders Dashboard
export function Pagination({
  currentPage,
  totalPages,
  isLoading = false,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end === totalPages) {
        start = Math.max(1, totalPages - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const isDisabled = disabled || isLoading;

  return (
    <motion.div
      className="flex items-center justify-between gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Left side - Page info */}
      <div className="text-sm text-surface-500">
        Page <span className="font-semibold text-surface-700">{currentPage}</span> of{" "}
        <span className="font-semibold text-surface-700">{totalPages}</span>
      </div>

      {/* Right side - Controls */}
      <div className="flex items-center gap-2">
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isDisabled}
          className="p-2 rounded-lg border border-surface-200 bg-surface-card text-surface-500 hover:text-primary hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="First Page"
        >
          <FiChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isDisabled}
          className="p-2 rounded-lg border border-surface-200 bg-surface-card text-surface-500 hover:text-primary hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Previous Page"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={isDisabled}
              className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg font-medium text-sm transition-all duration-200 ${
                page === currentPage
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-card border border-surface-200 text-surface-600 hover:text-primary hover:border-primary/30"
              } ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isDisabled}
          className="p-2 rounded-lg border border-surface-200 bg-surface-card text-surface-500 hover:text-primary hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Next Page"
        >
          <FiChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || isDisabled}
          className="p-2 rounded-lg border border-surface-200 bg-surface-card text-surface-500 hover:text-primary hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Last Page"
        >
          <FiChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// Simple Loading Spinner
export function PaginationLoading() {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      <span className="text-sm text-surface-500">Loading...</span>
    </div>
  );
}