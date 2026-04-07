"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEye,
  FiXCircle,
  FiEdit2,
  FiAlertTriangle,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { Article } from "@/app/types/blog";

export function ArticleHeader({ article }: { article: Article }) {
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // E for Edit
      if (e.key === "e" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          handleEditClick();
        }
      }
      // Escape to close modal
      if (e.key === "Escape" && showUnpublishConfirm) {
        setShowUnpublishConfirm(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showUnpublishConfirm]);

  const handleEditClick = () => {
    // Trigger edit success celebration
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 2000);
    // In a real app, this would navigate to edit page
  };

  const handleUnpublish = () => {
    // In a real app, this would call an API
    // TODO: Replace with actual API call
    setShowUnpublishConfirm(false);
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-primary-100 text-orange-800 text-[10px] font-bold uppercase tracking-widest rounded-full">
              Published
            </span>
            <span className="text-stone-400 text-sm">
              Last updated 2 hours ago
            </span>
          </div>
          <h2 className="text-4xl font-extrabold font-display tracking-tight text-stone-900">
            The Future of Sustainable Urban Architecture in 2024
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 bg-stone-200/50 text-stone-700 font-semibold rounded-lg hover:bg-stone-300 transition-colors flex items-center gap-2"
          >
            <FiEye className="text-xl" />
            View Live
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUnpublishConfirm(true)}
            className="px-5 py-2.5 bg-stone-200/50 text-stone-700 font-semibold rounded-lg hover:bg-stone-300 transition-colors flex items-center gap-2"
          >
            <FiXCircle className="text-xl" />
            Unpublish
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 8px 24px rgba(249, 115, 22, 0.4)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEditClick}
            className="px-5 py-2.5 bg-gradient-primary text-white font-bold rounded-lg shadow-button hover:shadow-button-hover hover:opacity-90 transition-all flex items-center gap-2 group relative overflow-hidden"
          >
            <motion.span
              animate={editSuccess ? { scale: [1, 1.2, 0] } : {}}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center bg-emerald-500"
            >
              <FiCheck className="text-xl" />
            </motion.span>
            <span className="relative z-10 flex items-center gap-2">
              <FiEdit2 className="text-xl" />
              <span>Edit Post</span>
              <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-white/20 rounded ml-1 group-hover:bg-white/30 transition-colors">
                E
              </kbd>
            </span>
          </motion.button>
        </div>
      </motion.section>

      {/* Unpublish Confirmation Modal */}
      <AnimatePresence>
        {showUnpublishConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowUnpublishConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
              className="surface-card p-6 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <FiAlertTriangle className="text-xl text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold font-display text-stone-900">
                    Unpublish this article?
                  </h3>
                  <p className="text-stone-600 text-sm mt-2 leading-relaxed">
                    This will remove the article from your website. Don't
                    worry—you can publish it again anytime from the article
                    list.
                  </p>
                </div>
                <button
                  onClick={() => setShowUnpublishConfirm(false)}
                  className="text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <FiX />
                </button>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowUnpublishConfirm(false)}
                  className="flex-1 px-4 py-2.5 border border-stone-200 text-stone-700 font-semibold rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnpublish}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Unpublish
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
