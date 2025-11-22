import type { Metadata } from "next";
import { Montserrat, Cinzel_Decorative, Cinzel, Montagu_Slab } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["100", "400", "500", "700", "900"],
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  variable: "--font-cinzel-decorative",
  weight: ["400", "700", "900"],
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const montagu = Montagu_Slab({
  subsets: ["latin"],
  variable: "--font-montagu",
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Livemosque",
  description: "Live Mosque - The service is completely free to any Masjid.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${montserrat.variable} ${cinzelDecorative.variable} ${cinzel.variable} ${montagu.variable}`}>
        {children}
      </body>
    </html>
  );
}
