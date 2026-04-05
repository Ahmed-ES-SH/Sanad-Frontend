"use client";
import React from "react";
import Img from "../../_global/Img";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { directionMap } from "@/app/constants/constants";
import LocalLink from "../../_global/LocalLink";

export default function AboutComponent() {
  const { local } = useVariables();
  const { aboutSection } = getTranslations(local);

  return (
    <section
      id="about"
      dir={directionMap[local]}
      className="relative py-16 lg:py-24"
    >
      <div className="c-container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="bg-white/70 backdrop-blur-md p-4 relative">
            <Img
              src="/about-1.png"
              className="w-full rounded-xl object-cover"
            />
            {/* Subtle glow behind image */}
            <div className="absolute -inset-2 bg-primary/25 blur-xl -z-10 rounded-full" />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <span className="surface-badge uppercase tracking-wider text-xs">
                {aboutSection.sectionTitleSmall}
              </span>
              <h2 className="text-[2.25rem] sm:text-[3rem] font-bold leading-[1.15] text-surface-900 tracking-tight">
                {aboutSection.sectionTitleLarge}
              </h2>
            </div>

            <p className="text-[1.125rem] text-surface-600 leading-relaxed max-w-xl">
              {aboutSection.description}
            </p>

            <div className="pt-4">
              <LocalLink href="/about" className="surface-btn-primary px-8">
                {aboutSection.buttonText}
              </LocalLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
