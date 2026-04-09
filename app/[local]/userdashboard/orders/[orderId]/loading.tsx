"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";

// ─── Skeleton Components ────────────────────────────────────────────────────

function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-surface-container-lowest rounded-xl overflow-hidden ring-1 ring-outline-variant/15 ${className}`}>
      <div className="bg-surface-container-low px-6 py-4 flex justify-between items-center">
        <div className="h-4 w-32 bg-surface-container-highest rounded animate-pulse" />
        <div className="h-6 w-16 bg-surface-container-highest rounded-full animate-pulse" />
      </div>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-20 bg-surface-container-highest rounded animate-pulse" />
            <div className="h-6 w-40 bg-surface-container-highest rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonTimeline() {
  return (
    <div className="bg-surface-container-lowest rounded-xl ring-1 ring-outline-variant/15 overflow-hidden">
      <div className="bg-surface-container-low px-6 py-4">
        <div className="h-4 w-24 bg-surface-container-highest rounded animate-pulse" />
      </div>
      <div className="p-8 space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-6">
            <div className="w-6 h-6 bg-surface-container-highest rounded-full animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-surface-container-highest rounded animate-pulse" />
              <div className="h-3 w-full bg-surface-container-highest rounded animate-pulse" />
              <div className="h-3 w-2/3 bg-surface-container-highest rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonSidebar() {
  return (
    <div className="space-y-6">
      {/* Support Card Skeleton */}
      <div className="bg-surface-container-lowest rounded-xl p-8 ring-1 ring-outline-variant/15">
        <div className="w-16 h-16 bg-surface-container-highest rounded-full mx-auto mb-4 animate-pulse" />
        <div className="h-5 w-40 bg-surface-container-highest rounded mx-auto mb-2 animate-pulse" />
        <div className="h-3 w-full bg-surface-container-highest rounded mb-2 animate-pulse" />
        <div className="h-3 w-3/4 bg-surface-container-highest rounded mx-auto animate-pulse" />
        <div className="h-10 w-full bg-surface-container-highest rounded-lg mt-6 animate-pulse" />
      </div>

      {/* Actions Card Skeleton */}
      <div className="bg-surface-container-low rounded-xl p-6 ring-1 ring-outline-variant/15">
        <div className="h-4 w-24 bg-surface-container-highest rounded animate-pulse mb-4" />
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-surface-container-highest rounded animate-pulse" />
                <div className="h-4 w-32 bg-surface-container-highest rounded animate-pulse" />
              </div>
              <div className="w-4 h-4 bg-surface-container-highest rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Context Card Skeleton */}
      <div className="bg-surface-container-lowest rounded-xl p-6 ring-1 ring-outline-variant/15">
        <div className="flex gap-4">
          <div className="w-5 h-5 bg-surface-container-highest rounded animate-pulse shrink-0 mt-1" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-24 bg-surface-container-highest rounded animate-pulse" />
            <div className="h-3 w-full bg-surface-container-highest rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-surface-container-highest rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Loading Component ────────────────────────────────────────────────

export default function OrderTrackingLoading() {
  const { local } = useVariables();
  const t = getTranslations(local);

  return (
    <div className="min-h-screen pb-12">
      {/* Header Skeleton */}
      <div className="mb-10">
        <div className="h-4 w-32 bg-surface-container-highest rounded animate-pulse mb-2" />
        <div className="h-10 w-64 bg-surface-container-highest rounded animate-pulse mb-2" />
        <div className="h-5 w-96 bg-surface-container-highest rounded animate-pulse" />
      </div>

      {/* Progress Tracker Skeleton */}
      <div className="bg-surface-container-lowest rounded-xl p-8 mb-8 ring-1 ring-outline-variant/15">
        <div className="relative flex items-center justify-between">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-surface-container-highest -translate-y-1/2" />
          <div className="flex gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 bg-surface-container-highest rounded-full animate-pulse" />
                <div className="h-3 w-16 bg-surface-container-highest rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <SkeletonCard />
          <SkeletonTimeline />
        </div>

        {/* Sidebar */}
        <SkeletonSidebar />
      </div>
    </div>
  );
}