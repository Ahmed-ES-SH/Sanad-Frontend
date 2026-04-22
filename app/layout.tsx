/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Inter,
  Plus_Jakarta_Sans,
  Oswald,
  IBM_Plex_Sans,
} from "next/font/google";
import ClientLayout from "./_components/_global/ClientLayout";
import { Toaster } from "sonner";
import { directionMap } from "./constants/constants";
import { getTranslations } from "./helpers/helpers";
import { getSharedMetadata } from "./helpers/getSharedMetadata";
import Navbar from "./_components/_global/Navbar";
import Footer from "./_components/_global/Footer";
import FixedButtons from "./_components/_global/FixedButtons";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        className={`${inter.variable} ${plusJakartaSans.variable} ${oswald.variable} ${ibmPlexSans.variable} font-sans antialiased`}
      >
        <ClientLayout>
          <Navbar />
          <Toaster richColors position="top-center" />
          <div className="min-h-screen">
            {children}
            <FixedButtons />
          </div>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
