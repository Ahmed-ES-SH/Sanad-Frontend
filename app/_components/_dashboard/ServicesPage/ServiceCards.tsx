"use client";

import Image from "next/image";
import { Service } from "@/app/types/service";
import { useState } from "react";
import { togglePublishService, deleteService } from "@/app/actions/servicesActions";
import { motion, AnimatePresence } from "framer-motion";
import LocalLink from "../../_global/LocalLink";

interface ServiceCardsProps {
  initialServices?: Service[];
}

interface ServiceCardProps {
  id: string;
  title: string;
  shortDescription: string;
  isPublished: boolean;
  categoryName: string;
  imageUrl: string | null;
  slug: string;
}

const statusConfig = {
  active: {
    labelKey: "active",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    dotColor: "bg-green-600",
    animate: true,
  },
  pending: {
    labelKey: "pending",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    dotColor: "bg-orange-600",
    animate: false,
  },
  idle: {
    labelKey: "idle",
    bgColor: "bg-stone-100",
    textColor: "text-stone-500",
    dotColor: "bg-stone-500",
    animate: false,
  },
};

function DeleteConfirmDialog({
  serviceTitle,
  onConfirm,
  onCancel,
}: {
  serviceTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-red-600">
              warning
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              Delete Service?
            </h3>
            <p className="text-sm text-stone-500">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-stone-600 mb-6">
          Are you sure you want to delete <strong>&quot;{serviceTitle}&quot;</strong>? This will permanently remove the service.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-stone-600 font-medium hover:bg-stone-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete Service
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ServiceCard({ service, onDelete }: { service: ServiceCardProps; onDelete: (id: string) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const status = service.isPublished ? statusConfig.active : statusConfig.pending;
  const categoryColors: Record<string, string> = {
    cloudArchitecture: "text-orange-600 bg-orange-50",
    cyberSecurity: "text-blue-600 bg-blue-50",
    managedSupport: "text-amber-600 bg-amber-50",
    dataSystems: "text-purple-600 bg-purple-50",
    development: "text-teal-600 bg-teal-50",
    marketing: "text-pink-600 bg-pink-50",
    design: "text-violet-600 bg-violet-50",
  };

  const handleTogglePublish = async () => {
    setIsLoading(true);
    try {
      await togglePublishService(service.id);
      window.location.reload();
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-stone-50 rounded-xl overflow-hidden group hover:shadow-xl hover:shadow-stone-200/50 transition-all border border-transparent hover:border-orange-200">
      <div className="h-40 overflow-hidden relative">
        {service.imageUrl ? (
          <Image
            alt={service.title}
            src={service.imageUrl}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-stone-200 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-stone-400">image</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${categoryColors[service.categoryName.toLowerCase()] || "text-stone-600 bg-white/90"}`}
          >
            {service.categoryName || "Uncategorized"}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`flex items-center gap-1 text-[10px] font-bold ${status.textColor} ${status.bgColor} px-2 py-0.5 rounded-full`}
          >
            <span
              className={`w-1 h-1 rounded-full ${status.dotColor} ${status.animate ? "animate-pulse" : ""}`}
            ></span>
            {service.isPublished ? "Published" : "Draft"}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-bold text-stone-900 line-clamp-1">{service.title}</h4>
          </div>
          <p className="text-xs text-stone-500 line-clamp-2">
            {service.shortDescription}
          </p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <LocalLink 
            href={`/dashboard/services/${service.id}`}
            className="bg-stone-200 text-stone-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-500 hover:text-white transition-colors"
          >
            Manage
          </LocalLink>
          <div className="flex items-center gap-1">
            <button
              onClick={handleTogglePublish}
              disabled={isLoading}
              className="p-2 hover:bg-blue-50 text-stone-400 hover:text-blue-600 rounded-lg transition-colors disabled:opacity-50"
              title={service.isPublished ? "Unpublish" : "Publish"}
            >
              <span className="material-symbols-outlined text-lg">
                {service.isPublished ? "visibility_off" : "visibility"}
              </span>
            </button>
            <button
              onClick={() => onDelete(service.id)}
              className="p-2 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-lg transition-colors"
              title="Delete"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceCards({ initialServices = [] }: ServiceCardsProps) {
  const [services, setServices] = useState<ServiceCardProps[]>(
    initialServices.map((s) => ({
      id: s.id,
      title: s.title,
      shortDescription: s.shortDescription,
      isPublished: s.isPublished,
      categoryName: s.category?.name || "General",
      imageUrl: s.coverImageUrl,
      slug: s.slug,
    }))
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const mockServices: ServiceCardProps[] = [
    {
      id: "mock-1",
      title: "Azure Enterprise Stack",
      shortDescription: "Scalable cloud solutions for multi-region enterprise deployment and governance.",
      isPublished: true,
      categoryName: "Cloud",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop",
      slug: "azure-enterprise-stack",
    },
    {
      id: "mock-2",
      title: "Advanced Threat Protection",
      shortDescription: "Next-gen AI monitoring for real-time intrusion detection and prevention.",
      isPublished: false,
      categoryName: "Security",
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=300&fit=crop",
      slug: "advanced-threat-protection",
    },
  ];

  const displayServices = services.length > 0 ? services : mockServices;

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteService(deleteId);
        setServices(services.filter((s) => s.id !== deleteId));
      } catch (error) {
        console.error("Failed to delete service:", error);
      } finally {
        setDeleteId(null);
      }
    }
  };

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayServices.map((service) => (
          <ServiceCard key={service.id} service={service} onDelete={handleDeleteClick} />
        ))}
      </section>

      <AnimatePresence>
        {deleteId && (
          <DeleteConfirmDialog
            serviceTitle={displayServices.find((s) => s.id === deleteId)?.title || ""}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteId(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
