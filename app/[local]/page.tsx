"use client";
import HeroSection from "../_components/_website/_home/HeroSection";
import AboutComponent from "../_components/_website/_home/AboutComponent";
import ValueSection from "../_components/_website/_home/ValueSection";
import PortfolioSection from "../_components/_website/_home/PortfolioSection";
import ServicesSection from "../_components/_website/_home/ServicesSection";
import BlogSlider from "../_components/_website/_home/BlogSlider";
import ContactUS from "../_components/_website/_home/ContanctUS";
import { publicRequest } from "@/lib/api-client";
import { HOME_ENDPOINTS } from "../constants/endpoints";
import { Service } from "../types/service";
import { Article, Category } from "../types/blog";
import { Project } from "../types/project";
import { useEffect } from "react";
import { instance } from "@/lib/axios";

interface ApiResponse {
  services: Service[];
  categories: Category[];
  projects: Project[];
  articles: Article[];
}

export default async function Home() {
  // const data = await publicRequest<ApiResponse>(HOME_ENDPOINTS.LIST_PUBLISHED);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await instance.get(HOME_ENDPOINTS.LIST_PUBLISHED);

        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetch();
  }, []);

  return (
    <>
      {/* <HeroSection />
      <AboutComponent />
      <ValueSection />
      <ServicesSection services={data.services ?? []} />
      <PortfolioSection projects={data.projects} categories={data.categories} />
      <BlogSlider articles={data.articles} />
      <ContactUS /> */}
    </>
  );
}
