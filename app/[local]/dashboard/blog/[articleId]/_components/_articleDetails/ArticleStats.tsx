"use client";

import { Tooltip } from "@/app/_components/_dashboard/DashboardPage/Tooltip";
import { Article } from "@/app/types/blog";
import { motion } from "framer-motion";
import { FiTrendingUp } from "react-icons/fi";

const statTooltips = {
  "Page Views": "Total number of times visitors viewed this article",
  "Avg. Read Time": "Average time visitors spend reading this article",
  "Total Shares": "Number of times this article was shared on social media",
  Comments: "Total comments on this article (3 new since last visit)",
};

export function ArticleStats({ article }: { article: Article }) {
  const stats = [
    {
      label: "Page Views",
      value: "12,482",
      change: "+14%",
      trend: "up",
      color: "emerald",
    },
    {
      label: "Avg. Read Time",
      value: "4m 32s",
      change: "Stable",
      trend: "stable",
      color: "stone",
    },
    {
      label: "Total Shares",
      value: "856",
      change: "+5%",
      trend: "up",
      color: "emerald",
    },
    {
      label: "Comments",
      value: "42",
      change: "3 New",
      trend: "new",
      color: "orange",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat, index) => (
        <Tooltip
          key={index}
          content={statTooltips[stat.label as keyof typeof statTooltips] || ""}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.1 + index * 0.1,
              ease: [0.25, 1, 0.5, 1],
            }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="surface-card p-6 flex flex-col gap-1 border-b-4 border-primary/10 cursor-help"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
              {stat.label}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black font-display text-stone-900">
                {stat.value}
              </span>
              <span
                className={`text-xs font-bold flex items-center ${
                  stat.color === "emerald"
                    ? "text-emerald-600"
                    : stat.color === "orange"
                      ? "text-primary"
                      : "text-stone-400"
                }`}
              >
                {stat.trend === "up" && (
                  <FiTrendingUp className="text-sm mr-1" />
                )}
                {stat.change}
              </span>
            </div>
          </motion.div>
        </Tooltip>
      ))}
    </motion.section>
  );
}
