/* Hallmark · genre: modern-minimal · macrostructure: Long Document · design-system: design.md · designed-as-app */
import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell Genesis LP the process eating your team's week. Replies within one business day.",
};

const details = [
  ["Email", "hello@genesislp.ai"],
  ["Response", "Within one business day"],
  ["Best fit", "Teams of 5–75 people"],
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        kicker="Contact"
        title="Name the process eating your week."
        description="A few honest sentences beat a perfect brief. Tell us the manual work you're sick of — a real person reads every message."
      />

      <section className="wrap py-16 md:py-24">
        <div className="grid gap-14 md:grid-cols-[1fr_1.6fr] md:gap-20">
          <div>
            {details.map(([label, value]) => (
              <div key={label} className="border-b border-rule py-5 first:pt-0">
                <div className="meta">{label}</div>
                <div className="mt-2 text-[0.95rem] text-ink">{value}</div>
              </div>
            ))}
          </div>

          <ContactForm />
        </div>
      </section>
    </>
  );
}
