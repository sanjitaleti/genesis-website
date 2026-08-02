import type { Metadata } from "next";
import { ContactForm } from "@/components/v2/ContactForm";
import { IconClock, IconShield, IconCheck } from "@/components/v2/icons";

export const metadata: Metadata = {
  title: { absolute: "Contact · Genesis LP" },
  description: "Book a free 20-minute call with Genesis LP about your AI receptionist.",
};

const points = [
  { Icon: IconClock, title: "20 minutes", body: "That's all we need to tell you honestly if this fits." },
  { Icon: IconShield, title: "No pressure", body: "No sales script. If it's not a fit, we'll say so." },
  { Icon: IconCheck, title: "Live in weeks", body: "Most receptionists are answering calls in 2–6 weeks." },
];

export default function ContactPage() {
  return (
    <div className="v2-content">
      <section className="v2-wrap" style={{ paddingBlock: "clamp(104px, 15vh, 150px) 60px" }}>
        <div className="v2-contact-grid">
          <div>
            <h1
              className="v2-display v2-in"
              style={{ ["--d" as string]: "0.1s", fontSize: "clamp(2.6rem, 5.6vw, 4.2rem)", maxWidth: "14ch" }}
            >
              Let&rsquo;s talk about <span className="v2-grad-text">your phones.</span>
            </h1>
            <p
              className="v2-in"
              style={{
                ["--d" as string]: "0.2s",
                marginTop: 20,
                maxWidth: "44ch",
                fontSize: "1.05rem",
                lineHeight: 1.65,
                color: "var(--text-dim)",
              }}
            >
              Tell us a bit about your business and we&rsquo;ll set up a free
              20-minute call to see if an AI receptionist makes sense for you.
            </p>

            <div style={{ marginTop: 40, maxWidth: 460 }}>
              <ContactForm />
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
                href="mailto:meridiansocial01@gmail.com"
                className="v2-link"
                style={{ display: "inline-block", marginTop: 8, fontSize: 14 }}
              >
                meridiansocial01@gmail.com
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
