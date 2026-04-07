"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";

//////////////////////////////////////////////////////
///////  Contact stats card data with translation keys for labels and change indicators
//////////////////////////////////////////////////////
interface ContactStatItem {
  labelKey: string;
  value: string;
  changeKey: string;
  changeType: "positive" | "warning" | "negative";
}

const statsCards: ContactStatItem[] = [
  {
    labelKey: "totalMessages",
    value: "1,284",
    changeKey: "totalMessages",
    changeType: "positive",
  },
  {
    labelKey: "unread",
    value: "42",
    changeKey: "needsAttention",
    changeType: "warning",
  },
  {
    labelKey: "avgResponseTime",
    value: "2.4h",
    changeKey: "avgResponseTime",
    changeType: "positive",
  },
  {
    labelKey: "satisfactionRate",
    value: "98%",
    changeKey: "excellent",
    changeType: "positive",
  },
];

export function StatsCards() {
  const { local } = useVariables();
  const { ContactUsPage } = getTranslations(local);
  const t = ContactUsPage.StatsCards;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((stat) => (
        <div key={stat.labelKey} className="bg-white p-6 rounded-3xl space-y-2 border border-stone-200/50">
          <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500/70">
            {t[stat.labelKey as keyof typeof t]}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-stone-900">{stat.value}</span>
            <span
              className={`text-xs font-bold ${
                stat.changeType === "positive"
                  ? "text-green-600"
                  : stat.changeType === "warning"
                  ? "text-orange-500"
                  : "text-red-600"
              }`}
            >
              {t[stat.changeKey as keyof typeof t]}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
