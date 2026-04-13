import { fetchContactMessages } from "@/app/actions/contactActions";
import { QuickActions } from "@/app/_components/_dashboard/ContactUsPage/QuickActions";
import { StatsCards } from "@/app/_components/_dashboard/ContactUsPage/StatsCards";
import { Filters } from "@/app/_components/_dashboard/ContactUsPage/Filters";
import { MessagesTable } from "@/app/_components/_dashboard/ContactUsPage/MessagesTable";
import { getContactStats } from "@/app/_components/_dashboard/ContactUsPage/contactUtils";

interface ContactUsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    order?: string;
    isRead?: string;
  }>;
}

export default async function ContactUsPage({
  searchParams,
}: ContactUsPageProps) {
  const resolvedSearchParams = await searchParams;

  const page = Math.max(1, Number(resolvedSearchParams.page || "1") || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(resolvedSearchParams.limit || "10") || 10),
  );
  const order = resolvedSearchParams.order === "ASC" ? "ASC" : "DESC";
  const isRead =
    resolvedSearchParams.isRead === "true"
      ? true
      : resolvedSearchParams.isRead === "false"
        ? false
        : undefined;

  const response = await fetchContactMessages({
    page,
    limit,
    order,
    isRead,
    sortBy: "createdAt",
  });

  const messages = response.data ?? [];
  const meta = response.meta ?? {
    page,
    limit,
    total: messages.length,
    totalPages: 1,
  };
  const stats = getContactStats(messages, meta.total);

  return (
    <main className="pt-12 pb-12 px-8 min-h-screen bg-stone-50 text-stone-900">
      <QuickActions isUnreadOnly={isRead === false} order={order} />

      <StatsCards
        total={stats.total}
        unread={stats.unread}
        replied={stats.replied}
        currentPageCount={stats.currentPageCount}
      />

      <Filters isRead={isRead} order={order} />

      {response.success ? (
        <MessagesTable
          messages={messages}
          meta={meta}
          page={meta.page}
          limit={meta.limit}
          order={order}
          isRead={isRead}
        />
      ) : (
        <section className="rounded-3xl border border-accent-rose/20 bg-white px-6 py-8 text-sm text-accent-rose shadow-sm">
          {response.message || "Failed to load contact messages."}
        </section>
      )}
    </main>
  );
}
