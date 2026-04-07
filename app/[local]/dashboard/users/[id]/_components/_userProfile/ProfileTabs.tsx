"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  { id: "profile", label: "Profile Information" },
  { id: "activity", label: "Activity Log" },
  { id: "projects", label: "Assigned Projects" },
  { id: "access", label: "Access Control" },
];

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let newIndex = index;
    
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      newIndex = (index + 1) % tabs.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      newIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      newIndex = tabs.length - 1;
    }
    
    setActiveTab(newIndex);
  };

  const personalDetails = [
    { label: "Full Legal Name", value: "Ahmed bin Sultan Al-Saud" },
    { label: "Date of Birth", value: "12 March 1988" },
    { label: "Preferred Language", value: "Arabic, English" },
    { label: "Emergency Contact", value: "+966 55 XXX XXXX" },
  ];

  const accountSettings = [
    { label: "Account Type", value: "PREMIUM ADMIN", badge: true },
    { label: "2FA Security", value: "Enabled", status: "success" },
    { label: "Auto-Renewal", value: "Enabled (Dec 2024)" },
    { label: "Login Alert Email", value: "a.alsaud@sanad.sa" },
  ];

  const tabContent = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div>
              <h4 className="text-xs font-black text-orange-600 uppercase tracking-[0.2em] mb-6">
                Personal Details
              </h4>
              <div className="space-y-6">
                {personalDetails.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex justify-between items-center pb-4 border-b border-stone-100"
                  >
                    <span className="text-stone-500 text-sm">{item.label}</span>
                    <span className="font-semibold text-sm text-stone-800">
                      {item.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black text-orange-600 uppercase tracking-[0.2em] mb-6">
                Account Settings
              </h4>
              <div className="space-y-6">
                {accountSettings.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                    className="flex justify-between items-center pb-4 border-b border-stone-100"
                  >
                    <span className="text-stone-500 text-sm">{item.label}</span>
                    {item.badge && (
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded text-[10px] font-bold">
                        {item.value}
                      </span>
                    )}
                    {item.status === "success" && (
                      <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                        <svg
                          className="text-base"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {item.value}
                      </span>
                    )}
                    {!item.badge && item.status !== "success" && (
                      <span className="font-semibold text-sm text-stone-800">
                        {item.value}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Activity Log</p>
                  <p className="text-xs text-amber-700 mt-1">View recent user activities including logins, project updates, and system access.</p>
                </div>
              </div>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-stone-500 text-sm"
            >
              Activity data would be loaded here from the API.
            </motion.p>
          </div>
        );
      case 2:
        return (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Assigned Projects</p>
                  <p className="text-xs text-amber-700 mt-1">Manage and view all projects assigned to this user.</p>
                </div>
              </div>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-stone-500 text-sm"
            >
              Project data would be loaded here from the API.
            </motion.p>
          </div>
        );
      case 3:
        return (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Access Control</p>
                  <p className="text-xs text-amber-700 mt-1">Configure user permissions, roles, and access levels.</p>
                </div>
              </div>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-stone-500 text-sm"
            >
              Access control settings would be loaded here from the API.
            </motion.p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl flex-1 flex flex-col overflow-hidden" role="region" aria-label="User profile tabs">
      <div 
        className="flex border-b border-stone-100 px-6 pt-2"
        role="tablist"
        aria-label="Profile sections"
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === idx}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === idx ? 0 : -1}
            onClick={() => setActiveTab(idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset ${
              activeTab === idx
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-stone-400 hover:text-stone-600 hover:bg-stone-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Panels with AnimatePresence for smooth transitions */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            role="tabpanel"
            id={`panel-${tabs[activeTab].id}`}
            aria-labelledby={`tab-${tabs[activeTab].id}`}
          >
            {tabContent(activeTab)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}