import { FiDownload } from "react-icons/fi";

export default function PaymentsHeader() {
  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
      <div>
        <nav className="flex text-xs font-medium text-muted-foreground mb-2 gap-2 uppercase tracking-wide" aria-label="Breadcrumb">
          <span>Account</span>
          <span className="text-sm" aria-hidden="true">›</span>
          <span className="text-orange-600 font-semibold">Payments & Billing</span>
        </nav>
        <h1 className="text-4xl font-black text-foreground tracking-tight">
          Payments & Billing
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your subscriptions, view invoices and update payment methods.
        </p>
      </div>
      <button
        className="bg-gradient-to-br from-orange-500 to-amber-500 text-white px-6 py-3 rounded-full flex items-center gap-2 font-semibold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        aria-label="Download all invoices as PDF"
      >
        <FiDownload className="w-4 h-4" aria-hidden="true" />
        Download All Invoices
      </button>
    </section>
  );
}
