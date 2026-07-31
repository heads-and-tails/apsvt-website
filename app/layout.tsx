import type { Metadata } from "next";
import "./globals.css";
import "./expanded.css";
import { SiteMotion } from "./components/SiteMotion";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.socosvita.kiev.ua"),
  title: {
    default: "АПСВТ — освіта з людським виміром",
    template: "%s · АПСВТ",
  },
  description:
    "Академія праці, соціальних відносин і туризму — освіта, дослідження та професійна спільнота у Києві.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "АПСВТ — освіта з людським виміром",
    description: "Обирай програму, знайомся з Академією та плануй вступ.",
    locale: "uk_UA",
    type: "website",
    images: [{ url: "/og-academy-2026.png", width: 1200, height: 630, alt: "АПСВТ — сучасна освіта, дослідження і професійна спільнота" }],
  },
  twitter: { card: "summary_large_image", title: "АПСВТ — освіта з людським виміром", description: "Знання для людей і змін.", images: ["/og-academy-2026.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body><SiteMotion />{children}</body>
    </html>
  );
}
