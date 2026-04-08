"use client";

import Link from "next/link";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { MdAssignmentAdd, MdExplore, MdWeb, MdSecurity, MdAnalytics } from "react-icons/md";
import type { IconType } from "react-icons";

interface FeaturedService {
  icon: IconType;
  title: string;
  description: string;
  href: string;
  color: string;
}

export function EmptyCartState() {
  const { local } = useVariables();
  const { cart: t } = getTranslations(local);
  const isRtl = local === "ar";

  const featuredServices: FeaturedService[] = [
    {
      icon: MdWeb,
      title: isRtl ? "تطوير المواقع" : "Web Development",
      description: isRtl ? "مواقع حديثة وسريعة" : "Modern, performant websites",
      href: "/services/web-development",
      color: "var(--primary)",
    },
    {
      icon: MdSecurity,
      title: isRtl ? "الأمن السيبراني" : "Cyber Security",
      description: isRtl ? "حماية شاملة لبياناتك" : "Comprehensive data protection",
      href: "/services/cyber-security",
      color: "var(--accent-cyan)",
    },
    {
      icon: MdAnalytics,
      title: isRtl ? "التحول الرقمي" : "Digital Transformation",
      description: isRtl ? "تحديث عملياتك بكفاءة" : "Efficient process modernization",
      href: "/services/digital-transformation",
      color: "var(--accent-emerald)",
    },
  ];

  const popularCategories = [
    { label: isRtl ? "التسويق الرقمي" : "Digital Marketing", href: "/services/digital-marketing" },
    { label: isRtl ? "تصميم UI/UX" : "UI/UX Design", href: "/services/ui-ux-design" },
    { label: isRtl ? "استشارات تقنية" : "Tech Consulting", href: "/services/tech-consulting" },
    { label: isRtl ? "إدارة المشاريع" : "Project Management", href: "/services/project-management" },
  ];

  return (
    <div className="py-12">
      {/* Hero message */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-[var(--surface-container)] border border-[var(--outline-variant)]/30 flex items-center justify-center mb-5">
          <MdAssignmentAdd className="text-4xl text-[var(--on-surface-variant)]" />
        </div>

        <h2 className="text-2xl font-semibold text-[var(--on-surface)] mb-2">
          {t.emptyCartTitle}
        </h2>

        <p className="text-[var(--on-surface-variant)] text-center max-w-md mb-6">
          {t.emptyCartDescription}
        </p>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-[var(--on-primary)] font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          <MdExplore className="text-xl" />
          {t.browseServices}
        </Link>
      </div>

      {/* Featured services inline cards */}
      <div className="mb-10">
        <h3 className="text-sm font-semibold text-[var(--on-surface)] mb-4">{t.featuredServices}</h3>
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${isRtl ? "flex-row-reverse" : ""}`}>
          {featuredServices.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group surface-card p-4 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${service.color}15` }}
                >
                  <service.icon className="text-lg" style={{ color: service.color }} />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-[var(--on-surface)] group-hover:text-[var(--primary)] transition-colors truncate">
                    {service.title}
                  </h4>
                  <p className="text-xs text-[var(--on-surface-variant)] truncate">{service.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular categories as quick links */}
      <div>
        <h3 className="text-sm font-semibold text-[var(--on-surface)] mb-3">{t.popularCategories}</h3>
        <div className={`flex flex-wrap gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
          {popularCategories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="px-4 py-2 text-xs font-medium bg-[var(--surface-container)] border border-[var(--outline-variant)]/20 rounded-full text-[var(--on-surface-variant)] hover:border-[var(--primary)]/30 hover:text-[var(--primary)] transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
