"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Service, PaginationMeta } from "@/app/types/service";
import { useAppQuery } from "@/lib/hooks/useAppQuery";
import { useDebounce } from "@/app/hooks/useDebounce";
import { useSearchParams } from "next/navigation";
import { togglePublishService, deleteService } from "@/app/actions/servicesActions";
import { motion, AnimatePresence } from "framer-motion";
import LocalLink from "../../_global/LocalLink";
import { HiOutlineEye, HiOutlineEyeOff, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { FaExclamationTriangle } from "react-icons/fa";

interface ServiceCardsProps {
  initialServices?: Service[];
  initialMeta?: PaginationMeta;
  searchQuery?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface ServiceCardData {
  id: string;
  title: string;
  shortDescription: string;
  isPublished: boolean;
  categoryName: string;
  imageUrl: string | null;
  slug: string;
}

// Skeleton Card Component
function ServiceCardSkeleton() {
  return (
    <div className="bg-stone-100 rounded-xl overflow-hidden animate-pulse">
      <div className="h-40 bg-stone-200" />
      <div className="p-5 flex flex-col gap-4">
        <div className="space-y-2">
          <div className="h-5 bg-stone-200 rounded w-3/4" />
          <div className="h-4 bg-stone-200 rounded w-full" />
          <div className="h-4 bg-stone-200 rounded w-2/3" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-8 w-20 bg-stone-200 rounded-lg" />
          <div className="flex gap-2">
            <div className="h-10 w-10 bg-stone-200 rounded-lg" />
            <div className="h-10 w-10 bg-stone-200 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Dialog
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
            <FaExclamationTriangle className="text-red-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900">Delete Service?</h3>
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

// Single Service Card Component
function ServiceCard({
  service,
  onDelete,
}: {
  service: ServiceCardData;
  onDelete: (id: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

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

  const categoryColors: Record<string, string> = {
    cloudarchitecture: "text-orange-600 bg-orange-50",
    cloud: "text-orange-600 bg-orange-50",
    cybersecurity: "text-blue-600 bg-blue-50",
    security: "text-blue-600 bg-blue-50",
    managedsupport: "text-amber-600 bg-amber-50",
    support: "text-amber-600 bg-amber-50",
    datasystems: "text-purple-600 bg-purple-50",
    data: "text-purple-600 bg-purple-50",
    development: "text-teal-600 bg-teal-50",
    marketing: "text-pink-600 bg-pink-50",
    design: "text-violet-600 bg-violet-50",
  };

  const categoryKey = service.categoryName.toLowerCase().replace(/\s+/g, "");

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
            <span className="text-4xl text-stone-400">📦</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
              categoryColors[categoryKey] || "text-stone-600 bg-white/90"
            }`}
          >
            {service.categoryName || "Uncategorized"}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              service.isPublished
                ? "bg-green-50 text-green-600"
                : "bg-orange-50 text-orange-600"
            }`}
          >
            <span
              className={`w-1 h-1 rounded-full ${
                service.isPublished ? "bg-green-600" : "bg-orange-600"
              } ${service.isPublished ? "animate-pulse" : ""}`}
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
              {service.isPublished ? (
                <HiOutlineEyeOff className="text-lg" />
              ) : (
                <HiOutlineEye className="text-lg" />
              )}
            </button>
            <button
              onClick={() => onDelete(service.id)}
              className="p-2 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-lg transition-colors"
              title="Delete"
            >
              <HiOutlineTrash className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceCards({
  initialServices = [],
  initialMeta,
  searchQuery = "",
  categoryId = "",
  sortBy = "createdAt",
  sortOrder = "DESC",
}: ServiceCardsProps) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [services, setServices] = useState<ServiceCardData[]>(
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
  const [localMeta, setLocalMeta] = useState<PaginationMeta | undefined>(initialMeta);

  // Build dynamic query key based on all filters
  const queryKey: (string | number | undefined)[] = [
    "admin-services",
    searchQuery,
    categoryId,
    page,
    sortBy,
    sortOrder,
  ];

  // Use React Query for data fetching with backend filtering
  const { data, isLoading, isFetching } = useAppQuery<{ data: Service[]; meta: PaginationMeta }, Error>({
    queryKey,
    endpoint: `/api/admin/services?${new URLSearchParams({
      page: page.toString(),
      limit: "10",
      ...(searchQuery ? { search: searchQuery } : {}),
      ...(categoryId ? { categoryId } : {}),
      ...(sortBy ? { sortBy } : {}),
      ...(sortOrder ? { order: sortOrder } : {}),
    }).toString()}`,
    config: {
      method: "GET",
    },
    enabled: true,
    options: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: false,
    },
  });

  // Update local state when query data changes
  useEffect(() => {
    if (data) {
      setServices(
        data.data.map((s) => ({
          id: s.id,
          title: s.title,
          shortDescription: s.shortDescription,
          isPublished: s.isPublished,
          categoryName: s.category?.name || "General",
          imageUrl: s.coverImageUrl,
          slug: s.slug,
        }))
      );
      setLocalMeta(data.meta);
    }
  }, [data, searchQuery, categoryId, page, sortBy, sortOrder]);

  // Show loading skeletons while fetching (but not on initial load if we have data)
  const showSkeletons = isFetching && (!services.length || isLoading);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        const result = await deleteService(deleteId);
        if (result.success) {
          setServices(services.filter((s) => s.id !== deleteId));
        }
      } catch (error) {
        console.error("Failed to delete service:", error);
      } finally {
        setDeleteId(null);
      }
    }
  };

  const displayServices = services.length > 0 ? services : [];

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {showSkeletons
          ? Array.from({ length: 4 }).map((_, i) => <ServiceCardSkeleton key={i} />)
          : displayServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onDelete={handleDeleteClick}
              />
            ))}
      </section>

      {/* Empty State */}
      {!isFetching && displayServices.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-stone-900 mb-2">No Services Found</h3>
          <p className="text-stone-500">
            {searchQuery || categoryId
              ? "Try adjusting your filters to find what you're looking for."
              : "No services have been created yet."}
          </p>
        </div>
      )}

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