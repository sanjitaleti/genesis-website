/** One icon set, one stroke voice. 24×24 grid, 1.6 stroke, round caps. */

type P = { className?: string; style?: React.CSSProperties };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconHome = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 11.4 12 4.5l8 6.9" />
    <path d="M6.2 10v9.2a.8.8 0 0 0 .8.8h3.4v-5.4h3.2V20H17a.8.8 0 0 0 .8-.8V10" />
  </svg>
);

export const IconSpark = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3.5 13.9 9l5.6 2-5.6 2-1.9 5.5L10.1 13l-5.6-2 5.6-2z" />
    <path d="M18.5 4.2v2.6M19.8 5.5h-2.6" />
  </svg>
);

export const IconChart = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4.5 19.5h15" />
    <path d="M7.5 16.5v-4M12 16.5V7M16.5 16.5v-6.5" />
  </svg>
);

export const IconCard = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3.2" y="5.8" width="17.6" height="12.4" rx="2.4" />
    <path d="M3.2 10h17.6" />
  </svg>
);

export const IconUser = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8.6" r="3.3" />
    <path d="M5.2 19.8c1.2-3.4 3.9-5.2 6.8-5.2s5.6 1.8 6.8 5.2" />
  </svg>
);

export const IconMessage = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 12.4c0 3.9-3.6 7-8 7a9 9 0 0 1-2.6-.4L4.5 20.5l1.2-3.6A6.6 6.6 0 0 1 4 12.4c0-3.9 3.6-7 8-7s8 3.1 8 7Z" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4.5 12.5 9.5 17.5 19.5 7" />
  </svg>
);

export const IconArrow = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

export const IconSend = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 4 10.5 13.5" />
    <path d="M20 4 14 20.5l-3.5-7-7-3.5z" />
  </svg>
);

export const IconEye = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2.6 12S6 5.9 12 5.9 21.4 12 21.4 12 18 18.1 12 18.1 2.6 12 2.6 12Z" />
    <circle cx="12" cy="12" r="2.9" />
  </svg>
);

export const IconEyeOff = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9.6 6.3A8.9 8.9 0 0 1 12 5.9c6 0 9.4 6.1 9.4 6.1a17 17 0 0 1-2.8 3.6" />
    <path d="M6.4 8.2A16.6 16.6 0 0 0 2.6 12S6 18.1 12 18.1a9 9 0 0 0 3.5-.7" />
    <path d="m4 4 16 16" />
  </svg>
);

export const IconPaperclip = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20 11.5 12.3 19.2a4.4 4.4 0 0 1-6.2-6.2l7.9-7.9a2.9 2.9 0 0 1 4.1 4.1l-7.8 7.8a1.4 1.4 0 0 1-2-2l7.2-7.2" />
  </svg>
);

export const IconLink = (p: P) => (
  <svg {...base} {...p}>
    <path d="M10.3 13.7a3.6 3.6 0 0 0 5.4.4l2.5-2.5a3.6 3.6 0 0 0-5.1-5.1l-1.4 1.4" />
    <path d="M13.7 10.3a3.6 3.6 0 0 0-5.4-.4l-2.5 2.5a3.6 3.6 0 0 0 5.1 5.1l1.4-1.4" />
  </svg>
);

export const IconCode = (p: P) => (
  <svg {...base} {...p}>
    <path d="m9 8-4.5 4L9 16" />
    <path d="m15 8 4.5 4L15 16" />
  </svg>
);

export const IconMic = (p: P) => (
  <svg {...base} {...p}>
    <rect x="9.4" y="3.4" width="5.2" height="10.2" rx="2.6" />
    <path d="M5.8 11.4a6.2 6.2 0 0 0 12.4 0" />
    <path d="M12 17.6v3" />
  </svg>
);

export const IconX = (p: P) => (
  <svg {...base} {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const IconShield = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3.6 19 6v6c0 4-3 7-7 8.4C8 19 5 16 5 12V6z" />
    <path d="m9.3 12.2 1.9 1.9 3.6-3.7" />
  </svg>
);

export const IconClock = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M12 7.4V12l3 1.8" />
  </svg>
);

export const IconCalendar = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3.4" y="5.2" width="17.2" height="15.4" rx="2.6" />
    <path d="M3.4 10h17.2M8.2 3.4v3.4M15.8 3.4v3.4" />
  </svg>
);

