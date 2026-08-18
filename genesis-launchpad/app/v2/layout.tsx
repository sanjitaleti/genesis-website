import type { Metadata } from "next";
import "./v2.css";

export const metadata: Metadata = {
  // absolute so it doesn't inherit the root layout's "%s | Genesis LP" template
  title: { absolute: "AI Receptionist for Service Businesses | Genesis LP" },
  description:
    "Genesis LP builds AI receptionists and automations that answer every call, book the job, and hand you the numbers.",
  alternates: { canonical: "/v2" },
};

export default function V2Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="v2">{children}</div>;
}
