export type PricingTier = {
  key: string;
  name: string;
  desc: string;
  price: string;
  unit: string;
  retainer: string | null;
  discount: string | null;
  perks: string[];
  cta: string;
  featured: boolean;
  glow: string;
  glow2: string;
  edge: string;
};

export const tiers: PricingTier[] = [
  {
    key: "lunar",
    name: "Lunar",
    desc: "One AI receptionist, answering your phone and booking work.",
    price: "$750",
    unit: "one-time setup",
    retainer: "$250 / mo retainer",
    discount: "First month at 50% off: $125",
    perks: ["Phone answering, 24/7", "Live in 2–6 weeks", "Your dashboard included"],
    cta: "Start here",
    featured: false,
    glow: "rgba(76,201,240,0.95)",
    glow2: "rgba(67,97,238,0.7)",
    edge: "rgba(76,201,240,0.55)",
  },
  {
    key: "orbit",
    name: "Orbit",
    desc: "Phone and text, fully looked after month to month.",
    price: "$825",
    unit: "one-time setup",
    retainer: "$315 / mo retainer",
    discount: null,
    perks: [
      "Everything in Lunar",
      "Text messaging included",
      "We monitor and improve it",
      "Priority response",
    ],
    cta: "Talk to us",
    featured: true,
    glow: "rgba(255,138,0,0.95)",
    glow2: "rgba(247,45,40,0.72)",
    edge: "rgba(255,138,0,0.6)",
  },
  {
    key: "nova",
    name: "Nova",
    desc: "More of your busywork automated, not just the phone.",
    price: "Custom",
    unit: "add on when you're ready",
    retainer: null,
    discount: null,
    perks: [
      "Everything in Orbit",
      "Invoicing, reporting, onboarding",
      "Dedicated review calls",
    ],
    cta: "Talk to us",
    featured: false,
    glow: "rgba(199,125,255,0.95)",
    glow2: "rgba(247,37,133,0.75)",
    edge: "rgba(199,125,255,0.6)",
  },
];
