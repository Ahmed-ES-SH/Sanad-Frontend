"use client";

import React from "react";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import TopNavBar from "@/app/_components/_dashboard/DashboardPage/TopNavBar";
import { motion } from "framer-motion";
import { 
  FiMoreVertical, 
  FiArrowUpRight, 
  FiArrowDownLeft, 
  FiDownload, 
  FiFilter, 
  FiPieChart, 
  FiCreditCard, 
  FiDollarSign, 
  FiTrendingUp 
} from "react-icons/fi";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function PaymentsPage() {
  const { local } = useVariables();
  const { PaymentsPage: t } = getTranslations(local);

  const stats = [
    { 
      label: t.PaymentStats.totalRevenue, 
      value: "$142,500.00", 
      change: "+12.5%", 
      isUp: true, 
      icon: <FiDollarSign className="w-5 h-5" />,
      color: "bg-orange-50 text-orange-600"
    },
    { 
      label: t.PaymentStats.activeSubscriptions, 
      value: "1,204", 
      change: "+4.2%", 
      isUp: true, 
      icon: <FiCreditCard className="w-5 h-5" />,
      color: "bg-blue-50 text-blue-600"
    },
    { 
      label: t.PaymentStats.netVolume, 
      value: "$98,420.00", 
      change: "-0.8%", 
      isUp: false, 
      icon: <FiTrendingUp className="w-5 h-5" />,
      color: "bg-stone-100 text-stone-600"
    },
    { 
      label: t.PaymentStats.avgTicketSize, 
      value: "$850.00", 
      change: "+2.1%", 
      isUp: true, 
      icon: <FiPieChart className="w-5 h-5" />,
      color: "bg-amber-50 text-amber-600"
    },
  ];

  const transactions = [
    { id: "#INV-9012", customer: "Skyline Tech", amount: "$12,400.00", status: "success", date: "24 Mar 2024", method: "Bank Transfer" },
    { id: "#INV-9011", customer: "Al-Falah Group", amount: "$8,250.00", status: "pending", date: "22 Mar 2024", method: "Credit Card" },
    { id: "#INV-9010", customer: "Riyadh Digital", amount: "$3,100.00", status: "failed", date: "21 Mar 2024", method: "Credit Card" },
    { id: "#INV-9009", customer: "Oasis Solutions", amount: "$15,000.00", status: "success", date: "19 Mar 2024", method: "Bank Transfer" },
    { id: "#INV-9008", customer: "Khalid Bin Waleed", amount: "$4,500.00", status: "success", date: "18 Mar 2024", method: "Crypto" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50">
      <TopNavBar />
      
      <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 font-display">
              {t.PaymentsHeader.title}
            </h1>
            <p className="text-stone-500 mt-1">
              {t.PaymentsHeader.subtitle}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-stone-700 hover:bg-stone-50 transition-colors shadow-sm text-sm font-medium">
              <FiFilter className="w-4 h-4" />
              {t.PaymentFilters.statusAll}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors shadow-md shadow-orange-200 text-sm font-medium">
              <FiDollarSign className="w-4 h-4" />
              {t.PaymentActions.sendInvoice}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              variants={item}
              className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                  stat.isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                }`}>
                  {stat.isUp ? <FiArrowUpRight className="mr-1" /> : <FiArrowDownLeft className="mr-1" />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-bold text-stone-900 mt-1">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Chart and Activity Section (Placeholders for visual balance) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-bold text-stone-900">{t.PaymentCharts.revenueVsTime}</h3>
                <p className="text-xs text-stone-500 mt-1">{t.PaymentCharts.monthlyRevenueTrend}</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                  {t.PaymentCharts.revenue}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-200"></div>
                  {t.PaymentCharts.forecast}
                </div>
              </div>
            </div>
            
            {/* Simple mockup for chart area */}
            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {[40, 70, 45, 90, 65, 80, 55, 95, 75, 40, 85, 60].map((h, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full relative h-full flex items-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: idx * 0.05, duration: 1 }}
                      className="w-full bg-orange-100/50 group-hover:bg-orange-500/20 rounded-t-lg absolute bottom-0 z-0"
                    />
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${h * 0.7}%` }}
                      transition={{ delay: idx * 0.05 + 0.5, duration: 1 }}
                      className="w-full bg-orange-500 rounded-t-lg z-10 transition-all duration-300 group-hover:scale-y-105"
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 font-medium">{['J','F','M','A','M','J','J','A','S','O','N','D'][idx]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <h3 className="font-bold text-stone-900 mb-6">{t.PayoutSchedule.title}</h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <p className="text-xs font-semibold text-orange-600 uppercase mb-1">{t.PayoutSchedule.nextDeposit}</p>
                <div className="flex items-end justify-between">
                  <h4 className="text-2xl font-bold text-orange-900">$4,250.00</h4>
                  <span className="text-xs text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full font-medium">Monday</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-500">{t.PayoutSchedule.amountToTransfer}</span>
                  <span className="font-semibold text-stone-900">$3,420.00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-500">{t.PayoutSchedule.verificationProgress}</span>
                  <span className="font-semibold text-emerald-600">100%</span>
                </div>
                <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full" />
                </div>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed italic">
                {t.PayoutSchedule.payoutInfo}
              </p>

              <button className="w-full py-3 text-sm font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors border border-stone-200">
                {t.PayoutSchedule.viewPayoutHistory}
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table Section */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900">{t.TransactionTable.recentTransactions}</h3>
              <p className="text-xs text-stone-500 mt-1">{t.TransactionTable.liveFeed}</p>
            </div>
            <button className="text-xs font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wider px-3 py-1 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              {t.TransactionTable.viewAll}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right">
              <thead className="bg-stone-50/50 text-stone-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">{t.Table.invoiceId}</th>
                  <th className="px-6 py-4">{t.TransactionTable.customer}</th>
                  <th className="px-6 py-4">{t.Table.status}</th>
                  <th className="px-6 py-4">{t.TransactionTable.method}</th>
                  <th className="px-6 py-4">{t.Table.amount}</th>
                  <th className="px-6 py-4 text-center">{t.Table.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {transactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-stone-900">{tx.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-500">
                          {tx.customer.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <span className="text-stone-700 font-medium">{tx.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === 'success' ? 'bg-emerald-50 text-emerald-700' :
                        tx.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          tx.status === 'success' ? 'bg-emerald-500' :
                          tx.status === 'pending' ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`} />
                        {tx.status === 'success' ? t.TransactionTable.success : 
                         tx.status === 'pending' ? t.TransactionTable.pending : 
                         t.TransactionTable.failed}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-500">{tx.method}</td>
                    <td className="px-6 py-4 text-stone-900 font-bold">{tx.amount}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors">
                          <FiDownload className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors">
                          <FiMoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
