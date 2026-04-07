import { FiEdit, FiFileText } from "react-icons/fi";

export default function BillingSettings() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-6">Billing Settings</h2>
      <div className="bg-stone-100 rounded-xl p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase text-muted-foreground mb-1">
              Billing Email
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">finance@ahmed-khalil.com</span>
              <button
                className="text-sm text-orange-600 hover:text-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
                aria-label="Edit billing email"
              >
                <FiEdit />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase text-muted-foreground mb-1">
              Tax Identification
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">VAT-SA-12398471</span>
              <button
                className="text-sm text-orange-600 hover:text-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 rounded"
                aria-label="Edit tax identification number"
              >
                <FiEdit />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase text-muted-foreground mb-1">
              Invoicing Address
            </label>
            <p className="text-sm text-muted-foreground leading-snug">
              King Fahd Branch Rd, Al Rahmaniyyah, Riyadh 12341, Saudi Arabia
            </p>
          </div>
        </div>
        <div className="pt-6 border-t border-stone-200/50">
          <button className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-white text-foreground border border-stone-200/50 hover:bg-stone-50 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
            <FiFileText className="text-base" aria-hidden="true" />
            Manage Tax Info
          </button>
        </div>
      </div>
    </div>
  );
}
