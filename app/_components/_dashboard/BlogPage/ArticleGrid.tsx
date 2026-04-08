"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { Article } from "@/app/types/blog";
import LocalLink from "../../_global/LocalLink";
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineEye, HiOutlineClock, HiOutlinePlus, HiOutlineExclamation, HiOutlineDocumentText } from "react-icons/hi";

interface ArticleGridProps {
  initialArticles: Article[];
  totalPages: number;
  currentPage: number;
}

function ArticleSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200/50 overflow-hidden animate-pulse">
      <div className="h-48 bg-stone-200" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-stone-200 rounded" />
          <div className="h-3 w-20 bg-stone-200 rounded" />
        </div>
        <div className="h-5 bg-stone-200 rounded w-3/4" />
        <div className="h-5 bg-stone-200 rounded w-1/2" />
        <div className="h-10 bg-stone-100 rounded w-full mt-4" />
        <div className="flex items-center gap-2 mt-4">
          <div className="w-6 h-6 bg-stone-200 rounded-full" />
          <div className="h-3 w-24 bg-stone-200 rounded" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ t }: { t: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
        <HiOutlineDocumentText className="text-4xl text-orange-400" />
      </div>
      <h3 className="text-xl font-bold text-stone-900 mb-2">
        {t.noArticlesTitle}
      </h3>
      <p className="text-stone-500 text-center mb-6 max-w-md">
        {t.noArticlesDesc}
      </p>
      <LocalLink href="/dashboard/blog/create" className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30">
        <HiOutlinePlus className="text-xl" />
        {t.createFirstPost}
      </LocalLink>
    </motion.div>
  );
}

function DeleteConfirmDialog({
  articleTitle,
  onConfirm,
  onCancel,
  t,
}: {
  articleTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  t: any;
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
            <HiOutlineExclamation className="text-2xl text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              {t.deleteConfirmTitle}
            </h3>
            <p className="text-sm text-stone-500">{t.deleteConfirmDesc}</p>
          </div>
        </div>
        <p className="text-stone-600 mb-6">
          {t.deleteConfirmMessage} <strong>"{articleTitle}"</strong>?{" "}
          {t.deleteConfirmWarning}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-stone-600 font-medium hover:bg-stone-100 rounded-lg transition-colors"
          >
            {t.cancel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
          >
            {t.deleteArticle}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const articleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.7 + i * 0.1,
      duration: 0.5,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  }),
};

export function ArticleGrid({ initialArticles, totalPages, currentPage }: ArticleGridProps) {
  const { local } = useVariables();
  const { BlogPage } = getTranslations(local);
  const t = BlogPage.ArticleGrid;
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Handle delete with confirmation
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      setIsLoading(true);
      try {
        await deleteArticle(deleteId);
        setArticles(articles.filter((a) => a.id !== deleteId));
      } catch (error) {
        console.error('Failed to delete article:', error);
      } finally {
        setIsLoading(false);
        setDeleteId(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteId(null);
  };

  // Handle image error - show fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f5f5f4' width='400' height='300'/%3E%3Ctext fill='%23a8a29e' font-family='sans-serif' font-size='16' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage%20unavailable%3C/text%3E%3C/svg%3E";
  };

  // Get status and color based on isPublished
  const getStatusInfo = (article: Article) => {
    if (article.isPublished) {
      return { status: 'Published', statusColor: 'bg-green-500' };
    }
    return { status: 'Draft', statusColor: 'bg-stone-400' };
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Loading state */}
        {isLoading && (
          <>
            <ArticleSkeleton />
            <ArticleSkeleton />
            <ArticleSkeleton />
          </>
        )}

        {/* Empty state */}
        {!isLoading && articles.length === 0 && <EmptyState t={t} />}

        {/* Articles */}
        {!isLoading &&
          articles.map((article, index) => {
            const statusInfo = getStatusInfo(article);
            return (
              <motion.article
                key={article.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={articleVariants}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl shadow-sm border border-stone-200/50 overflow-hidden group cursor-pointer flex flex-col h-full"
              >
                <LocalLink href={`/dashboard/blog/${article.id}`}>
                  <div className="h-48 overflow-hidden relative">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full object-cover"
                      alt={article.title}
                      src={article.coverImageUrl || ''}
                      onError={handleImageError}
                    />
                    <div className="absolute top-4 start-4">
                      <span
                        className={`${statusInfo.statusColor} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-lg`}
                      >
                        {statusInfo.status}
                      </span>
                    </div>
                  </div>
                </LocalLink>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold text-orange-600 tracking-widest uppercase bg-orange-50 px-2 py-0.5 rounded">
                      {article.category?.name || 'Uncategorized'}
                    </p>
                    <p className="text-xs text-stone-500 font-medium">
                      {formatDate(article.publishedAt || article.createdAt)}
                    </p>
                  </div>
                  <LocalLink href={`/dashboard/blog/${article.id}`}>
                    <h4 className="font-bold text-lg text-stone-900 leading-tight mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {article.title}
                    </h4>
                  </LocalLink>
                  <p className="text-xs text-stone-500 mb-4 line-clamp-2 leading-relaxed flex-grow">
                    {article.excerpt || "No summary provided for this article..."}
                  </p>
                  
                  {/* Article Metadata Details */}
                  <div className="flex items-center gap-4 mb-4 pt-4 border-t border-stone-100">
                    <div className="flex items-center gap-1 text-stone-400">
                      <HiOutlineEye className="text-sm" />
                      <span className="text-[10px] font-semibold">{article.viewsCount || 0} views</span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-400">
                      <HiOutlineClock className="text-sm" />
                      <span className="text-[10px] font-semibold">{article.readTimeMinutes || 0} min read</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200">
                        <span className="text-[10px] text-orange-600 font-bold uppercase">
                          {article.title.charAt(0)}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-stone-600 truncate max-w-[100px]">
                        Admin
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-1"
                    >
                      <LocalLink href={`/dashboard/blog/${article.id}`}>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-stone-50 text-stone-400 hover:text-orange-600 rounded-lg transition-colors border border-stone-100 opacity-70 hover:opacity-100"
                          aria-label={t.editArticle}
                        >
                          <HiOutlinePencilAlt className="text-lg" />
                        </motion.button>
                      </LocalLink>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteClick(article.id)}
                        className="p-2 bg-stone-50 text-stone-400 hover:text-red-600 rounded-lg transition-colors border border-stone-100 opacity-70 hover:opacity-100"
                        aria-label={t.deleteArticleLabel}
                      >
                        <HiOutlineTrash className="text-lg" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteId && (
          <DeleteConfirmDialog
            articleTitle={articles.find((a) => a.id === deleteId)?.title || ""}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            t={t}
          />
        )}
      </AnimatePresence>
    </>
  );
}