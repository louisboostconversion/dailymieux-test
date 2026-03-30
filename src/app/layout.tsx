import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import PublicLayout from "@/components/layout/PublicLayout";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Daily Mieux | Le magazine pour mieux consommer",
  description:
    "Daily Mieux est le magazine en ligne qui vous aide à mieux consommer au quotidien. Découvrez nos conseils en alimentation, santé, maison, beauté et bien plus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body className={`${dmSans.className} antialiased`}>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