export const IconPhone = (p: P) => (
  <svg {...base} {...p}>
    <path d="M8.1 4.2 9.9 8l-2 1.9a12 12 0 0 0 6.2 6.2l1.9-2 3.8 1.8v3.3a1.5 1.5 0 0 1-1.7 1.5C10.6 20 4 13.4 3.2 5.9A1.5 1.5 0 0 1 4.7 4.2z" />
  </svg>
);

export const IconUsers = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="9.4" cy="8.4" r="3.1" />
    <path d="M3.4 19.4c1-3 3.3-4.7 6-4.7s5 1.7 6 4.7" />
    <path d="M16 5.6a3.1 3.1 0 0 1 0 5.9M17.4 14.9c2 .6 3.4 2.2 4.2 4.5" />
  </svg>
);

export const IconReport = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 3.4h7.6L19 8.8v11a1.2 1.2 0 0 1-1.2 1.2H6a1.2 1.2 0 0 1-1.2-1.2V4.6A1.2 1.2 0 0 1 6 3.4Z" />
    <path d="M13.4 3.6V9h5.4" />
    <path d="M8.6 16.4v-2.8M12 16.4v-5M15.4 16.4v-1.6" />
  </svg>
);

export const IconGear = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="2.9" />
    <path d="M19.1 14.2a1.4 1.4 0 0 0 .3 1.6l.1.1a1.7 1.7 0 1 1-2.4 2.4l-.1-.1a1.4 1.4 0 0 0-1.6-.3 1.4 1.4 0 0 0-.9 1.3v.2a1.7 1.7 0 1 1-3.4 0v-.1a1.4 1.4 0 0 0-.9-1.3 1.4 1.4 0 0 0-1.6.3l-.1.1a1.7 1.7 0 1 1-2.4-2.4l.1-.1a1.4 1.4 0 0 0 .3-1.6 1.4 1.4 0 0 0-1.3-.9h-.2a1.7 1.7 0 1 1 0-3.4h.1a1.4 1.4 0 0 0 1.3-.9 1.4 1.4 0 0 0-.3-1.6l-.1-.1a1.7 1.7 0 1 1 2.4-2.4l.1.1a1.4 1.4 0 0 0 1.6.3h.1a1.4 1.4 0 0 0 .9-1.3v-.2a1.7 1.7 0 1 1 3.4 0v.1a1.4 1.4 0 0 0 .9 1.3 1.4 1.4 0 0 0 1.6-.3l.1-.1a1.7 1.7 0 1 1 2.4 2.4l-.1.1a1.4 1.4 0 0 0-.3 1.6v.1a1.4 1.4 0 0 0 1.3.9h.2a1.7 1.7 0 1 1 0 3.4h-.1a1.4 1.4 0 0 0-1.3.9Z" />
  </svg>
);

export const IconSearch = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="10.8" cy="10.8" r="6.4" />
    <path d="m15.5 15.5 4.1 4.1" />
  </svg>
);

export const IconBell = (p: P) => (
  <svg {...base} {...p}>
    <path d="M18 16.4V11a6 6 0 1 0-12 0v5.4L4.4 18.6h15.2z" />
    <path d="M10 21.2a2.2 2.2 0 0 0 4 0" />
  </svg>
);

export const IconLogout = (p: P) => (
  <svg {...base} {...p}>
    <path d="M14.4 4.6H6.8a1.4 1.4 0 0 0-1.4 1.4v12a1.4 1.4 0 0 0 1.4 1.4h7.6" />
    <path d="M17.4 15.4 20.8 12l-3.4-3.4M20.4 12H10" />
  </svg>
);

export const IconTrend = (p: P) => (
  <svg {...base} {...p}>
    <path d="m3.6 16.4 5-5.2 3.4 3.2 5-5.6" />
    <path d="M14.2 8.4h3.6V12" />
  </svg>
);

export const IconChevron = (p: P) => (
  <svg {...base} {...p}>
    <path d="m9.5 6 6 6-6 6" />
  </svg>
);

export const IconPlus = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5.4v13.2M5.4 12h13.2" />
  </svg>
);

export const IconDownload = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 4v11" />
    <path d="m7.6 10.8 4.4 4.4 4.4-4.4" />
    <path d="M4.6 19.6h14.8" />
  </svg>
);

/** Google's mark — brand colors, not our palette. */
export const IconGoogle = (p: P) => (
  <svg viewBox="0 0 24 24" {...p}>
    <path
      fill="#4285F4"
      d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.58v3h3.87c2.26-2.09 3.56-5.17 3.56-8.82Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.96-1.08 7.94-2.91l-3.87-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
    />
  </svg>
);
