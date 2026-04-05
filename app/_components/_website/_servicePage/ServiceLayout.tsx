"use client";
import React from "react";
import { servicesData } from "@/app/constants/servicesData";
import { useSearchParams } from "next/navigation";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { directionMap } from "@/app/constants/constants";
import { motion } from "framer-motion";
import ServiceHero from "./ServiceHero";
import ServiceAbout from "./ServiceAbout";
import ServiceProcess from "./ServiceProcess";
import ServiceFAQ from "./ServiceFAQ";
import ServiceOrderCTA from "./ServiceOrderCTA";
import RelatedServices from "./RelatedServices";
import { projectsData } from "@/app/constants/projects";

export default function ServiceLayout() {
  const { local } = useVariables();
  const { ProjectPage, servicePage } = getTranslations(local);
  const isArabic = local === "ar";
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const service =
    servicesData.find((service) => service.id === Number(serviceId)) ||
    servicesData[0];

  return (
    <div dir={directionMap[local]} className="min-h-screen mt-12 max-md:mt-20">
      <ServiceHero
        title={service.title}
        smallDesc={service.smallDesc}
        image={service.fullImage}
        category={service.category}
        stats={service.stats}
      />

      <ServiceAbout
        description={service.description}
        benefits={service.benefits}
        targetAudience={service.targetAudience}
        local={local}
        translations={servicePage}
      />

      <ServiceProcess
        steps={service.processSteps}
        local={local}
        translations={servicePage}
      />

      <ServiceFAQ faq={service.faq} local={local} translations={servicePage} />

      <ServiceOrderCTA
        packages={service.packages}
        local={local}
        translations={servicePage}
        serviceTitle={service.title}
      />

      <RelatedServices
        currentServiceId={service.id}
        currentCategory={service.category}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="c-container mx-auto px-4 py-16 md:py-24"
      >
        <div className="surface-card-elevated p-6 md:p-10">
          <div className="text-center mb-10">
            <h2 className="display-sm text-surface-900 font-display mb-3">
              {ProjectPage.allProjects}
            </h2>
            <p className="body-lg text-surface-500 max-w-2xl mx-auto">
              {ProjectPage.exploreProjects}
            </p>
          </div>
          {/* <ProjectsOfSlider
            projects={projectsData}
            language={local}
            isArabic={isArabic}
          /> */}
        </div>
      </motion.div>
    </div>
  );
}
