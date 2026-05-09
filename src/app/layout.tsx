import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "سنبل | Sonbol Salon",
  description: "موقع سنبل للحلاقة وحجز المواعيد.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
