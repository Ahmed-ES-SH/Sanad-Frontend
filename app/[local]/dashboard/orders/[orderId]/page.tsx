"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiPrinter,
  FiInfo,
  FiClock,
  FiSend,
  FiTruck,
  FiShield,
  FiUserCheck,
  FiFileText,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";

// ─── Types ────────────────────────────────────────────────────────

interface OrderUser {
  name: string;
  email: string;
  avatar: string;
}

interface OrderDetails {
  id: string;
  user: OrderUser;
  serviceName: string;
  subscriptionType: string;
  paymentId: string;
  totalAmount: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  placedDate: string;
  status: "processing" | "completed" | "cancelled" | "pending";
  internalNotes: string;
}

interface TimelineEntry {
  id: string;
  author: string;
  authorAvatar?: string;
  timestamp: string;
  content: string;
  isSystem?: boolean;
}

interface StatusBadgeConfig {
  label: string;
  bgColor: string;
  textColor: string;
  dotColor: string;
}

type FetchState = "loading" | "success" | "error";
type SubmitState = "idle" | "submitting" | "submitted" | "error";

interface SubmissionError {
  message: string;
}

// ─── Mock Data ────────────────────────────────────────────────────

const mockOrderDetails: OrderDetails = {
  id: "#ORD-8821",
  user: {
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  serviceName: "Enterprise Maintenance Suite",
  subscriptionType: "Monthly Subscription",
  paymentId: "PAY-7721-X992-B82",
  totalAmount: "$250.00",
  currency: "USD",
  createdAt: "Oct 24, 2023 at 02:45 PM",
  updatedAt: "Oct 25, 2023 at 10:12 AM",
  placedDate: "Oct 24, 2023 at 02:45 PM",
  status: "processing",
  internalNotes:
    "Client requested priority handling for the first month setup.",
};

const mockTimeline: TimelineEntry[] = [
  {
    id: "update-1",
    author: "Admin Sanad",
    authorAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    timestamp: "TODAY, 10:12 AM",
    content:
      'Verified payment receipt and moved order to "Processing" state. Notified customer via email.',
  },
  {
    id: "update-2",
    author: "System Activity",
    timestamp: "OCT 24, 02:45 PM",
    content:
      "Order created successfully through the customer portal. Payment status: Pending.",
    isSystem: true,
  },
];

const statusBadgeConfig: Record<string, StatusBadgeConfig> = {
  processing: {
    label: "Processing",
    bgColor: "bg-primary-100",
    textColor: "text-primary-dark",
    dotColor: "bg-primary",
  },
  completed: {
    label: "Completed",
    bgColor: "bg-accent-emerald/15",
    textColor: "text-accent-emerald",
    dotColor: "bg-accent-emerald",
  },
  cancelled: {
    label: "Cancelled",
    bgColor: "bg-surface-100",
    textColor: "text-surface-500",
    dotColor: "bg-surface-400",
  },
  pending: {
    label: "Pending",
    bgColor: "bg-accent-amber/15",
    textColor: "text-accent-amber",
    dotColor: "bg-accent-amber",
  },
};

// ─── Animation Variants ───────────────────────────────────────────

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

// ─── Sub-Components ───────────────────────────────────────────────

function StatusStepper({ currentStatus }: { currentStatus: string }) {
  const steps = [
    { id: "pending", label: "Pending", icon: FiClock },
    { id: "processing", label: "Processing", icon: FiTruck },
    { id: "completed", label: "Completed", icon: FiCheckCircle },
  ];

  const currentIndex = steps.findIndex((s) => s.id === currentStatus);

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-200 -translate-y-1/2 z-0" />
        {/* Progress Line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0"
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center"
            >
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isActive
                    ? "var(--primary)"
                    : "var(--surface-card-bg)",
                  borderColor: isActive
                    ? "var(--primary)"
                    : "var(--surface-300)",
                  scale: isCurrent ? 1.1 : 1,
                }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-shadow ${
                  isCurrent ? "shadow-[0_0_0_4px_rgba(249,115,22,0.2)]" : ""
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-white" : "text-surface-400"
                  }`}
                />
              </motion.div>
              <span
                className={`absolute top-12 caption font-display whitespace-nowrap ${
                  isActive
                    ? "text-surface-900 font-semibold"
                    : "text-surface-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = statusBadgeConfig[status] || statusBadgeConfig.processing;

  return (
    <div
      className={`${config.bgColor} ${config.textColor} px-3 py-1.5 rounded-full flex items-center gap-2 caption font-display`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      {config.label}
    </div>
  );
}

function TimelineItem({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="relative ps-12">
      <div
        className={`absolute start-0 top-0 w-10 h-10 bg-surface-card-bg rounded-full flex items-center justify-center border-[3px] border-surface-100 z-10 shadow-surface-sm ${
          entry.isSystem ? "" : "overflow-hidden border-primary/20"
        }`}
      >
        {entry.authorAvatar ? (
          <img
            src={entry.authorAvatar}
            alt={entry.author}
            className="w-full h-full rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <FiClock className="w-4 h-4 text-surface-400" />
        )}
      </div>
      <div className="group">
        <div className="flex justify-between items-center mb-1">
          <span className="caption text-surface-900 font-semibold">
            {entry.author}
          </span>
          <span className="caption-xs text-surface-400">{entry.timestamp}</span>
        </div>
        <div
          className={`body-sm p-4 rounded-xl border transition-all ${
            entry.isSystem
              ? "text-surface-500 bg-surface-50/50 border-surface-100"
              : "text-surface-700 bg-surface-card-bg border-surface-200 shadow-surface-sm group-hover:shadow-surface-md"
          }`}
        >
          {entry.content}
        </div>
      </div>
    </div>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-surface-100 last:border-0">
      <div className="p-2 rounded-lg bg-surface-50 text-surface-500">
        {icon}
      </div>
      <div>
        <p className="caption-xs text-surface-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="body-sm font-semibold text-surface-900">{value}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ local: string; orderId: string }>;
}) {
  const { local } = useVariables();

  const [updateText, setUpdateText] = useState("");
  const [fetchState, setFetchState] = useState<FetchState>("loading");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submissionError, setSubmissionError] =
    useState<SubmissionError | null>(null);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);

  // Simulate fetch (replace with actual API call)
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        await new Promise((r) => setTimeout(r, 800)); // Simulated delay
        setOrder(mockOrderDetails);
        setTimeline(mockTimeline);
        setFetchState("success");
      } catch {
        setFetchState("error");
      }
    };
    fetchOrder();
  }, []);

  const handlePostUpdate = async () => {
    if (!updateText.trim()) return;

    setSubmitState("submitting");
    setSubmissionError(null);

    try {
      await new Promise((r) => setTimeout(r, 600)); // Simulated delay
      setSubmitState("submitted");
      setUpdateText("");
      setTimeout(() => setSubmitState("idle"), 3000);
    } catch {
      setSubmitState("error");
      setSubmissionError({
        message: "Failed to post update. Please try again.",
      });
    }
  };

  const dismissError = () => {
    setSubmissionError(null);
    setSubmitState("idle");
  };

  // ─── Loading Skeleton ───────────────────────────────────────────
  if (fetchState === "loading") {
    return (
      <div className="page-bg min-h-screen">
        <div className="h-40 w-full bg-surface-100 animate-pulse rounded-2xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-64 bg-surface-100 animate-pulse rounded-2xl" />
            <div className="h-32 bg-surface-100 animate-pulse rounded-2xl" />
          </div>
          <div className="h-[500px] bg-surface-100 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────────────────────
  if (fetchState === "error" || !order) {
    return (
      <div className="page-bg min-h-screen flex items-center justify-center">
        <div className="surface-card p-8 max-w-md text-center">
          <FiAlertCircle className="w-12 h-12 text-accent-rose mx-auto mb-4" />
          <h2 className="heading-lg text-surface-900 mb-2">
            Unable to Load Order
          </h2>
          <p className="body text-surface-600 mb-6">
            We couldn't retrieve the order details. This could be due to a
            network issue or the order may have been removed.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="surface-btn-primary mx-auto"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ─── Main Render ────────────────────────────────────────────────
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="page-bg min-h-screen pb-20"
    >
      {/* ─── Page Header ─── */}
      <motion.div
        variants={item}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="caption text-primary font-bold uppercase tracking-widest bg-primary/5 px-2 py-1 rounded">
              Order Case
            </span>
            <span className="w-1 h-1 rounded-full bg-surface-300" />
            <span className="caption text-surface-500">{order.placedDate}</span>
          </div>
          <h1 className="display-sm text-surface-900 font-display">
            {order.id}
          </h1>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <button className="surface-btn-secondary px-5 py-2.5 flex items-center justify-center gap-2 flex-1 lg:flex-none">
            <FiPrinter className="w-4 h-4" />
            Invoice
          </button>
          <button className="surface-btn-primary px-6 py-2.5 flex items-center justify-center gap-2 flex-1 lg:flex-none shadow-primary-sm">
            <FiCheckCircle className="w-4 h-4" />
            Update Status
          </button>
        </div>
      </motion.div>

      {/* ─── Progress Visualizer ─── */}
      <motion.div
        variants={item}
        className="surface-card p-6 mb-8 overflow-hidden"
      >
        <h3 className="heading-sm text-surface-900 mb-2 flex items-center gap-2">
          <FiTruck className="text-primary" />
          Order Progress
        </h3>
        <StatusStepper currentStatus={order.status} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── Main Details Column ─── */}
        <div className="lg:col-span-2 space-y-8">
          {/* Service & Customer Section */}
          <motion.div variants={item} className="surface-card overflow-hidden">
            <div className="p-6 border-b border-surface-100 bg-surface-50/30 flex justify-between items-center">
              <h2 className="heading-md text-surface-900 flex items-center gap-3">
                <FiFileText className="text-primary" />
                Service Overview
              </h2>
              <StatusBadge status={order.status} />
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Customer Info */}
                <div>
                  <label className="caption-xs text-surface-400 uppercase tracking-widest mb-4 block">
                    Customer Entity
                  </label>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-50 border border-surface-100">
                    <img
                      alt={order.user.name}
                      src={order.user.avatar}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <p className="heading-sm text-surface-900 leading-tight">
                        {order.user.name}
                      </p>
                      <p className="body-sm text-surface-500">
                        {order.user.email}
                      </p>
                      <button className="text-primary caption font-bold mt-1 hover:underline">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>

                {/* Service Info */}
                <div>
                  <label className="caption-xs text-surface-400 uppercase tracking-widest mb-4 block">
                    Subscription Details
                  </label>
                  <div className="space-y-4">
                    <div>
                      <p className="heading-md text-surface-900 font-display">
                        {order.serviceName}
                      </p>
                      <p className="body-sm text-primary font-medium flex items-center gap-1.5 mt-1">
                        <FiShield className="w-3.5 h-3.5" />
                        {order.subscriptionType}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="mt-10 pt-8 border-t border-surface-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-4 rounded-xl border border-surface-100 shadow-surface-sm">
                    <p className="caption text-surface-400 mb-1">
                      Total Payable
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="heading-xl text-surface-900">
                        {order.totalAmount}
                      </span>
                      <span className="caption text-surface-500 font-bold">
                        {order.currency}
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex flex-col justify-center space-y-3">
                    <div className="flex justify-between items-center px-2">
                      <span className="body-sm text-surface-500">
                        Transaction ID
                      </span>
                      <span className="body-sm font-mono text-surface-900 bg-surface-100 px-2 py-0.5 rounded">
                        {order.paymentId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <span className="body-sm text-surface-500">
                        Payment Status
                      </span>
                      <span className="body-sm font-bold text-accent-emerald flex items-center gap-1.5">
                        <FiCheckCircle /> Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Internal Context */}
              <div className="mt-8 p-5 rounded-xl bg-accent-amber/5 border border-accent-amber/10">
                <p className="caption-xs text-accent-amber font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <FiAlertCircle className="w-3.5 h-3.5" />
                  Operator Context
                </p>
                <p className="body-sm text-surface-700 leading-relaxed italic">
                  &quot;{order.internalNotes}&quot;
                </p>
              </div>
            </div>
          </motion.div>

          {/* ─── Secondary Info: Quick Facts ─── */}
          <motion.div
            variants={item}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="surface-card p-6">
              <h3 className="heading-sm text-surface-900 mb-4 border-b border-surface-100 pb-3">
                Account Metadata
              </h3>
              <div className="space-y-1">
                <MetaItem
                  icon={<FiUserCheck />}
                  label="Account Manager"
                  value="Mark Thompson"
                />
                <MetaItem
                  icon={<FiShield />}
                  label="Security Level"
                  value="Level 3 Verified"
                />
                <MetaItem
                  icon={<FiFileText />}
                  label="Contract"
                  value="Annual Agreement"
                />
              </div>
            </div>
            <div className="surface-card p-6">
              <h3 className="heading-sm text-surface-900 mb-4 border-b border-surface-100 pb-3">
                Logistics Context
              </h3>
              <div className="space-y-1">
                <MetaItem
                  icon={<FiTruck />}
                  label="Fulfilment"
                  value="Not Applicable"
                />
                <MetaItem
                  icon={<FiClock />}
                  label="SLA Deadline"
                  value="Oct 30, 2023"
                />
                <MetaItem
                  icon={<FiAlertCircle />}
                  label="Priority"
                  value="High Response"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Timeline Sidebar ─── */}
        <div className="space-y-8">
          <motion.div
            variants={item}
            className="surface-card-subtle p-6 flex flex-col h-full border-2 border-surface-100"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="heading-md text-surface-900 flex items-center gap-2">
                <FiClock className="w-5 h-5 text-surface-500" />
                Order Audit
              </h2>
              <span className="caption text-surface-400 font-bold">
                {timeline.length} Events
              </span>
            </div>

            <div className="space-y-8 relative before:content-[''] before:absolute before:start-[1.25rem] before:top-2 before:bottom-0 before:w-[2px] before:bg-surface-200">
              {timeline.map((entry) => (
                <TimelineItem key={entry.id} entry={entry} />
              ))}
            </div>

            {/* Add Update Form */}
            <div className="mt-12 pt-8 border-t border-surface-200">
              <label className="block caption-xs uppercase font-bold text-surface-500 mb-3 tracking-widest">
                Post Internal Update
              </label>
              <div className="relative group">
                <textarea
                  className="surface-input w-full p-4 body-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-surface-300 rounded-xl bg-surface-50 border-surface-200"
                  placeholder="Note for the team..."
                  rows={3}
                  value={updateText}
                  onChange={(e) => setUpdateText(e.target.value)}
                  disabled={submitState === "submitting"}
                  maxLength={500}
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-3">
                  <span className="caption-xs text-surface-400">
                    {updateText.length}/500
                  </span>
                  <button
                    onClick={handlePostUpdate}
                    disabled={
                      !updateText.trim() || submitState === "submitting"
                    }
                    className="p-2 bg-primary text-white rounded-lg shadow-primary-sm disabled:opacity-50 hover:scale-105 transition-transform"
                  >
                    {submitState === "submitting" ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
                    ) : (
                      <FiSend className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {submitState === "submitted" && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="caption text-accent-emerald font-bold mt-2"
                  >
                    ✓ Update shared with team
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
