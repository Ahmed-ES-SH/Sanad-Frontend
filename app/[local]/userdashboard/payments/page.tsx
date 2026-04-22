import PaymentsHeader from "@/app/_components/_userdashboard/_payments/PaymentsHeader";
import KPICards from "@/app/_components/_userdashboard/_payments/KPICards";
import PaymentMethods from "@/app/_components/_userdashboard/_payments/PaymentMethods";
import BillingSettings from "@/app/_components/_userdashboard/_payments/BillingSettings";
import TransactionHistory from "@/app/_components/_userdashboard/_payments/TransactionHistory";

export default function UserPaymentsPage() {
  return (
    <main className="mt-24 mb-12 c-container px-6 md:px-8 min-h-screen">
      <PaymentsHeader />
      <KPICards />

      {/* Two Column Layout: Payment Methods & Billing Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Payment Methods Column */}
        <div className="lg:col-span-2">
          <PaymentMethods />
        </div>
        {/* Billing Settings Sidebar */}
        <div className="lg:col-span-1">
          <BillingSettings />
        </div>
      </div>

      {/* Transaction History Section */}
      <TransactionHistory />
    </main>
  );
}
