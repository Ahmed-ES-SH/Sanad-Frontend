"use client";

import React from "react";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { motion, useReducedMotion } from "framer-motion";
import {
  FiDownload,
  FiFileText,
  FiCheck,
  FiInfo,
  FiChevronRight,
  FiMessageCircle,
} from "react-icons/fi";

// ─── Types ────────────────────────────────────────────────────────────────

interface OrderDetails {
  id: string;
  serviceName: string;
  amount: string;
  currency: string;
  placedDate: string;
  status: "pending" | "paid" | "in_progress" | "completed";
  statusLabel: string;
}

interface TimelineEntry {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  source: string;
  isActive?: boolean;
}

interface StatusStep {
  key: "pending" | "paid" | "in_progress" | "completed";
  label: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────

const mockOrderDetails: OrderDetails = {
  id: "#SAN-99203-XT",
  serviceName: "Enterprise Maintenance Suite",
  amount: "$250.00",
  currency: "USD",
  placedDate: "Oct 24, 2024",
  status: "in_progress",
  statusLabel: "Active",
};

const mockTimeline: TimelineEntry[] = [
  {
    id: "update-1",
    title: "Initial Setup Started",
    description:
      "System configuration and resource allocation initiated for Enterprise Suite.",
    timestamp: "Oct 26, 14:30",
    source: "Automated System",
    isActive: true,
  },
  {
    id: "update-2",
    title: "Technician Assigned",
    description:
      "Senior Technician Sarah Miller has been assigned to oversee your maintenance suite.",
    timestamp: "Oct 25, 09:15",
    source: "Ops Manager",
  },
  {
    id: "update-3",
    title: "Payment Received",
    description:
      "Transaction verified. Invoice #INV-8821 generated successfully.",
    timestamp: "Oct 24, 18:45",
    source: "Billing Dept",
  },
];

const getStatusSteps = (
  status: OrderDetails["status"],
): { steps: StatusStep[]; progressWidth: string } => {
  const statusOrder: OrderDetails["status"][] = [
    "pending",
    "paid",
    "in_progress",
    "completed",
  ];
  const currentIndex = statusOrder.indexOf(status);

  const stepLabels: StatusStep["key"][] = [
    "pending",
    "paid",
    "in_progress",
    "completed",
  ];

  const statusLabelMap: Record<StatusStep["key"], string> = {
    pending: "Pending",
    paid: "Paid",
    in_progress: "In Progress",
    completed: "Completed",
  };

  const steps: StatusStep[] = stepLabels.map((key, index) => ({
    key,
    label: statusLabelMap[key],
    isCompleted: index < currentIndex,
    isCurrent: index === currentIndex,
  }));

  const progressMap: Record<OrderDetails["status"], string> = {
    pending: "0%",
    paid: "33%",
    in_progress: "66%",
    completed: "100%",
  };

  return { steps, progressWidth: progressMap[status] || "0%" };
};

// ─── Animation Variants ─────────────────────────────────────────────────

import type { Variants } from "framer-motion";
import { BiLeftArrow } from "react-icons/bi";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

// ─── Sub-Components ──────────────────────────────────────────────────────

function StatusStepComponent({
  step,
  index,
  isRtl,
}: {
  step: StatusStep;
  index: number;
  isRtl: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center gap-3 group">
      <div className="relative">
        {step.isCurrent && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{ scale: [1, 1.35, 1], opacity: [0.45, 0, 0.45] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut" as const,
            }}
          />
        )}
        <div
          className={`relative w-11 h-11 rounded-full flex items-center justify-center ring-4 ring-surface-50 transition-all duration-300 ${
            step.isCompleted || step.isCurrent
              ? "bg-primary text-white"
              : "bg-surface-200 text-surface-500"
          }`}
          role="status"
          aria-label={`${step.label}${step.isCompleted ? " - completed" : step.isCurrent ? " - current step" : ""}`}
        >
          {step.isCompleted ? (
            <FiCheck className="w-5 h-5" />
          ) : step.isCurrent ? (
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 opacity-50"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
            </svg>
          )}
        </div>
      </div>
      <span
        className={`text-xs font-semibold tracking-wide transition-colors duration-200 ${
          step.isCurrent
            ? "text-primary"
            : step.isCompleted
              ? "text-surface-700"
              : "text-surface-400"
        }`}
      >
        {step.label}
      </span>
    </div>
  );
}

