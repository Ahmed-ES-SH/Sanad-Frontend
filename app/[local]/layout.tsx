/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTranslations } from "../helpers/helpers";
import { getSharedMetadata } from "../helpers/getSharedMetadata";

export async function generateMetadata({ params }: any) {
  const { local } = await params;
  const translations = getTranslations(local ?? "en");

  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  return {
    title: translations.layoutMeta.title,
    description: translations.layoutMeta.description,
    ...sharedMetadata,
  };
}

export default function LocalLayout({ children }: any) {
  return <>{children}</>;
}
