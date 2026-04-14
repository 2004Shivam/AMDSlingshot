import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavShell from "@/components/NavShell";

export const metadata: Metadata = {
  title: "Evee — AI Food Intelligence",
  description:
    "Your intervention-first AI food companion. Scan menus, log meals by voice, and get personalized guidance before you eat — not after.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Evee",
  },
  openGraph: {
    title: "Evee — AI Food Intelligence",
    description: "Scan any menu. Get instant AI-powered recommendations tailored to your goals.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#131315",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <NavShell>{children}</NavShell>
      </body>
    </html>
  );
}
