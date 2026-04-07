"use client";

import { useState } from "react";
import Link from "next/link";
import { FiEdit, FiPower } from "react-icons/fi";
import DeactivateModal from "./DeactivateModal";

export default function ServiceHeader() {
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const handleDeactivate = () => {
    // In production, this would call the API to deactivate the service
    console.log("Service deactivated");
    setShowDeactivateModal(false);
  };

  return (
    <>
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-surface-900 font-display">
              Cloud Infrastructure Setup
            </h2>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Active
            </span>
          </div>
          <p className="text-surface-600 font-medium flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider opacity-60 font-body">Service ID:</span>
            <code className="bg-surface-100 px-2 py-0.5 rounded text-sm font-mono text-surface-700">SVC-2024-X992</code>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="#"
            className="px-6 py-2.5 bg-surface-card border border-surface-200 text-surface-700 font-semibold rounded-xl hover:bg-surface-100 hover:border-surface-300 transition-all flex items-center gap-2 shadow-surface-sm"
          >
            <FiEdit className="text-lg" />
            Edit Service
          </Link>
          <button
            onClick={() => setShowDeactivateModal(true)}
            className="px-6 py-2.5 bg-surface-card border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 hover:border-red-300 transition-all flex items-center gap-2"
          >
            <FiPower className="text-lg" />
            Deactivate
          </button>
        </div>
      </section>

      <DeactivateModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={handleDeactivate}
        serviceName="Cloud Infrastructure Setup"
      />
    </>
  );
}