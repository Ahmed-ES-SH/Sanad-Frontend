"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import { blogPosts } from "@/app/constants/blogposts";
import ArticleCard from "../_blog/ArticleCard";
import { useVariables } from "@/app/context/VariablesContext";
import { Article } from "./types";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function RelatedArticlesSlider() {
  const { local } = useVariables();
  return (
    <motion.section
      style={{ direction: "ltr" }}
      className="mb-12 pt-4 border-t  border-gray-200 relative"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
    >
      <div
        dir={local == "ar" ? "rtl" : "ltr"}
        className="flex items-center justify-between"
      >
        <h3 className="text-2xl font-bold text-gray-900">
          {local == "ar" ? "أخر المقالات" : "Related Articles"}
        </h3>
      </div>

      <Swiper
        className="mt-6 h-fit"
        autoplay={{ delay: 2500 }}
        modules={[A11y, Autoplay]}
        spaceBetween={24}
        slidesPerView={2}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 3 },
        }}
        a11y={{ enabled: true }}
      >
        {blogPosts.map((article, index) => (
          <SwiperSlide key={article.id}>
            <ArticleCard article={article as any} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.section>
  );
}
