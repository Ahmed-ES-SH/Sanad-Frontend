"use client";

import {
  FiMoreHorizontal,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";
import { Transaction } from "./payments-types";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";

function TransactionTable() {
  const { local } = useVariables();
  const { PaymentsPage } = getTranslations(local);
  const t = PaymentsPage.TransactionTable;

  const transactions: Transaction[] = [
    {
      id: "1",
      customer: {
        name: "Johnathan Doe",
        email: "j.doe@company.com",
        initials: "JD",
        color: "bg-orange-100 text-orange-700",
      },
      amount: "$2,450.00",
      status: "success",
      date: "Oct 24, 2023",
      method: "Credit Card •••• 4242",
    },
    {
      id: "2",
      customer: {
        name: "Sarah Kinsley",
        email: "sarah.k@studio.io",
        initials: "SK",
        color: "bg-amber-100 text-amber-700",
      },
      amount: "$450.00",
      status: "pending",
      date: "Oct 24, 2023",
      method: "Bank Transfer",
    },
    {
      id: "3",
      customer: {
        name: "Brandon Miller",
        email: "b.miller@web.com",
        initials: "BM",
        color: "bg-stone-100 text-stone-600",
      },
      amount: "$1,120.90",
      status: "failed",
      date: "Oct 23, 2023",
      method: "Credit Card •••• 9811",
    },
  ];

  const getStatusStyles = (status: Transaction["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-50 text-green-700";
      case "pending":
        return "bg-amber-50 text-amber-700";
      case "failed":
        return "bg-red-50 text-red-700";
      default:
        return "bg-stone-100 text-stone-600";
    }
  };

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "success":
        return <FiCheckCircle className="text-xs" />;
      case "pending":
        return <FiClock className="text-xs" />;
      case "failed":
        return <FiAlertCircle className="text-xs" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-stone-900">
            {t.recentTransactions}
          </h3>
          <p className="text-xs text-stone-500">{t.liveFeed}</p>
        </div>
        <a
          className="text-xs font-medium text-orange-600 hover:text-orange-700"
          href="#"
        >
          {t.viewAll}
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-stone-50 text-stone-500 text-xs">
              <th className="px-5 py-3 font-medium">{t.customer}</th>
              <th className="px-5 py-3 font-medium">{t.amount}</th>
              <th className="px-5 py-3 font-medium">{t.status}</th>
              <th className="px-5 py-3 font-medium">{t.date}</th>
              <th className="px-5 py-3 font-medium">{t.method}</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-stone-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${transaction.customer.color}`}
                    >
                      {transaction.customer.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-stone-900">
                        {transaction.customer.name}
                      </p>
                      <p className="text-xs text-stone-500">
                        {transaction.customer.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 font-semibold text-stone-900">
                  {transaction.amount}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 w-fit ${getStatusStyles(
                      transaction.status,
                    )}`}
                  >
                    {getStatusIcon(transaction.status)}
                    {transaction.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs text-stone-500">
                  {transaction.date}
                </td>
                <td className="px-5 py-3 text-xs text-stone-600">
                  {transaction.method}
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="text-stone-400 hover:text-stone-600">
                    <FiMoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionTable;
