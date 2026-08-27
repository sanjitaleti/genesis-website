import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./v2.css";
import StructuredData from "./structured-data";

/* The design.md trio. Display is roman only — no italic headers, and the
   Pacifico script accent is retired: it was a template tell, not a brand. */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const TITLE = "AI Receptionist for Service Businesses | Genesis LP";
const DESC =
  "An AI receptionist that answers every call 24/7, books the job into your " +
  "calendar, and shows you what it recovered. Built for trades, clinics and " +
  "salons of 5-75 people.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.genesislp.ai"),
  title: { default: TITLE, template: "%s | Genesis LP" },
  description: DESC,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Genesis LP",
    title: TITLE,
    description: DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
  },
};

export const viewport: Viewport = {
  themeColor: "#fdfcfa",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body suppressHydrationWarning>
        <StructuredData />
        <div className="v2">{children}</div>
      </body>
    </html>
  );
}
