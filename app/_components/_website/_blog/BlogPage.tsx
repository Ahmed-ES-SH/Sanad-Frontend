"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import BlogPagination from "@/app/_components/_website/_blog/BlogPagination";
import BlogSidebar from "@/app/_components/_website/_blog/BlogSidebar";
import ArticleCard from "@/app/_components/_website/_blog/ArticleCard";
import LoadingBlogSpinner from "@/app/_components/_website/_blog/LoadingBlogSpiner";
import HeadPage from "@/app/_components/_website/_blog/HeadPage";
import SearchAndFilter from "@/app/_components/_website/_blog/SearchAndFilter";
import { directionMap } from "@/app/constants/constants";
import { useVariables } from "@/app/context/VariablesContext";
import { FaSearch } from "react-icons/fa";
import { getTranslations } from "@/app/helpers/helpers";
import { Article } from "@/app/types/blog";

interface BlogPageProps {
  initialArticles: Article[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
}

const NoPostsFound: React.FC = () => {
  const { local } = useVariables();
  const { noArticles } = getTranslations(local);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[50vh] p-10 bg-surface-card border border-surface-200 rounded-2xl text-surface-600 shadow-surface-sm"
    >
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <FaSearch className="text-3xl text-primary" />
      </div>
      <h3 className="text-2xl font-display font-bold text-surface-900 mb-2">{noArticles.title}</h3>
      <p className="text-center text-surface-500 max-w-sm font-medium">{noArticles.message}</p>
    </motion.div>
  );
};

const BlogGrid: React.FC<{
  posts: Article[];
  isLoading: boolean;
}> = ({ posts, isLoading }) => (
  <AnimatePresence mode="wait">
    {isLoading ? (
      <div key="loading" className="min-h-[400px] flex items-center justify-center">
        <LoadingBlogSpinner />
      </div>
    ) : posts.length === 0 ? (
      <NoPostsFound key="no-posts" />
    ) : (
      <motion.div
        key="content"
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {posts.map((post, index) => (
          <ArticleCard key={post.id} article={post} index={index} />
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

export default function BlogPage({ 
  initialArticles, 
  totalPosts, 
  totalPages, 
  currentPage 
}: BlogPageProps) {
  const { local } = useVariables();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("tag") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "recent");
  const [isLoading, setIsLoading] = useState(false);

  // Sync with initialArticles when they change (on server navigation)
  useEffect(() => {
    setIsLoading(false);
  }, [initialArticles]);

  const updateFilters = (params: Record<string, string | number | null>) => {
    setIsLoading(true);
    const newParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }
    });

    // Always reset to page 1 when filters change (except when page itself is changed)
    if (!params.page) {
      newParams.set("page", "1");
    }

    router.push(`/${local}/blog?${newParams.toString()}`);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Note: The actual API search might need a 'query' param, 
    // but BLOG_PLAN.md mentions 'tag' and 'categoryId'.
    // If there's no general search param in API, we might use tag or just client filter
    // for now let's assume 'tag' can be used or we need to add 'query' if API supports it.
    // Given BLOG_PLAN.md, I'll use 'tag' for now as a fallback if no other search param exists.
    updateFilters({ tag: term });
  };

  const handleSort = (sort: string) => {
    setSortBy(sort);
    updateFilters({ 
      sortBy: sort === "recent" ? "createdAt" : sort === "popular" ? "viewsCount" : "createdAt",
      order: sort === "oldest" ? "ASC" : "DESC"
    });
  };

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    updateFilters({ page });
  };

  return (
    <div dir={directionMap[local]} className="min-h-screen pt-24 bg-surface-50">
      <HeadPage />

      <main className="c-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <SearchAndFilter
              searchTerm={searchTerm}
              setSearchTerm={handleSearch}
              sortBy={sortBy}
              setSortBy={handleSort}
              totalResults={totalPosts}
              isLoading={isLoading}
            />

            <BlogGrid posts={initialArticles} isLoading={isLoading} />

            {!isLoading && totalPages > 1 && (
              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <BlogSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
