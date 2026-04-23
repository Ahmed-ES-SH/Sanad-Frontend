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

export function StatsCards({
  total,
  unread,
  replied,
  currentPageCount
}: {
  total: number;
  unread: number;
  replied: number;
  currentPageCount: number;
}) {
  const { local } = useVariables();
  const { ContactUsPage } = getTranslations(local);
  const t = ContactUsPage.StatsCards;

  const stats = [
    {
      label: t.totalMessages,
      value: total.toString(),
      sub: local === "ar" ? "إجمالي الرسائل" : "Total Messages",
      color: "text-stone-900",
    },
    {
      label: t.unread,
      value: unread.toString(),
      sub: local === "ar" ? "بحاجة لرد" : "Needs Attention",
      color: "text-orange-600",
    },
    {
      label: t.replied,
      value: replied.toString(),
      sub: local === "ar" ? "تم الرد" : "Replied",
      color: "text-emerald-600",
    },
    {
      label: local === "ar" ? "في هذه الصفحة" : "On Page",
      value: currentPageCount.toString(),
      sub: local === "ar" ? "عرض حالي" : "Currently Showing",
      color: "text-blue-600",
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white p-6 rounded-3xl space-y-2 border border-stone-200/50">
          <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500/70">
            {stat.label}
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-extrabold ${stat.color}`}>{stat.value}</span>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">
              {stat.sub}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}
