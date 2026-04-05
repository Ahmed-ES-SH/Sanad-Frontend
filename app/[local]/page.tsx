import React from "react";
import HeroSection from "../_components/_website/_home/HeroSection";
import AboutComponent from "../_components/_website/_home/AboutComponent";
import ValueSection from "../_components/_website/_home/ValueSection";
import PortfolioSection from "../_components/_website/_home/PortfolioSection";
import ServicesSection from "../_components/_website/_home/ServicesSection";
import BlogSlider from "../_components/_website/_home/BlogSlider";
import ContactUS from "../_components/_website/_home/ContanctUS";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutComponent />
      <ValueSection />
      <ServicesSection />
      <PortfolioSection />
      <BlogSlider />
      <ContactUS />
    </>
  );
}
