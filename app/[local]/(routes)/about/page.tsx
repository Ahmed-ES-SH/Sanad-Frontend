import AboutPage from "@/app/_components/_website/_about/AboutPage";
import CompanyStats from "@/app/_components/_website/_about/CompanyStats";
import TestimonialsSection from "@/app/_components/_website/_about/TestimonialsSection";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getTranslations } from "@/app/helpers/helpers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ local: string }>;
}) {
  const { local } = await params;
  const translations = getTranslations(local ?? "en");

  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  return {
    title: translations.aboutMeta.title,
    description: translations.aboutMeta.description,
    ...sharedMetadata,
  };
}

export default function About() {
  return (
    <>
      <AboutPage />
      <CompanyStats />
      <TestimonialsSection />
    </>
  );
}
