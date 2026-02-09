import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Product Factory",
  description: "MVP para generación automática de productos digitales premium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}