function TimelineItemComponent({
  entry,
  isLast,
}: {
  entry: TimelineEntry;
  isLast: boolean;
}) {
  return (
    <div className="relative flex gap-5">
      <div
        className={`z-10 w-5 h-5 rounded-full bg-primary-100 border-[3px] border-surface-50 shrink-0 mt-1 ${
          entry.isActive ? "ring-2 ring-primary/30" : ""
        }`}
        aria-hidden="true"
      />
      {!isLast && (
        <div
          className="absolute left-[9px] top-5 bottom-[-16px] w-px bg-surface-200"
          aria-hidden="true"
        />
      )}
      <div className="flex flex-col gap-1.5 pb-6">
        <h3 className="heading-sm font-display text-surface-900">
          {entry.title}
        </h3>
        <p className="body text-surface-600 leading-relaxed">
          {entry.description}
        </p>
        <div className="flex items-center gap-2.5 mt-1">
          <time
            className="caption text-surface-500 font-semibold"
            dateTime={entry.timestamp}
          >
            {entry.timestamp}
          </time>
          <span
            className="w-1 h-1 bg-surface-300 rounded-full"
            aria-hidden="true"
          />
          <span className="caption text-primary font-semibold">
            {entry.source}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ local: string; orderId: string }>;
}) {
  const { local } = useVariables();
  const t = getTranslations(local);
  const shouldReduceMotion = useReducedMotion();

  const isRtl = local === "ar";
  const backLink = isRtl
    ? "/ar/userdashboard/orders"
    : "/en/userdashboard/orders";

  const order = mockOrderDetails;
  const timeline = mockTimeline;
  const { steps, progressWidth } = getStatusSteps(order.status);

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        className="min-h-screen pb-12 page-bg"
        aria-busy="true"
        aria-label="Loading order details"
      >
        <div className="c-container pt-8">
          <div className="h-5 w-32 bg-surface-200 rounded-lg mb-6 animate-pulse" />
          <div className="h-9 w-56 bg-surface-200 rounded-lg mb-3 animate-pulse" />
          <div className="h-5 w-80 bg-surface-200 rounded mb-10 animate-pulse" />

          <div className="h-28 w-full bg-surface-100 rounded-2xl mb-10 animate-pulse" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-56 w-full bg-surface-100 rounded-2xl animate-pulse" />
              <div className="h-80 w-full bg-surface-100 rounded-2xl animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="h-44 w-full bg-surface-100 rounded-2xl animate-pulse" />
              <div className="h-36 w-full bg-surface-100 rounded-2xl animate-pulse" />
              <div className="h-32 w-full bg-surface-100 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 page-bg">
        <div className="w-16 h-16 bg-accent-rose/10 text-accent-rose rounded-2xl flex items-center justify-center mb-5">
          <FiInfo className="w-7 h-7" aria-hidden="true" />
        </div>
        <h2 className="display-sm font-display text-surface-900 mb-2">
          {isRtl ? "عذراً، حدث خطأ ما" : "Oops! Something went wrong"}
        </h2>
        <p className="body text-surface-600 max-w-md mb-8">
          {isRtl
            ? "لم نتمكن من تحميل تفاصيل طلبك. يرجى المحاولة مرة أخرى أو التواصل مع الدعم."
            : "We couldn't load your order details. Please try again or contact support if the problem persists."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="surface-btn-primary"
          aria-label={isRtl ? "إعادة المحاولة" : "Try again"}
        >
          {isRtl ? "إعادة المحاولة" : "Try Again"}
        </button>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen mt-16 pb-12 page-bg"
    >
      <div className="c-container pt-8">
        {/* Header Section */}
        <motion.div variants={item} className="mb-8">
          {/* Back Navigation */}
          <a
            href={backLink}
            className="inline-flex items-center gap-2 text-surface-600 hover:text-primary transition-colors mb-5 group body"
            aria-label={
              isRtl ? "العودة إلى قائمة الطلبات" : "Back to orders list"
            }
          >
            <BiLeftArrow />
            <span className="font-medium">
              {isRtl ? "العودة إلى الطلبات" : "Back to Orders"}
            </span>
          </a>

          <h1 className="display-sm font-display text-surface-900 mb-1.5">
            {isRtl ? "تتبع الطلب" : "Order Tracking"}
          </h1>
          <p className="body text-surface-600">
            {isRtl
              ? "تابع تقدم طلب الخدمة الخاص بك"
              : "Stay updated on the progress of your service request."}
          </p>
        </motion.div>

        {/* Horizontal Progress Tracker */}
        <motion.div
          variants={item}
          className="bg-surface-card-bg rounded-2xl p-6 sm:p-8 mb-8 shadow-surface-sm border border-gray-200"
          role="region"
          aria-label="Order status progress"
        >
          <div className="relative flex items-center justify-between">
            {/* Track Background */}
            <div
              className="absolute top-6 left-0 w-full h-0.5 bg-surface-200 -translate-y-1/2 hidden sm:block"
              aria-hidden="true"
            />
            {/* Active Track */}
            <motion.div
              className="absolute top-6 left-0 h-0.5 bg-primary -translate-y-1/2 hidden sm:block"
              initial={{ width: shouldReduceMotion ? progressWidth : 0 }}
              animate={{ width: progressWidth }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.8,
                ease: "easeOut" as const,
              }}
              aria-hidden="true"
            />
            {/* Status Steps */}
            <div className="relative flex w-full justify-between">
              {steps.map((step, index) => (
                <StatusStepComponent
                  key={step.key}
                  step={step}
                  index={index}
                  isRtl={isRtl}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Details Card */}
            <motion.section
              variants={item}
              className="bg-surface-card-bg rounded-2xl overflow-hidden shadow-surface-sm border border-gray-200"
              aria-label="Order details"
            >
              <div className="bg-surface-50/80 px-6 sm:px-8 py-4 flex justify-between items-center border-b border-gray-200">
                <h2 className="caption text-primary font-bold uppercase tracking-wider">
                  {isRtl ? "تفاصيل الطلب" : "Order Details"}
                </h2>
                <span className="bg-primary-100 text-primary px-3 py-1 rounded-full text-xs font-bold">
                  {order.statusLabel}
                </span>
              </div>
              <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <p className="caption text-surface-500 font-bold uppercase tracking-wider mb-1.5">
                    {isRtl ? "رقم الطلب" : "Order ID"}
                  </p>
                  <p className="body-lg font-semibold text-surface-900 tabular-nums">
                    {order.id}
                  </p>
                </div>
                <div>
                  <p className="caption text-surface-500 font-bold uppercase tracking-wider mb-1.5">
                    {isRtl ? "اسم الخدمة" : "Service Name"}
                  </p>
                  <p className="body-lg font-semibold text-surface-900">
                    {order.serviceName}
                  </p>
                </div>
                <div>
                  <p className="caption text-surface-500 font-bold uppercase tracking-wider mb-1.5">
                    {isRtl ? "المبلغ" : "Amount"}
                  </p>
                  <p className="display-md font-extrabold text-primary tabular-nums">
                    {order.amount}{" "}
                    <span className="body-sm font-medium text-surface-500 uppercase tracking-wide">
                      {order.currency}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="caption text-surface-500 font-bold uppercase tracking-wider mb-1.5">
                    {isRtl ? "تاريخ الطلب" : "Date Placed"}
                  </p>
                  <p className="body-lg font-semibold text-surface-900 tabular-nums">
                    {order.placedDate}
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Status Updates Timeline */}
            <motion.section
              variants={item}
              className="bg-surface-card-bg rounded-2xl shadow-surface-sm border border-gray-200 overflow-hidden"
              aria-label="Activity log"
            >
              <div className="bg-surface-50/80 px-6 sm:px-8 py-4 border-b border-gray-200">
                <h2 className="caption text-primary font-bold uppercase tracking-wider">
                  {isRtl ? "سجل النشاط" : "Activity Log"}
                </h2>
              </div>
              <div className="p-6 sm:p-8">
                <div className="space-y-1">
                  {timeline.map((entry, index) => (
                    <TimelineItemComponent
                      key={entry.id}
                      entry={entry}
                      isLast={index === timeline.length - 1}
                    />
                  ))}
                </div>
              </div>
            </motion.section>
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Need Help Card */}
            <motion.section
              variants={item}
              className="bg-surface-card-bg rounded-2xl p-6 sm:p-8 shadow-surface-sm border border-gray-200"
              aria-label="Support"
            >
              <div className="flex gap-5">
                <div
                  className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary shrink-0"
                  aria-hidden="true"
                >
                  <FiMessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="heading-md font-display text-surface-900 mb-2">
                    {isRtl ? "تحتاج مساعدة؟" : "Need Assistance?"}
                  </h3>
                  <p className="body-sm text-surface-600 mb-5 leading-relaxed">
                    {isRtl
                      ? "فريق الدعم الفني متاح على مدار الساعة لمساعدتك في طلبك أو أي استفسارات تقنية."
                      : "Our technical support team is available 24/7 to help with your order or any technical queries."}
                  </p>
                  <button
                    className="surface-btn-primary w-full"
                    aria-label={
                      isRtl ? "تواصل مع فريق الدعم" : "Contact support team"
                    }
                  >
                    {isRtl ? "تواصل مع الدعم" : "Contact Support"}
                  </button>
                </div>
              </div>
            </motion.section>

            {/* Actions Card */}
            <motion.section
              variants={item}
              className="bg-surface-card-bg rounded-2xl p-6 sm:p-8 border border-gray-200"
              aria-label="Quick actions"
            >
              <h3 className="caption text-surface-500 font-bold uppercase tracking-wider mb-5">
                {isRtl ? "إجراءات سريعة" : "Quick Actions"}
              </h3>
              <div className="space-y-3">
                <button
                  className="w-full flex items-center justify-between p-4 bg-surface-50 rounded-xl border border-gray-200 hover:border-primary/30 hover:bg-primary-50 transition-all duration-200 group"
                  aria-label={isRtl ? "تنزيل الفاتورة" : "Download invoice"}
                >
                  <div className="flex items-center gap-3">
                    <FiDownload
                      className="w-4 h-4 text-primary shrink-0"
                      aria-hidden="true"
                    />
                    <span className="body font-medium text-surface-900">
                      {isRtl ? "تنزيل الفاتورة" : "Download Invoice"}
                    </span>
                  </div>
                  <FiChevronRight
                    className={`w-4 h-4 text-surface-400 group-hover:text-primary transition-all duration-200 shrink-0 ${
                      isRtl
                        ? "rotate-180 group-hover:-translate-x-0.5"
                        : "group-hover:translate-x-0.5"
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <button
                  className="w-full flex items-center justify-between p-4 bg-surface-50 rounded-xl border border-gray-200 hover:border-primary/30 hover:bg-primary-50 transition-all duration-200 group"
                  aria-label={
                    isRtl ? "عرض اتفاقية الخدمة" : "View service agreement"
                  }
                >
                  <div className="flex items-center gap-3">
                    <FiFileText
                      className="w-4 h-4 text-primary shrink-0"
                      aria-hidden="true"
                    />
                    <span className="body font-medium text-surface-900">
                      {isRtl ? "اتفاقية الخدمة" : "Service Agreement"}
                    </span>
                  </div>
                  <FiChevronRight
                    className={`w-4 h-4 text-surface-400 group-hover:text-primary transition-all duration-200 shrink-0 ${
                      isRtl
                        ? "rotate-180 group-hover:-translate-x-0.5"
                        : "group-hover:translate-x-0.5"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </motion.section>

            {/* Status Context Card */}
            <motion.div
              variants={item}
              className="bg-primary-50 rounded-2xl p-6 sm:p-8 border border-primary-100 relative overflow-hidden"
              role="complementary"
              aria-label="Next steps information"
            >
              <div
                className="absolute top-0 start-0 w-1 h-full bg-primary"
                aria-hidden="true"
              />
              <div className="flex gap-4">
                <div
                  className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  <FiInfo className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="body-sm font-bold text-primary mb-1.5 uppercase tracking-wider">
                    {isRtl ? "ماذا يأتي بعد؟" : "What's Next?"}
                  </h4>
                  <p className="body-sm text-surface-600 leading-relaxed">
                    {isRtl
                      ? "بمجرد اكتمال 'الإعداد الأولي'، ستتواصل معك سارة لتحديد الموعد الأول لعرض التوضيحي التشخيصي."
                      : "Once the 'Initial Setup' is complete, Sarah will reach out to schedule your first diagnostics walkthrough."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
