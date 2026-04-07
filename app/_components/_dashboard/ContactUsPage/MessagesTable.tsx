"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { FiMail, FiTrash2, FiMoreVertical, FiEye, FiMessageCircle, FiArchive } from "react-icons/fi";

interface Message {
  id: string;
  sender: {
    name: string;
    email: string;
    initials: string;
    color: string;
  };
  subject: string;
  categoryKey: string;
  categoryColor: string;
  received: string;
  statusKey: string;
  statusColor: string;
}

const messages: Message[] = [
  {
    id: "1",
    sender: {
      name: "Amir Khan",
      email: "amir.k@techcorp.com",
      initials: "AK",
      color: "bg-orange-100 text-orange-700",
    },
    subject: "Inquiry regarding service integration timeline",
    categoryKey: "technical",
    categoryColor: "bg-blue-100 text-blue-700",
    received: "12 mins ago",
    statusKey: "unread",
    statusColor: "bg-orange-100 text-orange-700",
  },
  {
    id: "2",
    sender: {
      name: "Sarah Miller",
      email: "s.miller@finance.io",
      initials: "SM",
      color: "bg-green-100 text-green-700",
    },
    subject: "Billing discrepancy on invoice #29384",
    categoryKey: "billing",
    categoryColor: "bg-stone-100 text-stone-700",
    received: "2 hours ago",
    statusKey: "replied",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: "3",
    sender: {
      name: "John Doe",
      email: "j.doe@creatives.net",
      initials: "JD",
      color: "bg-purple-100 text-purple-700",
    },
    subject: "New partnership opportunity in EMEA region",
    categoryKey: "partner",
    categoryColor: "bg-amber-100 text-amber-700",
    received: "Yesterday, 4:15 PM",
    statusKey: "urgent",
    statusColor: "bg-red-100 text-red-700",
  },
  {
    id: "4",
    sender: {
      name: "Emma Watson",
      email: "emma@style.com",
      initials: "EW",
      color: "bg-blue-100 text-blue-700",
    },
    subject: "Feedback on the new UI dashboard layout",
    categoryKey: "general",
    categoryColor: "bg-stone-100 text-stone-700",
    received: "May 12, 2024",
    statusKey: "archived",
    statusColor: "bg-stone-200 text-stone-700",
  },
];

export function MessagesTable() {
  const { local } = useVariables();
  const { ContactUsPage } = getTranslations(local);
  const t = ContactUsPage.MessagesTable;

  return (
    <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200/50">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-100/50">
              <th className="px-6 py-4 text-[11px] uppercase font-bold tracking-widest text-stone-500/60">
                {t.sender}
              </th>
              <th className="px-6 py-4 text-[11px] uppercase font-bold tracking-widest text-stone-500/60">
                {t.subject}
              </th>
              <th className="px-6 py-4 text-[11px] uppercase font-bold tracking-widest text-stone-500/60">
                {t.category}
              </th>
              <th className="px-6 py-4 text-[11px] uppercase font-bold tracking-widest text-stone-500/60">
                {t.received}
              </th>
              <th className="px-6 py-4 text-[11px] uppercase font-bold tracking-widest text-stone-500/60">
                {t.status}
              </th>
              <th className="px-6 py-4 text-[11px] uppercase font-bold tracking-widest text-stone-500/60 text-right">
                {t.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {messages.map((message) => (
              <tr
                key={message.id}
                className="hover:bg-stone-50/40 transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${message.sender.color}`}
                    >
                      {message.sender.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-900">
                        {message.sender.name}
                      </p>
                      <p className="text-[10px] text-stone-500">
                        {message.sender.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm font-medium text-stone-900 truncate max-w-xs">
                    {message.subject}
                  </p>
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${message.categoryColor}`}
                  >
                    {t[message.categoryKey as keyof typeof t]}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <p className="text-xs text-stone-500 font-medium">
                    {message.received}
                  </p>
                </td>
                <td className="px-6 py-5">
                  <div
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-lg w-fit ${
                      message.statusKey === "unread"
                        ? "bg-orange-100"
                        : message.statusKey === "replied"
                        ? "bg-green-100"
                        : message.statusKey === "urgent"
                        ? "bg-red-100"
                        : "bg-stone-200"
                    }`}
                  >
                    {message.statusKey === "unread" && (
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
                    )}
                    <span className="text-[10px] font-bold uppercase tracking-tight text-stone-700">
                      {t[message.statusKey as keyof typeof t]}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-white rounded-lg text-stone-500 hover:text-stone-700 transition-colors">
                      <FiMessageCircle size={18} />
                    </button>
                    <button className="p-1.5 hover:bg-white rounded-lg text-stone-500 hover:text-stone-700 transition-colors">
                      <FiEye size={18} />
                    </button>
                    <button className="p-1.5 hover:bg-white rounded-lg text-stone-500 hover:text-stone-700 transition-colors">
                      <FiArchive size={18} />
                    </button>
                    <button className="p-1.5 hover:bg-white rounded-lg text-stone-500 hover:text-red-600 transition-colors">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-stone-50/30 flex justify-between items-center">
        <p className="text-xs text-stone-500 font-medium">
          {t.showingText}
        </p>
        <div className="flex gap-2">
          <button
            className="p-1 px-3 bg-white border border-stone-200/30 rounded-lg text-xs font-bold text-stone-500 hover:bg-stone-100 transition-colors disabled:opacity-50"
            disabled
          >
            {t.previous}
          </button>
          <button className="p-1 px-3 bg-orange-500 text-white rounded-lg text-xs font-bold hover:shadow-md transition-all">
            {t.next}
          </button>
        </div>
      </div>
    </section>
  );
}
