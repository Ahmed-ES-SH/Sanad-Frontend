"use client";
import React from "react";
import { PortfolioProject } from "@/app/constants/portfolioData";

interface Props {
  project: PortfolioProject;
  local: "en" | "ar";
}

export default function Testimonial({ project, local }: Props) {
  const testimonial = project.spotlight?.testimonial;
  if (!testimonial) return null;

  return (
    <section className="c-container px-4 py-10 md:py-14">
      <div
        className="rounded-2xl p-8 sm:p-10 max-w-3xl mx-auto text-center"
        style={{
          backgroundColor: "var(--surface-50)",
          border: "1px solid var(--surface-200)",
        }}
      >
        {/* Quote mark */}
        <div
          className="text-6xl font-display leading-none mb-4 select-none text-primary/20"
        >
          "
        </div>
        <blockquote
          className="body sm:text-lg leading-relaxed mb-6"
          style={{ color: "var(--surface-700)" }}
        >
          {testimonial.quote[local]}
        </blockquote>
        <div>
          <p
            className="body-sm font-semibold"
            style={{ color: "var(--surface-900)" }}
          >
            {testimonial.author[local]}
          </p>
          <p
            className="caption"
            style={{ color: "var(--surface-400)" }}
          >
            {testimonial.role[local]}
          </p>
        </div>
      </div>
    </section>
  );
}
