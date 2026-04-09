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
          entry.isSystem ? "" : "overflow-hidden"
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
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="caption text-surface-900">{entry.author}</span>
          <span className="caption-xs text-surface-400">
            {entry.timestamp}
          </span>
        </div>
        <p
          className={`body-sm p-3 rounded-lg shadow-surface-sm ${
            entry.isSystem
              ? "text-surface-600 bg-surface-100/50"
              : "text-surface-600 bg-surface-card-bg border-s-4 border-primary"
          }`}
        >
          {entry.content}
        </p>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="surface-card flex items-center gap-3">
      <div className="p-2 rounded-lg">{icon}</div>
      <div>
        <p className="caption text-surface-400">{label}</p>
        <p className="heading-sm text-surface-900">{value}</p>
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
  const [submissionError, setSubmissionError] = useState<SubmissionError | null>(null);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);

  // Simulate fetch (replace with actual API call)
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // In production: const resolved = await params; const res = await fetch(`/api/orders/${resolved.orderId}`);
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
      // In production: POST update to API
      await new Promise((r) => setTimeout(r, 600)); // Simulated delay
      setSubmitState("submitted");
      setUpdateText("");

      // Reset submitted state after 3s
      setTimeout(() => setSubmitState("idle"), 3000);
    } catch {
      setSubmitState("error");
      setSubmissionError({ message: "Failed to post update. Please try again." });
    }
  };

  const dismissError = () => {
    setSubmissionError(null);
    setSubmitState("idle");
  };

  const statusConfig = order
    ? statusBadgeConfig[order.status] || statusBadgeConfig.processing
    : statusBadgeConfig.processing;

  // ─── Loading Skeleton ───────────────────────────────────────────

  if (fetchState === "loading") {
    return (
      <div className="page-bg min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <div className="w-28 h-4 bg-surface-200 rounded animate-pulse mb-2" />
            <div className="w-40 h-9 bg-surface-200 rounded animate-pulse mb-2" />
            <div className="w-56 h-5 bg-surface-100 rounded animate-pulse" />
          </div>
          <div className="flex gap-3">
            <div className="w-28 h-8 bg-surface-200 rounded-full animate-pulse" />
            <div className="w-36 h-10 bg-surface-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="surface-card p-6 space-y-6">
              <div className="w-44 h-7 bg-surface-200 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="w-20 h-3 bg-surface-100 rounded animate-pulse" />
                    <div className="w-32 h-5 bg-surface-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
            <div className="surface-card p-5 h-28 bg-surface-100 rounded animate-pulse" />
          </div>
          <div className="surface-card-subtle p-5 h-80 bg-surface-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────────────────────

  if (fetchState === "error") {
    return (
      <div className="page-bg min-h-screen flex items-center justify-center">
        <div className="surface-card p-8 max-w-md text-center">
          <FiAlertCircle className="w-12 h-12 text-accent-rose mx-auto mb-4" />
          <h2 className="heading-lg text-surface-900 mb-2">Unable to Load Order</h2>
          <p className="body text-surface-600 mb-6">
            We couldn&apos;t retrieve the order details. This could be due to a network issue or the order may have been removed.
          </p>
          <button
            onClick={() => {
              setFetchState("loading");
              window.location.reload();
            }}
            className="surface-btn-primary mx-auto"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  // ─── Main Render ────────────────────────────────────────────────

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="page-bg min-h-screen"
    >
      {/* Order Header */}
      <motion.div
        variants={item}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8"
      >
        <div>
          <span className="caption text-surface-500 uppercase">
            Order Overview
          </span>
          <h1 className="display-sm text-surface-900 font-display mt-1">
            {order.id}
          </h1>
          <p className="body text-surface-500 mt-1">
            Placed on {order.placedDate}
          </p>
        </div>
        <div className="flex gap-3">
          <StatusBadge status={order.status} />
          <button className="surface-btn-secondary px-4 py-2 flex items-center gap-2">
            <FiPrinter className="w-4 h-4" />
            Print Invoice
          </button>
        </div>
      </motion.div>

      {/* Order Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Information Card */}
          <motion.div
            variants={item}
            className="surface-card p-6"
          >
            <h2 className="heading-lg text-surface-900 flex items-center gap-3">
              <FiInfo className="w-5 h-5 text-primary" />
              Service Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mt-6">
              {/* User Section */}
              <div className="flex items-start gap-4">
                <img
                  alt={order.user.name}
                  src={order.user.avatar}
                  className="w-12 h-12 rounded-lg object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="caption text-surface-400 uppercase">
                    Customer
                  </p>
                  <p className="heading-sm text-surface-900">{order.user.name}</p>
                  <p className="body-sm text-surface-500">{order.user.email}</p>
                </div>
              </div>

              {/* Service Section */}
              <div>
                <p className="caption text-surface-400 uppercase">
                  Service Name
                </p>
                <p className="heading-sm text-surface-900">{order.serviceName}</p>
                <p className="body-sm text-primary">
                  {order.subscriptionType}
                </p>
              </div>

              {/* Payment Section */}
              <div>
                <p className="caption text-surface-400 uppercase">
                  Payment ID
                </p>
                <p className="body-sm font-mono text-surface-900">
                  {order.paymentId}
                </p>
              </div>

              {/* Amount Section */}
              <div>
                <p className="caption text-surface-400 uppercase">
                  Total Amount
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="heading-lg text-surface-900">
                    {order.totalAmount}
                  </span>
                  <span className="caption text-surface-500">
                    {order.currency}
                  </span>
                </div>
              </div>

              {/* Timestamps */}
              <div>
                <p className="caption text-surface-400 uppercase">
                  Timestamps
                </p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 body-sm">
                    <span className="text-surface-400">Created:</span>
                    <span className="text-surface-700">
                      {order.createdAt}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 body-sm">
                    <span className="text-surface-400">Updated:</span>
                    <span className="text-surface-700">
                      {order.updatedAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <p className="caption text-surface-400 uppercase">
                  Internal Notes
                </p>
                <p className="body-sm text-surface-600 leading-relaxed mt-1 italic">
                  &quot;{order.internalNotes}&quot;
                </p>
              </div>
            </div>
          </motion.div>

          {/* Status Progress Card */}
          <motion.div
            variants={item}
            className="bg-gradient-surface surface-card p-5"
          >
            <h3 className="heading-md text-surface-900 mb-2">
              Priority Processing Active
            </h3>
            <p className="body text-surface-600">
              This order is flagged for priority support. All updates are monitored by the regional management team.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="caption text-primary font-semibold">
                Currently in progress
              </span>
            </div>
          </motion.div>
        </div>

        {/* Timeline Column (1/3) */}
        <div className="space-y-6">
          <motion.div
            variants={item}
            className="surface-card-subtle p-5 flex flex-col h-full"
          >
            <h2 className="heading-md text-surface-900 mb-5 flex items-center gap-2">
              <FiClock className="w-5 h-5 text-surface-500" />
              Order Updates
            </h2>

            {/* Empty State */}
            {timeline.length === 0 ? (
              <div className="text-center py-10">
                <FiClock className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                <p className="body text-surface-500">
                  No updates yet — this order was just placed.
                </p>
              </div>
            ) : (
              <div className="space-y-6 relative before:content-[''] before:absolute before:start-[1.25rem] before:top-2 before:bottom-0 before:w-[2px] before:bg-surface-200">
                {timeline.map((entry) => (
                  <TimelineItem key={entry.id} entry={entry} />
                ))}
              </div>
            )}

            {/* Submission Feedback */}
            <AnimatePresence>
              {submitState === "submitted" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-4 p-3 rounded-lg bg-accent-emerald/10 border border-accent-emerald/20 flex items-center gap-2"
                >
                  <FiCheckCircle className="w-4 h-4 text-accent-emerald shrink-0" />
                  <span className="body-sm text-accent-emerald font-medium">
                    Update posted successfully.
                  </span>
                </motion.div>
              )}
              {submitState === "error" && submissionError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-4 p-3 rounded-lg bg-accent-rose/10 border border-accent-rose/20 flex items-center gap-2"
                >
                  <FiAlertCircle className="w-4 h-4 text-accent-rose shrink-0" />
                  <span className="body-sm text-accent-rose font-medium">
                    {submissionError.message}
                  </span>
                  <button
                    onClick={dismissError}
                    className="ms-auto text-surface-400 hover:text-surface-600 transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add Update Form */}
            <div className="mt-10 pt-5 border-t border-surface-200">
              <label className="block caption uppercase font-semibold text-surface-500 mb-2">
                New Update
              </label>
              <textarea
                className="surface-input w-full p-3 body-sm focus:ring-2 focus:ring-primary resize-none placeholder:text-surface-400 disabled:opacity-60"
                placeholder="Type an internal note or status update..."
                rows={3}
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                disabled={submitState === "submitting"}
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="caption text-surface-400">
                  {updateText.length}/500
                </span>
                <button
                  onClick={handlePostUpdate}
                  disabled={!updateText.trim() || submitState === "submitting"}
                  className="surface-btn-primary py-2.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group min-w-[140px]"
                >
                  {submitState === "submitting" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      Post Update
                      <FiSend className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Secondary Info Cards */}
      <motion.div
        variants={item}
        className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <InfoCard
          icon={
            <div className="bg-primary-50 text-primary">
              <FiTruck className="w-5 h-5" />
            </div>
          }
          label="Shipping"
          value="Not Applicable"
        />
        <InfoCard
          icon={
            <div className="bg-accent-emerald/15 text-accent-emerald">
              <FiShield className="w-5 h-5" />
            </div>
          }
          label="Verification"
          value="Identity Confirmed"
        />
        <InfoCard
          icon={
            <div className="bg-primary-50 text-primary">
              <FiUserCheck className="w-5 h-5" />
            </div>
          }
          label="Assigned"
          value="Mark Thompson"
        />
        <InfoCard
          icon={
            <div className="bg-accent-amber/15 text-accent-amber">
              <FiFileText className="w-5 h-5" />
            </div>
          }
          label="Contract"
          value="Annual Agreement"
        />
      </motion.div>
    </motion.div>
  );
}
