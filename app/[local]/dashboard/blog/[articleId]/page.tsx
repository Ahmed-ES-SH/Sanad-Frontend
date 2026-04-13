import { ArticleHeader } from "../../../../_components/_dashboard/_articleDetails/ArticleHeader";
import { ArticleStats } from "../../../../_components/_dashboard/_articleDetails/ArticleStats";
import { ArticleQuickActions } from "../../../../_components/_dashboard/_articleDetails/ArticleQuickActions";
import { ArticleContent } from "../../../../_components/_dashboard/_articleDetails/ArticleContent";
import { SEOMetadata } from "../../../../_components/_dashboard/_articleDetails/SEOMetadata";
import { CategoriesTags } from "../../../../_components/_dashboard/_articleDetails/CategoriesTags";
import { SocialSharing } from "../../../../_components/_dashboard/_articleDetails/SocialSharing";
import { getAdminArticleById } from "@/app/actions/blogActions";
import { notFound } from "next/navigation";

interface ArticleDetailsPageProps {
  searchParams: Promise<{ articleId: string }>;
}

export default async function ArticleDetailsPage({
  searchParams,
}: ArticleDetailsPageProps) {
  const { articleId } = await searchParams;

  try {
    const article = await getAdminArticleById(articleId);

    if (!article) {
      notFound();
    }

    return (
      <main className="pt-24 pb-12 px-8 min-h-screen bg-stone-50 text-stone-900">
        {/* Row 1: Article Header */}
        <ArticleHeader article={article} />

        {/* Row 2: Article Stats */}
        <ArticleStats article={article} />

        {/* Row 3: Quick Actions */}
        <ArticleQuickActions article={article} />

        {/* Row 4: Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Article Content */}
          <div className="lg:col-span-8 space-y-6">
            <ArticleContent article={article} />
          </div>

          {/* Right Column: Metadata & Settings */}
          <div className="lg:col-span-4 space-y-6">
            <SEOMetadata article={article} />
            <CategoriesTags article={article} />
            <SocialSharing article={article} />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    notFound();
  }
}
