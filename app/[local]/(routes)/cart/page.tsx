/* eslint-disable @typescript-eslint/no-explicit-any */
import { CartPage } from "@/app/_components/_website/_cart/CartPage";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getTranslations } from "@/app/helpers/helpers";

export async function generateMetadata({ params }: any) {
  const { local } = await params;
  const translations = getTranslations(local ?? "en");

  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  return {
    title: translations.cartMeta.title,
    description: translations.cartMeta.description,
    ...sharedMetadata,
  };
}

export default function Cart() {
  return (
    <main
      id="main-content"
      className="mt-24 pt-10 relative h-full pb-12 px-4 md:px-8 w-full max-w-screen-2xl mx-auto"
    >
      <CartPage />
    </main>
  );
}
