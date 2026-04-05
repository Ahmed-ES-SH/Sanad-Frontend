/* eslint-disable @typescript-eslint/no-explicit-any */
import ArticleDetailPage from "@/app/_components/_website/_articlePage/ArticleDetailsPage";
import React, { Suspense } from "react";
import Loading from "../../services/[serviceTitle]/loading";
import { blogPosts } from "@/app/constants/blogposts";
import { getTranslations } from "@/app/helpers/helpers";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";

export async function generateMetadata({ params, searchParams }: any) {
  const { local } = await params;
  const { articleId } = await searchParams;

  const article = blogPosts.find((service) => service.id === Number(articleId));

  const translations = getTranslations(local ?? "en");
  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  if (!article) {
    return {
      title: "Post Title",
      description: "Post Description",
      ...sharedMetadata,
    };
  }

  return {
    title: `Sanad Post - ${article.title}`,
    description: article.excerpt,
    ...sharedMetadata,
  };
}

export default function ArticlePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ArticleDetailPage />
    </Suspense>
  );
}
