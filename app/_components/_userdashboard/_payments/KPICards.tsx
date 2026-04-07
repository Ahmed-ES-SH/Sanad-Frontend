import { FiTrendingUp, FiDollarSign, FiCalendar, FiCheckCircle } from "react-icons/fi";

interface KPICardProps {
  icon: React.ReactNode;
  iconLabel: string;
  iconBg: string;
  iconColor: string;
  badgeText: string;
  badgeVariant: "success" | "warning" | "neutral";
  label: string;
  value: string;
  currency?: string;
  footer?: React.ReactNode;
}

function KPICard({
  icon,
  iconLabel,
  iconBg,
  iconColor,
  badgeText,
  badgeVariant,
  label,
  value,
  currency,
  footer,
}: KPICardProps) {
  const badgeClasses = {
    success: "text-green-600 bg-green-50",
    warning: "text-amber-600 bg-amber-50",
    neutral: "text-green-600 bg-green-50",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200/50 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div
          className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}
          aria-label={iconLabel}
          role="img"
        >
          {icon}
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${badgeClasses[badgeVariant]}`}>
          {badgeVariant === "success" && <FiTrendingUp className="text-[12px]" />}
          {badgeText}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-3xl font-black text-foreground mt-1">
          {value}
          {currency && <span className="text-lg font-semibold text-muted-foreground"> {currency}</span>}
        </p>
      </div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}

export default function KPICards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {/* Total Spent Card */}
      <KPICard
        icon={<FiDollarSign className="text-xl" />}
        iconLabel="Total Spent"
        iconBg="bg-orange-50"
        iconColor="text-orange-600"
        badgeText="+12% vs last month"
        badgeVariant="success"
        label="Total Spent"
        value="45,200"
        currency="SAR"
        footer={
          <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 w-3/4 rounded-full" />
          </div>
        }
      />

      {/* Next Billing Card */}
      <KPICard
        icon={<FiCalendar className="text-xl" />}
        iconLabel="Next Billing Date"
        iconBg="bg-amber-50"
        iconColor="text-amber-600"
        badgeText="7 Days Left"
        badgeVariant="warning"
        label="Next Billing Date"
        value="Nov 12, 2024"
        footer={
          <p className="text-xs text-muted-foreground mt-4">
            Automatic payment from •••• 4242
          </p>
        }
      />

      {/* Pending Amount Card */}
      <KPICard
        icon={<FiCheckCircle className="text-xl" />}
        iconLabel="Pending Amount — All Settled"
        iconBg="bg-green-50"
        iconColor="text-green-600"
        badgeText="All Settled"
        badgeVariant="neutral"
        label="Pending Amount"
        value="0.00"
        currency="SAR"
      />
    </div>
  );
}
