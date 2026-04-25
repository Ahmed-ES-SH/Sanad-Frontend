import { StatsCards } from "@/app/_components/_dashboard/BlogPage/StatsCards";
import { QuickActions } from "@/app/_components/_dashboard/BlogPage/QuickActions";
import { ChartsPlaceholder } from "@/app/_components/_dashboard/BlogPage/ChartsPlaceholder";
import { Filters } from "@/app/_components/_dashboard/BlogPage/Filters";
import { ArticleGrid } from "@/app/_components/_dashboard/BlogPage/ArticleGrid";
import { KeyboardShortcutsHelp } from "@/app/_components/_dashboard/BlogPage/KeyboardShortcutsHelp";
import {
  BlogQueryParams,
  getAdminArticles,
  getCategories,
} from "@/app/actions/blogActions";

interface BlogDashboardPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categoryId?: string;
    isPublished?: string;
    sortBy?: string;
    limit?: string;
  }>;
}

export default async function BlogDashboardPage({
  searchParams,
}: BlogDashboardPageProps) {
  const params = await searchParams;
  const response = await getAdminArticles(params as unknown as BlogQueryParams);
  const categories = await getCategories();

  const { data: articles, meta } = response;

  const currentPage = meta?.page || 1;
  const totalPages = meta?.totalPages || 0;

  return (
    <main className="pt-24 pb-12 px-8 min-h-screen bg-stone-50 text-stone-900">
      {/* Row 1: Stats Cards */}
      <StatsCards />

      {/* Row 2: Quick Actions */}
      <QuickActions />

      {/* Row 3: Charts Placeholder Layout */}
      <ChartsPlaceholder />

      {/* Row 4: Filters */}
      <Filters categories={categories} />

      {/* Row 5: Article Grid */}
      <ArticleGrid
        initialArticles={articles || []}
        totalPages={totalPages}
        currentPage={currentPage}
      />

      {/* Keyboard Shortcuts Help (hidden by default, shown on ?) */}
      <KeyboardShortcutsHelp />
    </main>
  );
}
