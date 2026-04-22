import type { Metadata } from "next";

import { getTranslations } from "@/app/helpers/helpers";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { fetchOrderById } from "@/app/helpers/_orderTracking/fetchOrderById.helper";
import {
  formatOrder,
  getStatusSteps,
  createFallbackOrder,
} from "@/app/helpers/_orderTracking/formatOrder.helper";

import StatusStep from "@/app/_components/_orderTracking/StatusStep";
import OrderTrackingTable from "@/app/_components/_orderTracking/OrderTrackingTable";
import OrderTrackingTimeline from "@/app/_components/_orderTracking/OrderTrackingTimeline";

import type { DisplayOrder } from "@/app/_components/_orderTracking/OrderTrackingTable.types";
import type { StatusStep as StatusStepType } from "@/app/_components/_orderTracking/StatusStep.types";
import LocaleLink from "@/app/_components/_global/LocaleLink";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ local: string; orderId: string }>;
}): Promise<Metadata> {
  const { local } = await params;
  const translations = getTranslations(local ?? "en");
  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  return {
    title: translations.orderTrackingMeta.title,
    description: translations.orderTrackingMeta.description,
    ...sharedMetadata,
  };
}

interface OrderTrackingPageProps {
  params: Promise<{ local: string; orderId: string }>;
}

