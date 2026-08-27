import type { Metadata, Viewport } from "next";
import { Pacifico } from "next/font/google";
import "./globals.css";
import "./v2.css";
import StructuredData from "./structured-data";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pacifico",
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
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={pacifico.variable}>
      <body suppressHydrationWarning>
        <StructuredData />
        <div className="v2">{children}</div>
      </body>
    </html>
  );
}
