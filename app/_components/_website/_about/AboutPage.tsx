"use client";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import PhilosophySection from "./PhilosophySection";
import BrandStorySection from "./BrandStorySection";
import AboutHeroSection from "./AboutHeroSection";

export default function AboutPage() {
  const { local } = useVariables();
  const { aboutPage } = getTranslations(local);

  return (
    <div className="-mt-20 overflow-hidden">
      {/* Hero Section - Deep Midnight Tech (Non-white) */}
      <AboutHeroSection local={local} aboutPage={aboutPage} />

      {/* Brand Story Section - Clean White Rhythm */}
      <BrandStorySection aboutPage={aboutPage} />

      {/* Philosophy Section - Balanced Neutral */}
      <PhilosophySection aboutPage={aboutPage} />
    </div>
  );
}
