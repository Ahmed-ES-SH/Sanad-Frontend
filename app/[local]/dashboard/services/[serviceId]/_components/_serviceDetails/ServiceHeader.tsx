"use client";

import { useState } from "react";
import Link from "next/link";
import { FiEdit, FiPower } from "react-icons/fi";
import DeactivateModal from "./DeactivateModal";
import { Service } from "@/app/types/service";
import { togglePublishService } from "@/app/actions/servicesActions";
import { useRouter } from "next/navigation";

interface ServiceHeaderProps {
  service?: Service | null;
}

export default function ServiceHeader({ service }: ServiceHeaderProps) {
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const router = useRouter();

  const handleDeactivate = async () => {
    if (service) {
      try {
        await togglePublishService(service.id);
        router.refresh();
      } catch (error) {
        console.error("Failed to toggle publish status:", error);
      }
    }
    setShowDeactivateModal(false);
  };

  const serviceTitle = service?.title || "Untitled Service";
  const serviceId = service?.id || "N/A";
  const isPublished = service?.isPublished || false;

  return (
    <>
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-surface-900 font-display">
              {serviceTitle}
            </h2>
            <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 border ${
              isPublished 
                ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                : "bg-stone-100 text-stone-600 border-stone-200"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-emerald-500" : "bg-stone-400"}`}></span>
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>
          <p className="text-surface-600 font-medium flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider opacity-60 font-body">Service ID:</span>
            <code className="bg-surface-100 px-2 py-0.5 rounded text-sm font-mono text-surface-700">{serviceId}</code>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/dashboard/services/${serviceId}`}
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
            {isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>
      </section>

      <DeactivateModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={handleDeactivate}
        serviceName={serviceTitle}
      />
    </>
  );
}