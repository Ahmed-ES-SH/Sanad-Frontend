"use client";

import Image from "next/image";

interface ServiceCardProps {
  id: number;
  title: string;
  categoryKey: string;
  description: string;
  price: string;
  priceUnit: string;
  status: "active" | "pending" | "idle";
  imageUrl: string;
}

const mockServices: ServiceCardProps[] = [
  {
    id: 1,
    title: "Azure Enterprise Stack",
    categoryKey: "cloudArchitecture",
    description:
      "Scalable cloud solutions for multi-region enterprise deployment and governance.",
    price: "$1,200",
    priceUnit: "/mo",
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Advanced Threat Protection",
    categoryKey: "cyberSecurity",
    description:
      "Next-gen AI monitoring for real-time intrusion detection and prevention.",
    price: "$850",
    priceUnit: "/mo",
    status: "pending",
    imageUrl:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&h=300&fit=crop",
  },
  {
    id: 3,
    title: "On-Site Infrastructure",
    categoryKey: "managedSupport",
    description:
      "Expert hands-on support for physical hardware maintenance and networking.",
    price: "$450",
    priceUnit: "/visit",
    status: "active",
    imageUrl:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Managed SQL Scaling",
    categoryKey: "dataSystems",
    description:
      "Automated database optimization and elastic scaling for high-traffic apps.",
    price: "$320",
    priceUnit: "/mo",
    status: "idle",
    imageUrl:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=500&h=300&fit=crop",
  },
];

const statusConfig = {
  active: {
    labelKey: "active",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    dotColor: "bg-green-600",
    animate: true,
  },
  pending: {
    labelKey: "pending",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    dotColor: "bg-orange-600",
    animate: false,
  },
  idle: {
    labelKey: "idle",
    bgColor: "bg-stone-100",
    textColor: "text-stone-500",
    dotColor: "bg-stone-500",
    animate: false,
  },
};

function ServiceCard({ service }: { service: ServiceCardProps }) {
  const status = statusConfig[service.status];
  const categoryColors: Record<string, string> = {
    cloudArchitecture: "text-orange-600 bg-orange-50",
    cyberSecurity: "text-blue-600 bg-blue-50",
    managedSupport: "text-amber-600 bg-amber-50",
    dataSystems: "text-purple-600 bg-purple-50",
  };

  return (
    <div className="bg-stone-50 rounded-xl overflow-hidden group hover:shadow-xl hover:shadow-stone-200/50 transition-all border border-transparent hover:border-orange-200">
      <div className="h-40 overflow-hidden relative">
        <Image
          alt={service.title}
          src={service.imageUrl}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${categoryColors[service.categoryKey] || "text-stone-600 bg-white/90"}`}
          >
            {service.categoryKey}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-bold text-stone-900">{service.title}</h4>
            <span
              className={`flex items-center gap-1 text-[10px] font-bold ${status.textColor} ${status.bgColor} px-2 py-0.5 rounded-full`}
            >
              <span
                className={`w-1 h-1 rounded-full ${status.dotColor} ${status.animate ? "animate-pulse" : ""}`}
              ></span>
              {status.labelKey}
            </span>
          </div>
          <p className="text-xs text-stone-500 line-clamp-2">
            {service.description}
          </p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div>
            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-tight">
              {"startingAt"}
            </p>
            <p className="text-lg font-black text-stone-900">
              {service.price}
              <span className="text-xs font-medium text-stone-500">
                {service.priceUnit}
              </span>
            </p>
          </div>
          <button className="bg-stone-200 text-stone-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-500 hover:text-white transition-colors">
            {"manage"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServiceCards() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {mockServices.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </section>
  );
}
