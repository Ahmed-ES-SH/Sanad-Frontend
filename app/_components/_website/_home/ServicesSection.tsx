"use client";
import React from "react";
import { directionMap, servicesSection } from "@/app/constants/constants";
import Img from "../../_global/Img";
import { useVariables } from "@/app/context/VariablesContext";
import { formatTitle, getTranslations } from "@/app/helpers/helpers";
import LocalLink from "../../_global/LocalLink";

export default function ServicesSection() {
  const { local } = useVariables();
  const { services } = getTranslations(local);
  
  return (
    <section dir={directionMap[local]} className="relative py-20 lg:py-32 bg-surface-50">
      <div className="c-container">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 lg:mb-24">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
              <span className="w-8 h-px bg-primary" />
              {services.subtitle}
            </span>
            <h2 className="text-[2.5rem] lg:text-[4rem] font-extrabold leading-[1.1] text-surface-900 tracking-tight">
              {services.title}
            </h2>
          </div>
          <p className="text-[1.125rem] text-surface-600 leading-relaxed max-w-md">
            {services.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {servicesSection.map((service, index) => (
            <LocalLink
              key={index}
              href={`/services/${formatTitle(
                service.title[local]
              )}?serviceId=${service.id}`}
              className="group bg-white p-10 rounded-[2rem] shadow-surface-sm hover:shadow-surface-lg transition-all duration-500 hover:-translate-y-2 border border-surface-200/50 relative overflow-hidden"
            >
              {/* Numeric Indicator */}
              <span className="absolute top-8 right-10 text-5xl font-black text-surface-100 group-hover:text-primary/5 transition-colors duration-500 select-none">
                0{index + 1}
              </span>

              <div className="mb-8 p-4 rounded-2xl bg-primary/5 w-fit group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                <Img src={service.src} className="w-10 h-10 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-500" />
              </div>

              <h3 className="text-[1.5rem] font-bold text-surface-900 group-hover:text-primary transition-colors duration-300 mb-4">
                {service.title[local]}
              </h3>

              <p className="text-body text-surface-500 leading-relaxed group-hover:text-surface-600 transition-colors duration-300">
                {service.smallDesc[local]}
              </p>

              <div className="mt-8 flex items-center gap-2 text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                {local === "ar" ? "اكتشف المزيد" : "Learn More"}
                <span className={`transition-transform duration-300 ${local === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
                  {local === 'ar' ? '←' : '→'}
                </span>
              </div>
            </LocalLink>
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <LocalLink
            href="/services"
              className="surface-btn-primary px-12 h-14 text-lg"
          >
            {services.cta}
          </LocalLink>
        </div>
      </div>
    </section>
  );
}