const OrderTrackingPage = async ({ params }: OrderTrackingPageProps) => {
  const { local, orderId } = await params;
  const translated = getTranslations(local ?? "en");
  const t = translated.orderTracking;
  const statusTranslations = t.status;
  const isRtl = local === "ar";

  let orderData: DisplayOrder;
  let statusSteps: StatusStepType[];
  let progressWidth: string;

  try {
    const rawOrder = await fetchOrderById(orderId);
    const formatted = formatOrder(rawOrder, local ?? "en");
    const { steps, progressWidth: pw } = getStatusSteps(formatted.status);

    orderData = formatted;
    statusSteps = steps;
    progressWidth = pw;
  } catch (error) {
    // Use fallback data when API fails
    orderData = createFallbackOrder(orderId);
    const { steps, progressWidth: pw } = getStatusSteps(orderData.status);
    statusSteps = steps;
    progressWidth = pw;
  }

  // Map status labels using translations
  const statusLabelMap: Record<string, string> = {
    pending: statusTranslations.pending,
    paid: statusTranslations.paid,
    in_progress: statusTranslations.inProgress,
    completed: statusTranslations.completed,
    cancelled: statusTranslations.cancelled,
  };

  const displayOrder: DisplayOrder = {
    ...orderData,
    statusLabel: statusLabelMap[orderData.status] || orderData.statusLabel,
  };

  const backLink = isRtl
    ? "/ar/userdashboard/orders"
    : "/en/userdashboard/orders";

  return (
    <main className="min-h-screen mt-16 pb-12 page-bg">
      <div className="c-container pt-8">
        {/* Header Section */}
        <div className="mb-8">
          {/* Back Navigation */}
          <a
            href={backLink}
            className="inline-flex items-center gap-2 text-surface-600 hover:text-primary transition-colors mb-5 group body"
            aria-label={t.backToOrders}
          >
            <svg
              className={`w-4 h-4 transition-transform group-hover:${isRtl ? "translate-x-1" : "-translate-x-1"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isRtl ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
              />
            </svg>
            <span className="font-medium">{t.backToOrders}</span>
          </a>

          <h1 className="display-sm font-display text-surface-900 mb-1.5">
            {t.pageTitle}
          </h1>
          <p className="body text-surface-600">{t.pageSubtitle}</p>
        </div>

        {/* Horizontal Progress Tracker */}
        <div
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
            <div
              className="absolute top-6 left-0 h-0.5 bg-primary -translate-y-1/2 hidden sm:block"
              style={{ width: progressWidth }}
              aria-hidden="true"
            />
            {/* Status Steps */}
            <div className="relative flex w-full justify-between">
              {statusSteps.map((step, index) => (
                <StatusStep
                  key={step.key}
                  step={{
                    ...step,
                    label: statusLabelMap[step.key] || step.label,
                  }}
                  index={index}
                  isRtl={isRtl}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Details Card */}
            <section
              className="bg-surface-card-bg rounded-2xl overflow-hidden shadow-surface-sm border border-gray-200"
              aria-label={t.orderDetails}
            >
              <div className="bg-surface-50/80 px-6 sm:px-8 py-4 flex justify-between items-center border-b border-gray-200">
                <h2 className="caption text-primary font-bold uppercase tracking-wider">
                  {t.orderDetails}
                </h2>
                <span className="bg-primary-100 text-primary px-3 py-1 rounded-full text-xs font-bold">
                  {displayOrder.statusLabel}
                </span>
              </div>
              <OrderTrackingTable order={displayOrder} />
            </section>

            {/* Status Updates Timeline */}
            <section
              className="bg-surface-card-bg rounded-2xl shadow-surface-sm border border-gray-200 overflow-hidden"
              aria-label={t.activityLog}
            >
              <div className="bg-surface-50/80 px-6 sm:px-8 py-4 border-b border-gray-200">
                <h2 className="caption text-primary font-bold uppercase tracking-wider">
                  {t.activityLog}
                </h2>
              </div>
              <div className="p-6 sm:p-8">
                <OrderTrackingTimeline entries={displayOrder.updates} />
              </div>
            </section>
          </div>

          {/* Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Need Help Card */}
            <section
              className="bg-surface-card-bg rounded-2xl p-6 sm:p-8 shadow-surface-sm border border-gray-200"
              aria-label={t.needAssistance}
            >
              <div className="flex gap-5">
                <div
                  className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary shrink-0"
                  aria-hidden="true"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="heading-md font-display text-surface-900 mb-2">
                    {t.needAssistance}
                  </h3>
                  <p className="body-sm text-surface-600 mb-5 leading-relaxed">
                    {t.supportDescription}
                  </p>
                  <LocaleLink
                    href={`/contact`}
                    className="surface-btn-primary w-full"
                    aria-label={t.contactSupport}
                  >
                    {t.contactSupport}
                  </LocaleLink>
                </div>
              </div>
            </section>

            {/* Actions Card */}
            <section
              className="bg-surface-card-bg rounded-2xl p-6 sm:p-8 border border-gray-200"
              aria-label={t.quickActions}
            >
              <h3 className="caption text-surface-500 font-bold uppercase tracking-wider mb-5">
                {t.quickActions}
              </h3>
              <div className="space-y-3">
                <button
                  className="w-full flex items-center justify-between p-4 bg-surface-50 rounded-xl border border-gray-200 hover:border-primary/30 hover:bg-primary-50 transition-all duration-200 group"
                  aria-label={t.downloadInvoice}
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-4 h-4 text-primary shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span className="body font-medium text-surface-900">
                      {t.downloadInvoice}
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-surface-400 group-hover:text-primary transition-all duration-200 shrink-0 ${
                      isRtl
                        ? "rotate-180 group-hover:-translate-x-0.5"
                        : "group-hover:translate-x-0.5"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button
                  className="w-full flex items-center justify-between p-4 bg-surface-50 rounded-xl border border-gray-200 hover:border-primary/30 hover:bg-primary-50 transition-all duration-200 group"
                  aria-label={t.serviceAgreement}
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-4 h-4 text-primary shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="body font-medium text-surface-900">
                      {t.serviceAgreement}
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-surface-400 group-hover:text-primary transition-all duration-200 shrink-0 ${
                      isRtl
                        ? "rotate-180 group-hover:-translate-x-0.5"
                        : "group-hover:translate-x-0.5"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </section>

            {/* Status Context Card */}
            <div
              className="bg-primary-50 rounded-2xl p-6 sm:p-8 border border-primary-100 relative overflow-hidden"
              role="complementary"
              aria-label={t.whatsNext}
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
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="body-sm font-bold text-primary mb-1.5 uppercase tracking-wider">
                    {t.whatsNext}
                  </h4>
                  <p className="body-sm text-surface-600 leading-relaxed">
                    {displayOrder.updates.length > 0
                      ? displayOrder.updates[displayOrder.updates.length - 1]
                          .description
                      : isRtl
                        ? "سيتم تحديثك فور بدء معالجة طلبك."
                        : "You will be updated once we start processing your order."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderTrackingPage;
