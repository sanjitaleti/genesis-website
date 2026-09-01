import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./v2.css";
import StructuredData from "./structured-data";

/* The brand type system — see DIRECTION.md § Type.
   Schibsted Grotesk carries display, Hanken Grotesk carries reading, and
   JetBrains Mono carries anything that lines up in a column. Deliberately
   none of the faces every AI-built site converges on. */
const display = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display-face",
  display: "swap",
});

const body = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-face",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-face",
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
  themeColor: "#060809",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body suppressHydrationWarning>
        <StructuredData />
        <div className="v2">{children}</div>
      </body>
    </html>
  );
}
