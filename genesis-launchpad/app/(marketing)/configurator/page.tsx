import type { Metadata } from "next";
import { Configurator } from "@/components/v2/Configurator";

export const metadata: Metadata = {
  title: { absolute: "Build Your AI Receptionist | Genesis LP" },
  description:
    "Answer a few questions about your business, pick a voice, and see roughly what your AI receptionist would sound like — then book a call to talk pricing.",
  alternates: { canonical: "/configurator" },
};

export default function ConfiguratorPage() {
  return (
    <div className="v2-content v2-configurator-portal">
      <h1 className="v2-sr-only">Build your AI receptionist</h1>
      <div className="v2-configurator-stage">
        <Configurator />
      </div>
      <p className="v2-configurator-credit">Powered by ElevenLabs</p>
    </div>
  );
}
