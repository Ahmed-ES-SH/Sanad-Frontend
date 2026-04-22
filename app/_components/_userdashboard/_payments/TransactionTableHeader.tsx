"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";

const TransactionTableHeader: React.FC = () => {
  const { local } = useVariables();
  const { payments } = getTranslations(local ?? "en");

  return (
    <thead>
      <tr className="bg-stone-100">
        <th className="px-4 py-4 sm:px-6 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider whitespace-nowrap">
          {payments.columnDate}
        </th>
        <th className="px-4 py-4 sm:px-6 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider whitespace-nowrap">
          {payments.columnDescription}
        </th>
        <th className="px-4 py-4 sm:px-6 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider whitespace-nowrap">
          {payments.columnAmount}
        </th>
        <th className="px-4 py-4 sm:px-6 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider whitespace-nowrap">
          {payments.columnStatus}
        </th>
        <th className="px-4 py-4 sm:px-6 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider text-right whitespace-nowrap">
          {payments.columnAction}
        </th>
      </tr>
    </thead>
  );
};

export default TransactionTableHeader;