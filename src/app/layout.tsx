import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Awal — Fast Text Polisher",
  description: "Paste text. Get it fixed or improved. Copy. Done.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100`}>
        {children}
      </body>
    </html>
  );
}
