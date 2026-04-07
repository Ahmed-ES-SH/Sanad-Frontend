"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UserActionsProps {
  userName: string;
  userId: string;
}

export default function UserActions({ userName, userId }: UserActionsProps) {
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showSuspendModal) {
        setShowSuspendModal(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showSuspendModal]);

  // Focus trap in modal
  useEffect(() => {
    if (showSuspendModal) {
      setTimeout(() => cancelBtnRef.current?.focus(), 50);
    }
  }, [showSuspendModal]);

  const handleSuspend = async () => {
    setIsSuspending(true);
    // Simulate API call - in real app, call suspend API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSuspending(false);
    setShowSuspendModal(false);
    // In real app: show success toast or redirect
    alert(`User ${userName} (${userId}) has been suspended.`);
  };

  return (
    <>
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowSuspendModal(true)}
          className="bg-stone-200 px-6 py-2.5 rounded-xl font-bold text-sm text-stone-700 hover:bg-stone-300 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all flex items-center gap-2"
          aria-label={`Suspend account for ${userName}`}
        >
          <svg
            className="text-lg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728m0 0a9 9 0 11-12.728 0m12.728 0a9 9 0 10-12.728 0"
            />
          </svg>
          Suspend Account
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, opacity: 0.9 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-orange-500 to-amber-500 px-8 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg shadow-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all flex items-center gap-2"
          aria-label={`Edit user ${userName}`}
        >
          <svg
            className="text-lg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit User
        </motion.button>
      </div>

      {/* Suspend Confirmation Modal with Animation */}
      <AnimatePresence>
        {showSuspendModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="suspend-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => !isSuspending && setShowSuspendModal(false)}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* Close button */}
              <button
                onClick={() => !isSuspending && setShowSuspendModal(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-full p-1"
                aria-label="Close dialog"
                disabled={isSuspending}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Icon */}
              <motion.div
                className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              >
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </motion.div>

              {/* Content */}
              <h3
                id="suspend-modal-title"
                className="text-xl font-bold text-stone-900 mb-2"
              >
                Suspend Account?
              </h3>
              <p className="text-stone-600 mb-6">
                Are you sure you want to suspend{" "}
                <span className="font-semibold text-stone-900">{userName}</span> (
                {userId})? This action will prevent the user from accessing the
                platform but can be reversed by an administrator.
              </p>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  ref={cancelBtnRef}
                  onClick={() => setShowSuspendModal(false)}
                  disabled={isSuspending}
                  className="px-4 py-2 text-sm font-bold text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleSuspend}
                  disabled={isSuspending}
                  className="px-6 py-2 bg-red-600 text-white font-bold text-sm rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  whileTap={isSuspending ? {} : { scale: 0.98 }}
                >
                  {isSuspending ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    "Confirm Suspension"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}