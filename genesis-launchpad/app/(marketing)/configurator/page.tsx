import type { Metadata } from "next";
import { Configurator } from "@/components/v2/Configurator";
import { IconClock, IconShield, IconMic } from "@/components/v2/icons";

export const metadata: Metadata = {
  title: { absolute: "Build Your AI Receptionist | Genesis LP" },
  description:
    "Answer a few questions about your business, pick a voice, and see roughly what your AI receptionist would sound like — then book a call to talk pricing.",
  alternates: { canonical: "/configurator" },
};

const points = [
  { Icon: IconShield, title: "No commitment here", body: "This scopes the work and gets you a real feel for it. Pricing happens on the call." },
  { Icon: IconMic, title: "Powered by ElevenLabs", body: "Pick from real, verified voices — the same engine that answers your calls." },
  { Icon: IconClock, title: "Takes about 3 minutes", body: "The more detail you give, the sharper the call ends up being." },
];

export default function ConfiguratorPage() {
  return (
    <div className="v2-content">
      <section className="v2-wrap" style={{ paddingBlock: "clamp(104px, 15vh, 150px) 60px" }}>
        <div className="v2-contact-grid">
          <div>
            <p
              className="v2-eyebrow v2-in"
              style={{ ["--d" as string]: "0.05s", display: "inline-flex", marginBottom: 18 }}
            >
              Build your agent
            </p>
            <h1
              className="v2-display v2-in"
              style={{ ["--d" as string]: "0.1s", fontSize: "clamp(2.6rem, 5.6vw, 4.2rem)", maxWidth: "16ch" }}
            >
              Let&rsquo;s build <span className="v2-grad-text">your receptionist.</span>
            </h1>
            <p
              className="v2-in"
              style={{
                ["--d" as string]: "0.2s",
                marginTop: 20,
                maxWidth: "48ch",
                fontSize: "1.05rem",
                lineHeight: 1.65,
                color: "var(--text-dim)",
              }}
            >
              Tell us about your business, how calls should be handled, and pick a
              voice. We&rsquo;ll show you roughly what it sounds like, then set up a
              call to talk pricing.
            </p>

            <div style={{ marginTop: 40, maxWidth: 560 }}>
              <Configurator />
            </div>
          </div>

          <aside style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {points.map(({ Icon, title, body }) => (
              <div key={title} className="v2-panel" style={{ padding: "20px 22px", display: "flex", gap: 14 }}>
                <Icon style={{ width: 22, height: 22, color: "var(--blush)", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{title}</h3>
                  <p style={{ margin: "5px 0 0", fontSize: 13.5, lineHeight: 1.55, color: "var(--text-dim)" }}>
                    {body}
                  </p>
                </div>
              </div>
            ))}

            <div className="v2-panel" style={{ padding: "20px 22px" }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Prefer email?</h3>
              <a
                href="mailto:hello@genesislp.ai"
                className="v2-link"
                style={{ display: "inline-block", marginTop: 8, fontSize: 14 }}
              >
                hello@genesislp.ai
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
