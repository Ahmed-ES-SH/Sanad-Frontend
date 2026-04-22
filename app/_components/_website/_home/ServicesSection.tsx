"use client";
import { directionMap } from "@/app/constants/constants";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import LocalLink from "../../_global/LocalLink";
import { Service } from "@/app/types/service";
import ServiceCard from "../_services/ServiceCard";

export default function ServicesSection({ services }: { services: Service[] }) {
  const { local } = useVariables();
  const { services: t } = getTranslations(local);

  return (
    <section
      dir={directionMap[local]}
      className="relative py-20 lg:py-32 bg-surface-50"
    >
      <div className="c-container">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 lg:mb-24">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 text-primary font-bold tracking-widest text-xs uppercase">
              <span className="w-8 h-px bg-primary" />
              {t.subtitle}
            </span>
            <h2 className="text-[2.5rem] lg:text-[4rem] font-extrabold leading-[1.1] text-surface-900 tracking-tight">
              {t.title}
            </h2>
          </div>
          <p className="text-[1.125rem] text-surface-600 leading-relaxed max-w-md">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services &&
            Array.isArray(services) &&
            services
              .slice(0, 6)
              .map((service) => (
                <ServiceCard key={service.id} service={service} local={local} />
              ))}
        </div>

        <div className="mt-20 flex justify-center">
          <LocalLink
            href="/services"
            className="surface-btn-primary px-12 h-14 text-lg"
          >
            {t.cta}
          </LocalLink>
        </div>
      </div>
    </section>
  );
}
