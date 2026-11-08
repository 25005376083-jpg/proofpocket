import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProofPocket | Digital Warranty & Receipt Organizer",
  description:
    "Organize your purchase receipts, manage product warranties and protect your purchases with ProofPocket.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}