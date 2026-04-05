"use client";
import React, { useState } from "react";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { directionMap } from "@/app/constants/constants";
import { motion } from "framer-motion";
import LocalLink from "../../_global/LocalLink";

function ImageWithFallback({
  src,
  className,
  alt,
}: {
  src: string;
  className: string;
  alt?: string;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center rounded-md ${className}`}
        style={{ backgroundColor: "var(--surface-100)", minHeight: "200px" }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--surface-400)"
          strokeWidth="1.5"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      className={className}
      alt={alt}
      onError={() => setError(true)}
    />
  );
}

export default function AboutPage() {
  const { local } = useVariables();
  const { aboutPage } = getTranslations(local);
  const isRTL = local === "ar";

  return (
    <div className="-mt-20 overflow-hidden">
      {/* Hero Section - Deep Midnight Tech (Non-white) */}
      <section
        dir={directionMap[local]}
        className="relative min-h-[85vh] flex flex-col items-center justify-center pt-48 pb-24 bg-surface-900 text-white"
      >
        {/* Advanced Background Treatment */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Grainy Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('/big-wave.png')] bg-repeat mix-blend-overlay" />

          {/* Sophisticated Aura Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[160px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-violet/20 rounded-full blur-[160px]" />

          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="c-container relative z-10 flex flex-col items-center text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] lg:text-xs font-bold tracking-[0.2em] uppercase text-surface-300">
              {isRTL ? "من نحن — سند العربية" : "ABOUT US — Sanad ARABIA"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[3rem] lg:text-[5.5rem] font-black leading-[1] tracking-tight mb-8"
          >
            {aboutPage.hero_title}
            <span className="block text-primary italic font-serif mt-2 drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              {aboutPage.smartTool}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg lg:text-2xl text-surface-300 max-w-2xl mx-auto leading-relaxed mb-12 opacity-80 font-medium"
          >
            {aboutPage.hero_description}
          </motion.p>
        </div>

        {/* Floating Abstract Element */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px h-16 bg-gradient-to-b from-primary to-transparent"
          />
        </div>
      </section>

      {/* Brand Story Section - Clean White Rhythm */}
      <section
        id="about-content"
        className="bg-white py-24 lg:py-32 relative overflow-hidden text-surface-900"
      >
        <div className="c-container relative z-10">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-surface-xl border border-surface-100">
                <ImageWithFallback
                  src="/Sanad-about.png"
                  className="w-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                  alt={local === "ar" ? "فريق سند" : "Sanad Team"}
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-primary font-black tracking-[0.3em] uppercase text-xs inline-block">
                  {isRTL ? "قصتنا" : "OUR STORY"}
                </span>
                <h2 className="text-[2.5rem] lg:text-[4rem] font-black leading-tight tracking-tight text-surface-900">
                  {aboutPage.about_us_title}
                </h2>
                <div className="w-24 h-2 bg-primary rounded-full shadow-sm" />
              </div>

              <p className="text-lg lg:text-xl text-surface-600 leading-relaxed max-w-2xl font-medium">
                {aboutPage.about_us_description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section - Balanced Neutral */}
      <section className="py-24 lg:py-32 relative bg-surface-50 border-t border-surface-100">
        <div className="c-container">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
            <div className="order-2 lg:order-1 space-y-10">
              <div className="space-y-4">
                <span className="text-accent-violet font-black tracking-[0.3em] uppercase text-xs inline-block">
                  {isRTL ? "فلسفتنا" : "OUR PHILOSOPHY"}
                </span>
                <h2 className="text-[2.25rem] lg:text-[3.5rem] font-black text-surface-900 leading-tight tracking-tight">
                  {aboutPage.creative_title}
                </h2>
              </div>

              <p className="text-lg lg:text-xl text-surface-500 leading-relaxed max-w-2xl font-medium">
                {aboutPage.creative_description}
              </p>

              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="p-8 rounded-3xl bg-white shadow-surface-sm border border-surface-100 group hover:shadow-surface-lg transition-all">
                  <span className="block text-4xl lg:text-5xl font-black text-primary mb-2 group-hover:scale-110 transition-transform origin-left">
                    100%
                  </span>
                  <span className="text-xs font-bold text-surface-400 uppercase tracking-widest">
                    {isRTL ? "التزام" : "COMMITMENT"}
                  </span>
                </div>
                <div className="p-8 rounded-3xl bg-white shadow-surface-sm border border-surface-100 group hover:shadow-surface-lg transition-all">
                  <span className="block text-4xl lg:text-5xl font-black text-accent-violet mb-2 group-hover:scale-110 transition-transform origin-left">
                    24/7
                  </span>
                  <span className="text-xs font-bold text-surface-400 uppercase tracking-widest">
                    {isRTL ? "دعم" : "SUPPORT"}
                  </span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="relative surface-card p-6 rounded-[3rem] shadow-surface-xl border-white/80 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent-violet/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <ImageWithFallback
                  src="/Sanad-removebg-preview.png"
                  className="w-full object-contain relative z-10 transform group-hover:scale-105 transition-transform duration-700"
                  alt={local === "ar" ? "شعار سند" : "Sanad Logo"}
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent-violet/5 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-primary/5 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
