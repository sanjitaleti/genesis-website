import type { Metadata } from "next";
import { Welcome } from "@/components/v2/Welcome";

export const metadata: Metadata = {
  title: { absolute: "Welcome — Genesis LP" },
  description: "Your Genesis LP portal is ready.",
};

export default function WelcomePage() {
  return <Welcome />;
}
