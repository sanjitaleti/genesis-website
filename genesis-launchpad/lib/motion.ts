import type { Variants, Transition } from "framer-motion";

/** Golden springs — from the Fluid Motion skill. */
export const springHigh: Transition = { type: "spring", stiffness: 400, damping: 25 };
export const springSmooth: Transition = { type: "spring", stiffness: 300, damping: 30 };

/** Standard scroll-reveal: fade + lift, smooth-fluid spring. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: springSmooth },
};

/** Container that staggers its children on reveal. */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: springSmooth },
};

/** Shared viewport config so reveals fire once, slightly early. */
export const viewportOnce = { once: true, margin: "-80px" } as const;
