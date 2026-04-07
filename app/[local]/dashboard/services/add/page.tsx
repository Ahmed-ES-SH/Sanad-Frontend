"use client";
import { Suspense } from "react";
import { getTranslations } from "@/app/helpers/helpers";

// Import page-specific components
import { SideNavBar } from "@/app/_components/_services/add/SideNavBar";
import { HeaderSection } from "@/app/_components/_services/add/HeaderSection";
import { BasicInformationForm } from "@/app/_components/_services/add/BasicInformationForm";
import { ServiceConfiguration } from "@/app/_components/_services/add/ServiceConfiguration";
import { ServiceIdentity } from "@/app/_components/_services/add/ServiceIdentity";
import { PricingPlans } from "@/app/_components/_services/add/PricingPlans";
import { VisibilitySummary } from "@/app/_components/_services/add/VisibilitySummary";

export default async function AddServicePage() {
  const t = getTranslations("en"); // Default to English for now

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      {/* Side Navigation */}
      <SideNavBar activeItem="services" />

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Content Area */}
        <div className="p-8 max-w-7xl mx-auto w-full">
          <Suspense fallback={<div>Loading header...</div>}>
            <HeaderSection />
          </Suspense>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Main Form Section (8 Columns) */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <Suspense fallback={<div>Loading basic info...</div>}>
                <BasicInformationForm />
              </Suspense>

              <Suspense fallback={<div>Loading configuration...</div>}>
                <ServiceConfiguration />
              </Suspense>
            </div>

            {/* Sidebar Form Section (4 Columns) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <Suspense fallback={<div>Loading identity...</div>}>
                <ServiceIdentity />
              </Suspense>

              <Suspense fallback={<div>Loading pricing...</div>}>
                <PricingPlans />
              </Suspense>

              <Suspense fallback={<div>Loading visibility...</div>}>
                <VisibilitySummary />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
