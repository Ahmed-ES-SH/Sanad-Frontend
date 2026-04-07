/* eslint-disable @typescript-eslint/no-explicit-any */
import ArticleDetailsPage from "@/app/_components/_website/_articlePage/ArticleDetailsPage";
import React, { Suspense } from "react";
import Loading from "../../services/[serviceTitle]/loading";
import { getTranslations } from "@/app/helpers/helpers";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getArticleBySlug } from "@/app/actions/blogActions";
import { notFound } from "next/navigation";

export async function generateMetadata({ params, searchParams }: any) {
  const { local, articleTitle } = await params;
  const translations = getTranslations(local ?? "en");
  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  try {
    const article = await getArticleBySlug(articleTitle);
    return {
      title: `Sanad Post - ${article.title}`,
      description: article.excerpt || "",
      ...sharedMetadata,
    };
  } catch {
    return {
      title: translations.blogMeta.title,
      description: translations.blogMeta.description,
      ...sharedMetadata,
    };
  }
}

export default async function ArticlePage({ params }: any) {
  const { articleTitle } = await params;

  try {
    const article = await getArticleBySlug(articleTitle);
    return (
      <Suspense fallback={<Loading />}>
        <ArticleDetailsPage article={article} />
      </Suspense>
    );
  } catch {
    notFound();
  }
}
