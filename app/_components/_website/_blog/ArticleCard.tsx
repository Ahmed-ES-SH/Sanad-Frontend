"use client";
import { FiCalendar, FiClock, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import Img from "@/app/_components/_global/Img";
import { Article } from "@/app/types/blog";
import LocalLink from "../../_global/LocalLink";

interface props {
  article: Article;
  index: number;
}

// Blog Card Component
export default function ArticleCard({ article, index }: props) {
  return (
    <motion.article
      className="bg-white h-[400px] hover:scale-[105%] rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ delay: index * 0.1 }}
    >
      <LocalLink
        className="w-full block"
        href={`/blog/${article.slug}?articleId=${article.id}`}
      >
        <div className="relative overflow-hidden">
          <Img
            src={article.coverImageUrl || ""}
            alt={article.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {article.category && (
            <div className="absolute top-4 left-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                {article.category.name}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {article.excerpt || ""}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FiCalendar size={12} />
                <span>
                  {new Date(
                    article.publishedAt || article.createdAt,
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <FiClock size={12} />
              <span>{article.readTimeMinutes} min read</span>
            </div>
          </div>
        </div>
      </LocalLink>
    </motion.article>
  );
}
