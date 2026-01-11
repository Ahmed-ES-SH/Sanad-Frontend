"use client";
import React, { useEffect, useState } from "react";
import { easeOut, motion } from "framer-motion";

import { useVariables } from "@/app/context/VariablesContext";
import { FaCode, FaEye } from "react-icons/fa";
import Img from "../../_global/Img";
import { projectsData } from "@/app/constants/projects";
import { ProjectData, SidebarProjectProps } from "./ProjectDetailsPage";
import { formatTitle, getTranslations } from "@/app/helpers/helpers";
import LocalLink from "../../_global/LocalLink";

interface props {
  currentProjectId: number;
}

// Sidebar Project Component
const SidebarProject: React.FC<SidebarProjectProps> = ({
  project,
  local,
  isArabic,
}) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };
  return (
    <motion.div
      className="bg-white h-[320px] group rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer"
      variants={itemVariants}
      whileHover={{ y: -2 }}
    >
      <LocalLink
        className="block"
        href={`/portfolio/${formatTitle(project.title[local])}?projectId=${
          project.id
        }`}
      >
        <div className="relative max-xl:h-1/2 h-40 overflow-hidden">
          <Img
            src={project.imgSrc}
            alt={project.title[local]}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <FaEye className="text-white text-sm" />
          </div>
        </div>
        <div className={`p-3 ${isArabic ? "text-right" : "text-left"}`}>
          <span className="text-xs text-blue-600 font-medium">
            {project.category[local]}
          </span>
          <h4 className="font-semibold group-hover:underline group-hover:text-primary-blue duration-300 text-gray-900 text-sm mt-1 line-clamp-2">
            {project.title[local]}
          </h4>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {project.description[local]}
          </p>
        </div>
      </LocalLink>
    </motion.div>
  );
};

export default function SidebarOfProjects({ currentProjectId }: props) {
  const { local } = useVariables();
  const { ProjectPage } = getTranslations(local);

  const sidebarVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
        staggerChildren: 0.1,
      },
    },
  };

  const [randomProjects, setRandomProjects] = useState<ProjectData[]>([]);
  // Get random projects for sidebar (excluding current project)
  useEffect(() => {
    const otherProjects = projectsData.filter((p) => p.id !== currentProjectId);
    const shuffled = [...otherProjects].sort(() => 0.5 - Math.random());
    setRandomProjects(shuffled.slice(0, 4));
  }, [currentProjectId]);

  const isArabic = local == "ar";
  return (
    <>
      {/* Sidebar */}
      <motion.aside
        className="xl:flex-1 w-full shrink-0 space-y-6"
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className={`bg-white rounded-xl p-6 shadow-lg ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FaCode className={`${isArabic ? "ml-2" : "mr-2"} text-blue-600`} />
            {ProjectPage.otherProjects}
          </h3>
          <div className="space-y-4 max-xl:grid max-xl:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-3">
            {randomProjects.map((project) => (
              <SidebarProject
                key={project.id}
                project={project}
                local={local}
                isArabic={isArabic}
              />
            ))}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
