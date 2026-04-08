import AddArticleContent from "@/app/_components/_dashboard/BlogPage/AddArticle/AddArticleContent";

export default function AddArticlePage() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <main className="flex-1 overflow-y-auto">
        <AddArticleContent />
      </main>
    </div>
  );
}
