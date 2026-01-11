"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { motion } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { ProjectData } from "./ProjectDetailsPage";
import Img from "../../_global/Img";
import { useRef } from "react";
import { skillIcons } from "@/app/constants/skillIcons";
import { GrTechnology } from "react-icons/gr";
import LocalLink from "../../_global/LocalLink";
import { formatTitle } from "@/app/helpers/helpers";

interface ProjectsSliderProps {
  projects: ProjectData[];
  language: "en" | "ar";
  isArabic: boolean;
}

interface ProjectSliderItemProps {
  project: ProjectData;
  language: "en" | "ar";
  isArabic: boolean;
}

// Project Slider Item Component
const ProjectSliderItem: React.FC<ProjectSliderItemProps> = ({
  project,
  language,
  isArabic,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      dir="ltr"
      className="w-full min-h-[370px]  max-w-sm bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer"
    >
      <LocalLink
        className="block"
        href={`/portfolio/${formatTitle(project.title[language])}?projectId=${
          project.id
        }`}
      >
        <div className="relative h-48 overflow-hidden">
          <Img
            src={project.imgSrc}
            alt={project.title[language]}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <span className="inline-block px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
              {project.category[language]}
            </span>
          </div>
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FaExternalLinkAlt className="text-white text-sm" />
          </div>
        </div>
        <div className={`p-4 ${isArabic ? "text-right" : "text-left"}`}>
          <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary-blue group-hover:underline duration-300">
            {project.title[language]}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {project.description[language]}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.skills.slice(0, 3).map((skill) => {
              const IconComponent = skillIcons[skill] ?? GrTechnology;
              return (
                <div
                  key={skill}
                  className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
                >
                  {IconComponent && <IconComponent className={` size-3`} />}
                  {skill}
                </div>
              );
            })}
            {project.skills.length > 3 && (
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                +{project.skills.length - 3}
              </div>
            )}
          </div>
        </div>
      </LocalLink>
    </motion.div>
  );
};

// Main Slider Component using Swiper
export default function ProjectsOfSlider({
  projects,
  language,
  isArabic,
}: ProjectsSliderProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative w-full py-6">
      {/* Navigation Buttons */}
      <button
        ref={prevRef}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50"
        aria-label="Previous project"
      >
        <FaChevronLeft className="text-blue-600" />
      </button>

      <button
        ref={nextRef}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50"
        aria-label="Next project"
      >
        <FaChevronRight className="text-blue-600" />
      </button>

      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        spaceBetween={24}
        slidesPerView={1.5}
        navigation={{
          prevEl: prevRef.current!,
          nextEl: nextRef.current!,
        }}
        onInit={(swiper) => {
          // attach navigation after refs are set
          // @ts-ignore
          swiper.params.navigation.prevEl = prevRef.current!;
          // @ts-ignore
          swiper.params.navigation.nextEl = nextRef.current!;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 1.2,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
      >
        {projects.map((project) => (
          <SwiperSlide key={project.id}>
            <ProjectSliderItem
              project={project}
              language={language}
              isArabic={isArabic}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
