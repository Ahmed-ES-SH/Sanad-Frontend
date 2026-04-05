"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { PortfolioProject } from "@/app/constants/portfolioData";

interface Props {
  project: PortfolioProject;
  local: "en" | "ar";
}

function Counter({ target }: { target: string }) {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const numericMatch = target.match(/^(\d+)/);
    if (!numericMatch) {
      setDisplay(target);
      return;
    }

    const numericValue = parseInt(numericMatch[0], 10);
    const suffix = target.replace(numericMatch[0], "");
    const duration = 1800;
    const steps = 50;
    const stepTime = duration / steps;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplay(target);
        clearInterval(timer);
      } else {
        setDisplay(`${Math.floor(current)}${suffix}`);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{display}</span>;
}

export default function ProjectResults({ project, local }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const isRTL = local === "ar";

  if (!project.metrics.length) return null;

  return (
    <section ref={ref} className="py-10 md:py-14">
      <div className="c-container px-4">
        {/* Label */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="h-px w-8"
            style={{ backgroundColor: "var(--primary)" }}
          />
          <span
            className="caption-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--primary)" }}
          >
            {isRTL ? "النتائج" : "Results"}
          </span>
        </div>

        {/* Bold numbers — no card, raw on background */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 sm:gap-x-8">
          {project.metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div
                className="display-sm md:display-md font-display mb-2"
                style={{ color: "var(--primary)" }}
              >
                {isInView ? (
                  <Counter target={metric.value} />
                ) : (
                  metric.value
                )}
              </div>
              <p
                className="body-sm"
                style={{ color: "var(--surface-500)" }}
              >
                {metric.label[local]}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
