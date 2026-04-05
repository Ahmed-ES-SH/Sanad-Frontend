/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import ClientLayout from "./_components/_global/ClientLayout";
import { Toaster } from "sonner";
import { directionMap } from "./constants/constants";
import { getTranslations } from "./helpers/helpers";
import { getSharedMetadata } from "./helpers/getSharedMetadata";
import Navbar from "./_components/_global/Navbar";
import Footer from "./_components/_global/Footer";
import WhatsappButton from "./_components/_global/WhatsappButton";
import ScrollToTopButton from "./_components/_global/ScrollToTopButton";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

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

export default async function RootLayout({ params, children }: any) {
  const { local } = await params;

  return (
    <html dir={directionMap[local ?? "en"]} lang={local ?? "en"}>
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[1000] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-xl focus:shadow-2xl"
        >
          Skip to main content
        </a>
        <ClientLayout>
          <Navbar />
          <Toaster richColors position="top-center" />
          <div className="min-h-screen">
            {children}
            <WhatsappButton />
            <ScrollToTopButton />
          </div>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
