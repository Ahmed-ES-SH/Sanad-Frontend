import ClientPortfolio from "@/app/_components/_website/_portfolio/ClientPortfolio";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getTranslations } from "@/app/helpers/helpers";

interface PageParams {
  params: Promise<{ local: string }>;
}

export async function generateMetadata({ params }: PageParams) {
  const { local } = await params;
  const translations = getTranslations(local ?? "en");

  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  return {
    title: translations.portfolioMeta?.title || "Our Portfolio — Sanad",
    description:
      translations.portfolioMeta?.description ||
      "Explore our delivered projects across web, mobile, branding, and more.",
    ...sharedMetadata,
  };
}

export default function Portfolio() {
  return <ClientPortfolio />;
}
