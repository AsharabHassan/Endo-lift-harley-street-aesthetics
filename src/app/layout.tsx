import type { Metadata } from "next";
import { Playfair_Display, Space_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Your Treatment Plan | Harley Street Aesthetic Clinic",
  description:
    "Your personalised Endolift treatment plan from Harley Street Aesthetic Clinic.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-hsa-bg antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
