/* eslint-disable @typescript-eslint/no-explicit-any */
import BlogPage from "@/app/_components/_website/_blog/BlogPage";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getTranslations } from "@/app/helpers/helpers";
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

export default function Blog() {
  return <BlogPage />;
}
