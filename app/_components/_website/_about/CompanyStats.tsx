"use client";

import { directionMap } from "@/app/constants/constants";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { motion } from "framer-motion";
import { JSX, useEffect, useState } from "react";
import {
  FaBriefcase,
  FaGlobe,
  FaProjectDiagram,
  FaUsers,
} from "react-icons/fa";
import { useInView } from "react-intersection-observer";

type StatItem = {
  icon: JSX.Element;
  label: { en: string; ar: string };
  targetNumber: number;
  colorClass: string;
  suffix?: string;
};

export default function CompanyStats() {
  const { local } = useVariables();
  const { companyStats } = getTranslations(local);
  const stats: StatItem[] = [
    {
      icon: <FaUsers size={40} />,
      label: {
        en: "Satisfied Clients",
        ar: "عملاء راضون",
      },
      targetNumber: 1200,
      colorClass: "text-blue-600",
      suffix: "+",
    },
    {
      icon: <FaBriefcase size={40} />,
      label: {
        en: "Completed Projects",
        ar: "مشاريع مكتملة",
      },
      targetNumber: 240,
      colorClass: "text-red-600",
      suffix: "+",
    },
    {
      icon: <FaProjectDiagram size={40} />,
      label: {
        en: "Success Partners",
        ar: "شركاء النجاح",
      },
      targetNumber: 18,
      colorClass: "text-yellow-500",
      suffix: "",
    },
    {
      icon: <FaGlobe size={40} />,
      label: {
        en: "Countries Worldwide",
        ar: "دولة حول العالم",
      },
      targetNumber: 12,
      colorClass: "text-green-600",
      suffix: "",
    },
  ];

  function AnimatedCounter({
    targetNumber,
    start,
    suffix = "",
  }: {
    targetNumber: number;
    start: boolean;
    suffix?: string;
  }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!start) return;

      let frame: number;
      const duration = 2000;
      const startTime = performance.now();

      const animate = (time: number) => {
        const progress = Math.min((time - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * targetNumber);
        setCount(current);

        if (progress < 1) {
          frame = requestAnimationFrame(animate);
        }
      };

      frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    }, [start, targetNumber]);

    return (
      <span className="text-4xl font-bold">
        {count.toLocaleString()}
        {suffix}
      </span>
    );
  }

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section
      dir={directionMap[local]}
      ref={ref}
      className="py-20 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4" style={{ color: "var(--surface-900)" }}>
            {companyStats.title}
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-16" style={{ color: "var(--surface-500)" }}>
            {companyStats.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {stats.map(
            ({ icon, label, targetNumber, colorClass, suffix }, idx) => (
              <motion.div
                key={idx}
                className="group surface-card-subtle p-8 hover:shadow-lg transition-all duration-300 cursor-default"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: 0.15 * idx,
                  duration: 0.5,
                }}
              >
                <div
                  className="mb-6 mx-auto w-fit p-4 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: "var(--surface-100)",
                    color: colorClass.includes("blue")
                      ? "var(--accent-cyan)"
                      : colorClass.includes("red")
                      ? "var(--accent-rose)"
                      : colorClass.includes("yellow")
                      ? "var(--accent-amber)"
                      : "var(--accent-emerald)",
                  }}
                >
                  {icon}
                </div>

                <div className="mb-4">
                  <AnimatedCounter
                    targetNumber={targetNumber}
                    start={inView}
                    suffix={suffix}
                  />
                </div>

                <p className="font-semibold text-lg text-center" style={{ color: "var(--surface-600)" }}>
                  {label[local]}
                </p>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
