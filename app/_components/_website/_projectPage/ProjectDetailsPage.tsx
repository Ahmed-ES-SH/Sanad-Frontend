"use client";
import React from "react";
import { easeInOut, easeOut, motion } from "framer-motion";
import { FaGlobe, FaCode } from "react-icons/fa";
import Img from "@/app/_components/_global/Img";
import { projectsData } from "@/app/constants/projects";
import SidebarOfProjects from "@/app/_components/_website/_projectPage/SidebarOfProjects";
import ProjectsOfSlider from "./SliderOfProjects";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { directionMap } from "@/app/constants/constants";
import { useSearchParams } from "next/navigation";
import { GrTechnology } from "react-icons/gr";
import { skillIcons } from "@/app/constants/skillIcons";

// TypeScript interfaces
interface ProjectTitle {
  en: string;
  ar: string;
}

interface ProjectDescription {
  en: string;
  ar: string;
}

interface ProjectCategory {
  en: string;
  ar: string;
}

export interface ProjectData {
  id: number;
  imgSrc: string;
  title: ProjectTitle;
  description: ProjectDescription;
  category: ProjectCategory;
  skills: string[];
}

export interface SidebarProjectProps {
  project: ProjectData;
  local: "en" | "ar";
  isArabic: boolean;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

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

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: easeOut,
    },
  },
};

const skillVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: easeOut,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: easeInOut,
    },
  },
};

const sliderVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

// Main component
export default function ProjectDetailsPage() {
  const { local } = useVariables();
  const searchParams = useSearchParams();
  const currentProjectId = searchParams.get("projectId");
  const { ProjectPage } = getTranslations(local);

  const isArabic = local === "ar";

  const currentProject =
    projectsData.find((project) => project.id == Number(currentProjectId)) ||
    projectsData[0]; // Main project being displayed

  if (!currentProject) return;

  return (
    <div
      dir={directionMap[local]}
      className="min-h-screen pt-24 bg-linear-to-br from-gray-50 to-blue-50"
    >
      <div className="c-container py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Main Content */}
          <motion.div
            className="xl:flex-1/2 w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Project Image */}
            <motion.div
              className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl"
              variants={imageVariants}
            >
              <div className="aspect-video bg-linear-to-r from-blue-500 to-blue-600">
                <Img
                  src={currentProject.imgSrc}
                  alt={currentProject.title[local]}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>

            {/* Project Details */}
            <div
              className={`space-y-8 ${isArabic ? "text-right" : "text-left"}`}
              dir={isArabic ? "rtl" : "ltr"}
            >
              {/* Category Badge */}
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                  <FaCode className={`${isArabic ? "ml-2" : "mr-2"} text-xs`} />
                  {currentProject.category[local]}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight"
                variants={itemVariants}
              >
                {currentProject.title[local]}
              </motion.h1>

              {/* Description */}
              <motion.p
                className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl"
                variants={itemVariants}
              >
                {currentProject.description[local]}
              </motion.p>

              {/* Skills Section */}
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FaGlobe
                    className={`${isArabic ? "ml-3" : "mr-3"} text-blue-600`}
                  />
                  {ProjectPage.technologiesUsed}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {currentProject.skills.map((skill, index) => {
                    const IconComponent = skillIcons[skill] ?? GrTechnology;

                    return (
                      <motion.div
                        key={skill}
                        className="flex items-center p-4 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200"
                        variants={skillVariants}
                        whileHover="hover"
                        custom={index}
                      >
                        {
                          <IconComponent
                            className={`text-2xl text-blue-600 ${
                              isArabic ? "ml-3" : "mr-3"
                            }`}
                          />
                        }
                        <span className="font-medium text-gray-800">
                          {skill}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className={`flex flex-col sm:flex-row gap-4 pt-8 ${
                  isArabic ? "sm:justify-end" : "sm:justify-start"
                }`}
                variants={itemVariants}
              >
                <a
                  target="_blank"
                  href="https://ahmedismail.vercel.app/en"
                  className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
                >
                  {ProjectPage.viewProject}
                </a>
                <a
                  href="https://github.com/Ahmed-ES-SH"
                  target="_blank"
                  className="px-8 py-3 bg-white text-blue-600 font-medium border-2 border-blue-600 rounded-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
                >
                  {ProjectPage.sourceCode}
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <SidebarOfProjects currentProjectId={currentProject.id} />
        </div>

        {/* Projects Slider Section */}
        <motion.section
          className="mt-16 pt-3 border-t border-gray-200"
          variants={sliderVariants}
          initial="hidden"
          animate="visible"
        >
          <div
            className={`text-center mb-8 ${
              isArabic ? "text-right" : "text-left"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {ProjectPage.allProjects}
            </h2>
            <p className="text-lg text-gray-600">
              {ProjectPage.exploreProjects}
            </p>
          </div>

          <ProjectsOfSlider
            projects={projectsData}
            language={local}
            isArabic={isArabic}
          />
        </motion.section>
      </div>
    </div>
  );
}
