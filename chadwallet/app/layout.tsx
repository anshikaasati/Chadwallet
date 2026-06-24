import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chadwallet-production.vercel.app"),
  title: "ChadWallet",
  description: "Degen Solana trading wallet. Swap tokens instantly with Privy and Jupiter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="antialiased bg-primary text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
