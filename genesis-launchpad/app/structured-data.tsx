const BASE = "https://www.genesislp.ai";

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE}/#org`,
      name: "Genesis LP",
      url: BASE,
      logo: `${BASE}/logo.png`,
      email: "hello@genesislp.ai",
      description: "AI receptionist and automation for small service businesses.",
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE}/#site`,
      url: BASE,
      name: "Genesis LP",
      publisher: { "@id": `${BASE}/#org` },
    },
    {
      "@type": "Service",
      "@id": `${BASE}/#service`,
      name: "AI Receptionist",
      serviceType: "AI phone answering and appointment booking",
      provider: { "@id": `${BASE}/#org` },
      areaServed: "US",
      audience: {
        "@type": "BusinessAudience",
        name: "Trades, clinics and salons with 5-75 employees",
      },
      offers: [
        {
          "@type": "Offer",
          name: "Lunar",
          price: "250",
          priceCurrency: "USD",
          description: "Core AI receptionist, self-serve. $750 one-time setup.",
        },
        {
          "@type": "Offer",
          name: "Orbit",
          price: "315",
          priceCurrency: "USD",
          description: "Phone and text, monitored by the Genesis team. $825 one-time setup.",
        },
        {
          "@type": "Offer",
          name: "Nova",
          priceCurrency: "USD",
          description: "Broader automation: invoicing, reporting, onboarding. Custom pricing.",
        },
      ],
    },
  ],
};

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
