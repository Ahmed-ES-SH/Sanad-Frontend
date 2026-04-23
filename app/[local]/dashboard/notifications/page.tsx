import { Metadata } from "next";
import { getTranslations } from "@/app/helpers/helpers";
import NotificationsClient from "@/app/_components/_notifications/NotificationsClient";

interface Props {
  params: Promise<{ local: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { local } = await params;
  const translations = getTranslations(local);
  const t = translations.dashboardNotificationsMeta;

  return {
    title: t.title,
    description: t.description,
  };
}

export default async function NotificationsPage() {
  return <NotificationsClient />;
}
