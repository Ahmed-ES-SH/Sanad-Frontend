"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import {
  FiArrowLeft,
  FiImage,
  FiSettings,
  FiClock,
  FiPlus,
  FiX,
  FiBold,
  FiItalic,
  FiUnderline,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiLink,
  FiImage as FiImageIcon,
  FiCode,
  FiMaximize2,
  FiFileText,
} from "react-icons/fi";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpIcon } from "@/app/_components/_dashboard/DashboardPage/Tooltip";
import { createArticle, getCategories } from "@/app/actions/blogActions";
import { useRouter } from "next/navigation";
import { Category } from "@/app/types/blog";
import { useEffect } from "react";

interface FormData {
  title: string;
  content: string;
  excerpt: string;
  coverImageUrl: string;
  categoryId: string;
  tags: string[];
}

export default function AddArticleContent() {
  const { local } = useVariables();
  const router = useRouter();
  const { AddArticlePage } = getTranslations(local);
  const t = AddArticlePage;

  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    excerpt: "",
    coverImageUrl: "",
    categoryId: "",
    tags: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const isRTL = local === "ar";

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSaveDraft = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createArticle({
        title: formData.title || "Untitled Draft",
        content: formData.content,
        excerpt: formData.excerpt,
        coverImageUrl: formData.coverImageUrl,
        categoryId: formData.categoryId || undefined,
        tags,
      });

      if (result.success) {
        router.push(`/${local}/dashboard/blog`);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to save draft");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishNow = async () => {
    if (!formData.excerpt) {
      setError("Please add an excerpt before publishing");
      return;
    }
    if (!formData.title) {
      setError("Please add a title before publishing");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createArticle({
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        coverImageUrl: formData.coverImageUrl,
        categoryId: formData.categoryId || undefined,
        tags,
      });

      if (result.success && result.data) {
        // Toggle publish after creating
        const { togglePublishStatus } =
          await import("@/app/actions/blogActions");
        await togglePublishStatus(result.data.id);
        router.push(`/${local}/dashboard/blog`);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to publish article");
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
      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium"
        >
          {error}
        </motion.div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <Link
            href={`/${local}/dashboard/blog`}
            className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide hover:opacity-80 transition-all"
          >
            <FiArrowLeft className={isRTL ? "rotate-180" : ""} />
            <span>{t.backToArticles}</span>
          </Link>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-stone-900">
            {t.title}
          </h2>
          <p className="text-stone-500 font-medium text-sm">
            {t.drafting}:{" "}
            <span className="italic text-primary font-semibold">
              {formData.title || "Untitled Masterpiece"}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 transition-colors shadow-sm active:scale-95 disabled:opacity-50"
          >
            {t.saveDraft}
          </button>
          <button
            onClick={handlePublishNow}
            disabled={isSubmitting}
            className="flex-1 md:flex-none px-8 py-2.5 rounded-xl font-bold text-white bg-linear-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all active:scale-95 disabled:opacity-50"
          >
            {t.publishNow}
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Column 1: Basic Info & Content (Left/Center) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="col-span-12 lg:col-span-9 space-y-6"
        >
          {/* Top Row: Info & Media */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Info Card */}
            <div className="md:col-span-2 p-6 space-y-4 rounded-2xl bg-stone-100/40 border border-stone-200/60 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <FiFileText className="text-stone-500" size={18} />
                <h3 className="text-xs font-black text-stone-700 uppercase tracking-widest font-display">
                  {t.articleDetails}
                </h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-stone-200 rounded-xl p-4 text-xl font-bold font-display focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none placeholder:text-stone-300 shadow-sm"
                    placeholder={t.articleTitlePlaceholder}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.65rem] font-black text-stone-500 uppercase tracking-[0.15em] ps-1 font-display">
                    {(t as any).excerpt || "Excerpt"}
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-white border border-stone-200 rounded-xl p-4 text-sm text-stone-700 focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none placeholder:text-stone-300 shadow-sm resize-none"
                    placeholder={
                      (t as any).excerptPlaceholder ||
                      "Enter a short summary..."
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[0.65rem] font-black text-stone-500 uppercase tracking-[0.15em] ps-1 font-display">
                      {t.category}
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-stone-200 rounded-xl p-3 text-sm font-bold text-stone-700 focus:ring-2 focus:ring-primary/10 focus:border-primary/30 outline-none shadow-sm cursor-pointer"
                    >
                      <option value="">{"Select Category"}</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[0.65rem] font-black text-stone-500 uppercase tracking-[0.15em] ps-1 font-display">
                      {t.tags}
                    </label>
                    <div className="flex flex-wrap gap-2 p-2 bg-white border border-stone-200 rounded-xl min-h-[46px] items-center shadow-sm">
                      <AnimatePresence mode="popLayout">
                        {tags.map((tag) => (
                          <motion.span
                            key={tag}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                            className="bg-stone-50 text-stone-700 px-2.5 py-1 rounded-lg text-[0.7rem] font-black flex items-center gap-1.5 border border-stone-200/60 shadow-sm"
                          >
                            {tag}
                            <FiX
                              className="cursor-pointer hover:text-red-500 transition-colors"
                              onClick={() => removeTag(tag)}
                            />
                          </motion.span>
                        ))}
                      </AnimatePresence>
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addTag())
                          }
                          placeholder={t.addTag}
                          className="text-[0.7rem] font-black px-2 py-1 outline-none w-16"
                        />
                        <motion.button
                          layout
                          whileHover={{ scale: 1.05 }}
                          onClick={addTag}
                          className="text-primary text-[0.7rem] font-black px-1 flex items-center hover:opacity-70 transition-all"
                        >
                          <FiPlus size={12} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Media Preview Card */}
            <div className="p-6 rounded-2xl bg-stone-100/40 border border-stone-200/60 shadow-sm backdrop-blur-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiImage className="text-stone-500" size={18} />
                  <h3 className="text-xs font-black text-stone-700 uppercase tracking-widest font-display">
                    {t.cover}
                  </h3>
                </div>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  name="coverImageUrl"
                  value={formData.coverImageUrl}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-stone-200 rounded-xl p-3 text-sm text-stone-700 focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none shadow-sm"
                  placeholder={"Enter image URL..."}
                />
                {formData.coverImageUrl && (
                  <div className="relative group overflow-hidden rounded-xl bg-white border border-stone-200 flex items-center justify-center cursor-pointer min-h-[140px] shadow-inner">
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

          {/* Main Editor Row */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
            {/* Toolbar */}
            <div className="bg-stone-50 px-2 md:px-4 py-2 border-b border-stone-200 flex items-center gap-0.5 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-0.5 shrink-0">
                {[FiBold, FiItalic, FiUnderline].map((Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    className="p-3 md:p-2 hover:bg-stone-200 rounded-lg transition-colors text-stone-600 active:bg-stone-300"
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>
              <div className="w-px h-4 bg-stone-300 mx-1 shrink-0"></div>
              <div className="flex items-center gap-0.5 shrink-0">
                {[FiAlignLeft, FiAlignCenter, FiAlignRight].map((Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    className="p-3 md:p-2 hover:bg-stone-200 rounded-lg transition-colors text-stone-600 active:bg-stone-300"
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>
              <div className="w-px h-4 bg-stone-300 mx-1 shrink-0"></div>
              <div className="flex items-center gap-0.5 shrink-0">
                {[FiLink, FiImageIcon, FiCode].map((Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    className="p-3 md:p-2 hover:bg-stone-200 rounded-lg transition-colors text-stone-600 active:bg-stone-300"
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>
              <div className="flex-1 min-w-[20px]"></div>
              <div className="flex items-center gap-3 shrink-0 pe-2">
                <span className="hidden sm:inline text-[0.65rem] font-bold text-stone-400 uppercase">
                  {t.words}:{" "}
                  {formData.content.split(/\s+/).filter(Boolean).length}
                </span>
                <button
                  type="button"
                  className="p-3 md:p-2 hover:bg-stone-200 rounded-lg transition-colors text-stone-600 active:bg-stone-300"
                >
                  <FiMaximize2 size={18} />
                </button>
              </div>
            </div>
            {/* Canvas */}
            <div className="p-5 md:p-12 min-h-[500px] md:min-h-[600px] focus:outline-none bg-white">
              <textarea
                name="content"
                value={formData.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={"Start writing your article content here..."}
                className="w-full h-full min-h-[400px] prose prose-orange max-w-none focus:outline-none bg-white resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Column 2: Sidebars (Right) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-12 lg:col-span-3 space-y-6"
        >
          {/* Collaboration Sidebar */}
          <div className="surface-card p-6 bg-stone-100/50 border border-stone-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[0.7rem] font-bold text-stone-500 uppercase tracking-widest">
                {t.collaborators}
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              {(t as any).collaboratorsDesc ||
                "Add collaborators to work on this article together."}
            </p>
          </div>

          {/* Version History Timeline */}
          <div className="surface-card p-6 bg-white border border-stone-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[0.7rem] font-bold text-stone-500 uppercase tracking-widest">
                {t.versionHistory}
              </h3>
              <FiClock className="text-stone-400" size={14} />
            </div>
            <p className="text-xs text-stone-500">
              {(t as any).versionHistoryDesc ||
                "Track all changes to your article."}
            </p>
          </div>

          {/* Visibility Card */}
          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[0.7rem] font-black text-orange-700 uppercase tracking-widest">
                {t.publishingSettings}
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiSettings className="text-sm text-orange-600" />
                  <span className="text-xs font-bold text-stone-700">
                    {t.visibility}
                  </span>
                </div>
                <span className="text-xs font-black text-primary">
                  {(t as any).draft || "Draft"}
                </span>
              </div>
              <div className="pt-4 border-t border-orange-200 space-y-3">
                <p className="text-[0.65rem] text-stone-500">
                  {(t as any).publishingNote ||
                    "Save as draft to publish later."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
