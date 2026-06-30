import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TallerFlow",
  description: "Gestión integral para talleres de reparación de electrodomésticos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
