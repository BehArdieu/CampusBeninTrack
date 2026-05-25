import type { Metadata } from "next";
import { Libre_Baskerville, DM_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/header";
import { SiteFooter } from "@/components/footer";

const libre = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase:
    typeof process.env.NEXT_PUBLIC_SITE_URL !== "undefined"
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : undefined,
  title: {
    default: "360CampusFrance — Procédure Campus France",
    template: "%s · 360CampusFrance",
  },
  description:
    "Guide étape par étape pour étudiants béninois dans la procédure Campus France Bénin jusqu’à l’arrivée en France — validation du titre, sécurité sociale, CAF, impôts, banque.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${libre.variable} ${dmSans.variable} h-full`}>
      <body className={`${dmSans.className} min-h-full flex flex-col antialiased`}>
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
