"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { directionMap } from "@/app/constants/constants";
import ServiceSlideCard from "../_services/ServiceSlideCard";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { servicesData } from "@/app/constants/servicesData";
import "swiper/css";

export default function ServicesSlider() {
  const { local } = useVariables();
  const { servicesSlider } = getTranslations(local);
  return (
    <>
      <div
        dir={directionMap[local]}
        className="content my-8 pt-8 border-t"
        style={{ borderColor: "var(--surface-200)" }}
      >
        <h2 className="text-2xl font-bold" style={{ color: "var(--surface-900)" }}>
          {servicesSlider.title}
        </h2>
        <p className="mt-3 text-sm sm:text-base leading-relaxed" style={{ color: "var(--surface-500)" }}>
          {servicesSlider.description}
        </p>
      </div>
      <div id="swiper">
        <Swiper
          autoplay={{ delay: 2500 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
            1536: { slidesPerView: 5 },
          }}
          modules={[Autoplay]}
          spaceBetween={30}
        >
          {servicesData.map((service, index) => (
            <SwiperSlide key={index}>
              <ServiceSlideCard local={local} service={service} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
