"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowLeft, FiImage, FiFileText } from "react-icons/fi";
import { createService, togglePublishService } from "@/app/actions/servicesActions";
import { useRouter } from "next/navigation";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";

interface FormData {
  title: string;
  shortDescription: string;
  longDescription: string;
  iconUrl: string;
  coverImageUrl: string;
  categoryId: string;
}

export default function AddServiceContent() {
  const { local } = useVariables();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    shortDescription: "",
    longDescription: "",
    iconUrl: "",
    coverImageUrl: "",
    categoryId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRTL = local === "ar";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDraft = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createService({
        title: formData.title || "Untitled Service",
        shortDescription: formData.shortDescription || "",
        longDescription: formData.longDescription || undefined,
        iconUrl: formData.iconUrl || undefined,
        coverImageUrl: formData.coverImageUrl || undefined,
        categoryId: formData.categoryId || undefined,
      });

      if (result.success) {
        router.push(`/${local}/dashboard/services`);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to save service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishNow = async () => {
    if (!formData.shortDescription) {
      setError("Please add a short description before publishing");
      return;
    }
    if (!formData.title) {
      setError("Please add a title before publishing");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createService({
        title: formData.title,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription || undefined,
        iconUrl: formData.iconUrl || undefined,
        coverImageUrl: formData.coverImageUrl || undefined,
        categoryId: formData.categoryId || undefined,
      });

      if (result.success && result.data) {
        await togglePublishService(result.data.id);
        router.push(`/${local}/dashboard/services`);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to publish service");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-4 md:p-8 max-w-[1400px] mx-auto w-full space-y-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium"
        >
          {error}
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <Link
            href={`/${local}/dashboard/services`}
            className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide hover:opacity-80 transition-all"
          >
            <FiArrowLeft className={isRTL ? "rotate-180" : ""} />
            <span>Back to Services</span>
          </Link>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-stone-900">
            Add New Service
          </h2>
          <p className="text-stone-500 font-medium text-sm">
            Status:{" "}
            <span className="italic text-primary font-semibold">
              {formData.title || "Untitled Service"}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 transition-colors shadow-sm active:scale-95 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={handlePublishNow}
            disabled={isSubmitting}
            className="flex-1 md:flex-none px-8 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all active:scale-95 disabled:opacity-50"
          >
            Publish Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="col-span-12 lg:col-span-9 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 p-6 space-y-4 rounded-2xl bg-stone-100/40 border border-stone-200/60 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <FiFileText className="text-stone-500" size={18} />
                <h3 className="text-xs font-black text-stone-700 uppercase tracking-widest font-display">
                  Basic Information
                </h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[0.65rem] font-black text-stone-500 uppercase tracking-[0.15em] ps-1 font-display">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-stone-200 rounded-xl p-4 text-xl font-bold font-display focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none placeholder:text-stone-300 shadow-sm"
                    placeholder="e.g. Premium Structural Consulting"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.65rem] font-black text-stone-500 uppercase tracking-[0.15em] ps-1 font-display">
                    Short Description
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full bg-white border border-stone-200 rounded-xl p-4 text-sm text-stone-700 focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none placeholder:text-stone-300 shadow-sm resize-none"
                    placeholder="One-sentence hook for the service"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.65rem] font-black text-stone-500 uppercase tracking-[0.15em] ps-1 font-display">
                    Long Description
                  </label>
                  <textarea
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full bg-white border border-stone-200 rounded-xl p-4 text-sm text-stone-700 focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none placeholder:text-stone-300 shadow-sm resize-none"
                    placeholder="Detail the full scope of work and deliverables..."
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-stone-100/40 border border-stone-200/60 shadow-sm backdrop-blur-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiImage className="text-stone-500" size={18} />
                  <h3 className="text-xs font-black text-stone-700 uppercase tracking-widest font-display">
                    Media
                  </h3>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[0.65rem] font-black text-stone-500 uppercase tracking-[0.15em] ps-1 font-display">
                    Icon URL
                  </label>
                  <input
                    type="text"
                    name="iconUrl"
                    value={formData.iconUrl}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-stone-200 rounded-xl p-3 text-sm text-stone-700 focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none shadow-sm"
                    placeholder="https://example.com/icon.svg"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.65rem] font-black text-stone-500 uppercase tracking-[0.15em] ps-1 font-display">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    name="coverImageUrl"
                    value={formData.coverImageUrl}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-stone-200 rounded-xl p-3 text-sm text-stone-700 focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none shadow-sm"
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>
                {formData.coverImageUrl && (
                  <div className="relative group overflow-hidden rounded-xl bg-white border border-stone-200 flex items-center justify-center cursor-pointer min-h-[120px] shadow-inner">
                    <img
                      className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000"
                      src={formData.coverImageUrl}
                      alt="Cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-12 lg:col-span-3 space-y-6"
        >
          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[0.7rem] font-black text-orange-700 uppercase tracking-widest">
                Publishing Settings
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-orange-600">Visibility</span>
                </div>
                <span className="text-xs font-black text-primary">
                  Draft
                </span>
              </div>
              <div className="pt-4 border-t border-orange-200 space-y-3">
                <p className="text-[0.65rem] text-stone-500">
                  Save as draft to publish later. You can publish after adding title and short description.
                </p>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 bg-white border border-stone-200">
            <h3 className="text-[0.7rem] font-bold text-stone-500 uppercase tracking-widest mb-4">
              Service Preview
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Title</span>
                <span className="font-bold text-stone-900">
                  {formData.title || "Untitled"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Description</span>
                <span className="font-bold text-stone-900">
                  {formData.shortDescription ? "Set" : "Empty"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Has Cover</span>
                <span className="font-bold text-stone-900">
                  {formData.coverImageUrl ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
