"use client";

import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import {
  FiTrash2,
  FiEye,
  FiMessageCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { ContactMessage, PaginationMeta } from "@/app/types/contact";

export function MessagesTable({
  messages,
  meta,
  page,
  onPageChange,
  onAction,
  isLoading,
}: {
  messages: ContactMessage[];
  meta: PaginationMeta;
  page: number;
  onPageChange: (page: number) => void;
  onAction: (id: string, action: "read" | "reply" | "delete") => void;
  isLoading?: boolean;
}) {
  const { local } = useVariables();
  const { ContactUsPage } = getTranslations(local);
  const t = ContactUsPage.MessagesTable;

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getColorClass = (name: string) => {
    const colors = [
      "bg-orange-100 text-orange-700 border-orange-200",
      "bg-amber-100 text-amber-700 border-amber-200",
      "bg-stone-100 text-stone-700 border-stone-200",
      "bg-blue-100 text-blue-700 border-blue-200",
      "bg-emerald-100 text-emerald-700 border-emerald-200",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(local === "ar" ? "ar-SA" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <section className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200/50 transition-opacity ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50/50 border-b border-stone-100">
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-stone-400">
                {t.sender}
              </th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-stone-400">
                {t.subject}
              </th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-stone-400">
                {t.received}
              </th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-stone-400">
                {t.status}
              </th>
              <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-stone-400 text-right">
                {t.actions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-stone-400 text-sm">
                  {local === "ar" ? "لا توجد رسائل للعرض" : "No messages to display"}
                </td>
              </tr>
            ) : (
              messages.map((message) => {
                const initials = getInitials(message.fullName);
                const colorClass = getColorClass(message.fullName);
                const isReplied = !!message.repliedAt;
                const isUnread = !message.isRead;

                return (
                  <tr
                    key={message.id}
                    className="hover:bg-stone-50/40 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border ${colorClass}`}
                        >
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-stone-900 leading-none mb-1">
                            {message.fullName}
                          </p>
                          <p className="text-[11px] text-stone-500 font-medium">
                            {message.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="max-w-xs">
                        <p className="text-sm font-semibold text-stone-800 truncate">
                          {message.subject}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {message.message}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-xs text-stone-500 font-semibold">
                        {formatDate(message.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit ${
                          isUnread
                            ? "bg-orange-100 text-orange-700"
                            : isReplied
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {isUnread && (
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                          {isUnread ? t.unread : isReplied ? t.replied : t.archived}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onAction(message.id, "reply")}
                          className="p-2 hover:bg-white rounded-xl text-stone-400 hover:text-emerald-600 border border-transparent hover:border-emerald-100 hover:shadow-sm transition-all"
                          title={t.replied}
                        >
                          <FiMessageCircle size={16} />
                        </button>
                        <button
                          onClick={() => onAction(message.id, "read")}
                          className={`p-2 hover:bg-white rounded-xl border border-transparent hover:shadow-sm transition-all ${
                            isUnread
                              ? "text-orange-500 hover:text-orange-600 hover:border-orange-100"
                              : "text-stone-400 hover:text-stone-900 hover:border-stone-200"
                          }`}
                          title={t.unread}
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          onClick={() => onAction(message.id, "delete")}
                          className="p-2 hover:bg-white rounded-xl text-stone-400 hover:text-red-600 border border-transparent hover:border-red-100 hover:shadow-sm transition-all"
                          title={local === "ar" ? "حذف" : "Delete"}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-stone-50/30 flex justify-between items-center border-t border-stone-100">
        <div className="text-[11px] text-stone-400 font-bold tracking-tight">
          {meta.total > 0 ? (
            <>
              {local === "ar" ? "عرض" : "SHOWING"} <span className="text-stone-600">{messages.length}</span> {local === "ar" ? "من" : "OF"} <span className="text-stone-600">{meta.total}</span> {local === "ar" ? "رسائل" : "MESSAGES"}
            </>
          ) : (
            t.showingText
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-2 px-3 bg-white border border-stone-200 rounded-xl text-[11px] font-bold text-stone-600 hover:bg-stone-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
            disabled={page <= 1 || isLoading}
            onClick={() => onPageChange(page - 1)}
          >
            {local === "ar" ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
            {t.previous}
          </button>

          <div className="flex items-center gap-1 mx-1">
            {(() => {
              const totalPages = meta.totalPages;
              const pages = [];
              const range = 1; // Number of pages to show before/after current page

              for (let i = 1; i <= totalPages; i++) {
                if (
                  i === 1 || // Always show first
                  i === totalPages || // Always show last
                  (i >= page - range && i <= page + range) // Show around current
                ) {
                  pages.push(i);
                } else if (i === page - range - 1 || i === page + range + 1) {
                  pages.push("...");
                }
              }

              // Filter out duplicate ellipses
              const uniquePages = pages.filter((v, i, a) => v !== "..." || a[i - 1] !== "...");

              return uniquePages.map((p, idx) => (
                p === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-stone-400 text-xs font-bold">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => onPageChange(p as number)}
                    disabled={isLoading}
                    className={`w-8 h-8 rounded-xl text-[11px] font-bold transition-all ${
                      page === p
                        ? "bg-orange-500 text-white shadow-sm border border-orange-600"
                        : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    {p}
                  </button>
                )
              ));
            })()}
          </div>

          <button
            className="p-2 px-3 bg-white border border-stone-200 rounded-xl text-[11px] font-bold text-stone-600 hover:bg-stone-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
            disabled={page >= meta.totalPages || isLoading}
            onClick={() => onPageChange(page + 1)}
          >
            {t.next}
            {local === "ar" ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
          </button>
        </div>
      </div>
    </section>
  );
}
