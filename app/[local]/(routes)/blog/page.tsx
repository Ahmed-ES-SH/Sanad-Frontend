/* eslint-disable @typescript-eslint/no-explicit-any */
import BlogPage from "@/app/_components/_website/_blog/BlogPage";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getTranslations } from "@/app/helpers/helpers";
import { getArticles } from "@/app/actions/blogActions";
import React from "react";

export async function generateMetadata({ params }: any) {
  const { local } = await params;
  const translations = getTranslations(local ?? "en");

  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  return {
    title: translations.blogMeta.title,
    description: translations.blogMeta.description,
    ...sharedMetadata,
  };
}

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    categoryId?: string;
    tag?: string;
    search?: string;
  }>;
}) {
  try {
    const params = await searchParams;
    const { data: articles, meta } = await getArticles({
      page: params.page ? parseInt(params.page) : 1,
      limit: 8,
      categoryId: params.categoryId,
      tag: params.tag,
      search: params.search,
    });

    return (
      <BlogPage
        initialArticles={articles}
        totalPosts={meta.total}
        totalPages={meta.totalPages}
        currentPage={meta.page}
      />
    );
  } catch {
    // Fallback to empty state if API fails
    return (
      <BlogPage
        initialArticles={[]}
        totalPosts={0}
        totalPages={0}
        currentPage={1}
      />
    );
  }
}
