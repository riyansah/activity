import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "@/components/Layout";

export const metadata: Metadata = {
  title: "Personal Activity Dashboard",
  description: "Dashboard pribadi untuk pekerjaan, aktivitas, progress, grafik, dan laporan."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
