import { getTranslations } from "@/app/helpers/helpers";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { NotificationsClient } from "@/app/_components/_website/_notifications";

export async function generateMetadata({ params }: { params: Promise<{ local: string }> }) {
  const { local } = await params;
  const translations = getTranslations(local ?? "en");

  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  return {
    title: translations.notificationsMeta.title,
    description: translations.notificationsMeta.description,
    ...sharedMetadata,
  };
}

export default function NotificationsPage() {
  return <NotificationsClient />;
}