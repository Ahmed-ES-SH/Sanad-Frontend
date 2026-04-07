import { StatsCards } from "@/app/_components/_dashboard/BlogPage/StatsCards";
import { QuickActions } from "@/app/_components/_dashboard/BlogPage/QuickActions";
import { ChartsPlaceholder } from "@/app/_components/_dashboard/BlogPage/ChartsPlaceholder";
import { Filters } from "@/app/_components/_dashboard/BlogPage/Filters";
import { ArticleGrid } from "@/app/_components/_dashboard/BlogPage/ArticleGrid";
import { Pagination } from "@/app/_components/_dashboard/BlogPage/Pagination";
import { KeyboardShortcutsHelp } from "@/app/_components/_dashboard/BlogPage/KeyboardShortcutsHelp";
import { getAdminArticles } from "@/app/actions/blogActions";
import { Article } from "@/app/types/blog";

interface BlogDashboardPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogDashboardPage({ searchParams }: BlogDashboardPageProps) {
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  try {
    const { data: articles, meta } = await getAdminArticles({
      page: currentPage,
      limit: 9,
    });

    return (
      <main className="pt-24 pb-12 px-8 min-h-screen bg-stone-50 text-stone-900">
        {/* Row 1: Stats Cards */}
        <StatsCards />
        
        {/* Row 2: Quick Actions */}
        <QuickActions />
        
        {/* Row 3: Charts Placeholder Layout */}
        <ChartsPlaceholder />
        
        {/* Row 4: Filters */}
        <Filters />
        
        {/* Row 5: Article Grid */}
        <ArticleGrid 
          initialArticles={articles} 
          totalPages={meta.totalPages}
          currentPage={meta.page}
        />
        
        {/* Pagination */}
        <Pagination 
          currentPage={meta.page} 
          totalPages={meta.totalPages} 
        />
        
        {/* Keyboard Shortcuts Help (hidden by default, shown on ?) */}
        <KeyboardShortcutsHelp />
      </main>
    );
  } catch (error) {
    // Fallback to empty state if API fails
    return (
      <main className="pt-24 pb-12 px-8 min-h-screen bg-stone-50 text-stone-900">
        {/* Row 1: Stats Cards */}
        <StatsCards />
        
        {/* Row 2: Quick Actions */}
        <QuickActions />
        
        {/* Row 3: Charts Placeholder Layout */}
        <ChartsPlaceholder />
        
        {/* Row 4: Filters */}
        <Filters />
        
        {/* Row 5: Article Grid */}
        <ArticleGrid 
          initialArticles={[]} 
          totalPages={0}
          currentPage={1}
        />
        
        {/* Pagination */}
        <Pagination currentPage={1} totalPages={0} />
        
        {/* Keyboard Shortcuts Help (hidden by default, shown on ?) */}
        <KeyboardShortcutsHelp />
      </main>
    );
  }
}