/**
 * Demo fixtures for Green City Window Door & Siding.
 *
 * Business details (name, phone, hours, service area, trades) are real, taken
 * from greencitywindow.com. The CALL FIGURES BELOW ARE NOT REAL — they are
 * illustrative, and the dashboard shows a "Demo data" badge for exactly as
 * long as it is reading from this file.
 *
 * Real history replaces all of this via `npm run backfill` once the agent id
 * is on the organisation row; see SETUP.md.
 */

export const business = {
  name: "Green City Window Door & Siding",
  phone: "(425) 200-9191",
  address: "1732 194th St SE, Bothell, WA 98012",
  serviceArea: "Bothell and Western Washington",
  hours: [
    ["Monday – Friday", "8:00a — 5:00p"],
    ["Saturday", "10:00a — 2:00p"],
    ["Sunday", "Closed"],
    ["Outside hours", "Answered and booked"],
  ] as [string, string][],
};

export type Range = "24h" | "7d" | "30d";

export type Tile = {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  tone: string;
  pts: number[];
  hint: string;
};

export const tilesByRange: Record<Range, Tile[]> = {
  "24h": [
    { label: "Calls answered", value: "19", delta: "+3", up: true, tone: "#d62828", pts: [1, 2, 1, 3, 2, 3, 2, 4, 3, 4], hint: "vs. yesterday" },
    { label: "Estimates booked", value: "7", delta: "+2", up: true, tone: "#ff4d1f", pts: [0, 1, 1, 1, 2, 1, 2, 2, 3, 3], hint: "vs. yesterday" },
    { label: "Outside hours", value: "6", delta: "+2", up: true, tone: "#ff8a00", pts: [0, 1, 0, 1, 1, 2, 1, 2, 2, 3], hint: "before 8a, after 5p" },
    { label: "Avg. pickup", value: "1.1s", delta: "−0.2s", up: true, tone: "#ffb703", pts: [18, 17, 16, 15, 14, 13, 13, 12, 11, 11], hint: "time to answer" },
    { label: "Missed calls", value: "0", delta: "held", up: true, tone: "#f4a300", pts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], hint: "nothing dropped" },
  ],
  "7d": [
    { label: "Calls answered", value: "127", delta: "+9.2%", up: true, tone: "#d62828", pts: [12, 15, 13, 18, 16, 21, 19, 24, 22, 26], hint: "vs. last week" },
    { label: "Estimates booked", value: "44", delta: "+13%", up: true, tone: "#ff4d1f", pts: [4, 6, 5, 7, 7, 9, 8, 11, 10, 12], hint: "vs. last week" },
    { label: "Outside hours", value: "38", delta: "+18%", up: true, tone: "#ff8a00", pts: [3, 4, 4, 6, 5, 7, 7, 9, 8, 10], hint: "before 8a, after 5p" },
    { label: "Avg. pickup", value: "1.2s", delta: "−0.3s", up: true, tone: "#ffb703", pts: [22, 21, 20, 18, 17, 16, 15, 14, 13, 12], hint: "time to answer" },
    { label: "Missed calls", value: "0", delta: "held", up: true, tone: "#f4a300", pts: [2, 1, 1, 0, 0, 0, 0, 0, 0, 0], hint: "nothing dropped" },
  ],
  "30d": [
    { label: "Calls answered", value: "516", delta: "+7.4%", up: true, tone: "#d62828", pts: [24, 29, 27, 34, 32, 38, 36, 43, 41, 48], hint: "vs. last month" },
    { label: "Estimates booked", value: "178", delta: "+11%", up: true, tone: "#ff4d1f", pts: [9, 12, 11, 15, 14, 17, 16, 20, 19, 23], hint: "vs. last month" },
    { label: "Outside hours", value: "149", delta: "+16%", up: true, tone: "#ff8a00", pts: [7, 9, 8, 12, 11, 14, 13, 17, 16, 20], hint: "before 8a, after 5p" },
    { label: "Avg. pickup", value: "1.2s", delta: "−0.4s", up: true, tone: "#ffb703", pts: [26, 24, 25, 21, 20, 18, 17, 15, 14, 12], hint: "time to answer" },
    { label: "Missed calls", value: "0", delta: "held", up: true, tone: "#f4a300", pts: [4, 3, 2, 2, 1, 1, 0, 0, 0, 0], hint: "nothing dropped" },
  ],
};

export const volumeByRange: Record<Range, { a: number[]; b: number[]; labels: string[] }> = {
  "24h": {
    a: [3, 2, 1, 1, 6, 28, 52, 64, 70, 61, 44, 18],
    b: [1, 0, 0, 0, 2, 10, 18, 23, 26, 21, 15, 6],
    labels: ["12a", "2a", "4a", "6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p"],
  },
  "7d": {
    a: [58, 71, 64, 76, 69, 47, 22],
    b: [20, 25, 22, 27, 24, 16, 7],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  "30d": {
    a: [38, 46, 43, 55, 49, 62, 58, 70, 66, 78, 74, 88],
    b: [13, 16, 15, 19, 17, 22, 20, 25, 23, 27, 26, 31],
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"],
  },
};

export const radarAxes = ["Answer rate", "Speed", "Booking", "Accuracy", "Outside hours", "Callbacks"];
export const radarNow = [94, 88, 71, 90, 84, 66];
export const radarPrev = [76, 70, 58, 79, 61, 55];

export const funnel = [
  { label: "Calls received", n: "516", pct: 100, tone: "#ffb703" },
  { label: "Answered", n: "516", pct: 100, tone: "#ff8a00" },
  { label: "Qualified", n: "311", pct: 60, tone: "#ff4d1f" },
  { label: "Estimate booked", n: "178", pct: 34, tone: "#d62828" },
];

export const resolution = [
  { label: "Estimate booked", value: 178, tone: "#d62828" },
  { label: "Priced over phone", value: 133, tone: "#ff4d1f" },
  { label: "Answered question", value: 142, tone: "#ff8a00" },
  { label: "Passed to you", value: 63, tone: "#ffb703" },
];

export const hourly = [2, 1, 1, 0, 1, 4, 14, 33, 48, 57, 62, 58, 51, 60, 55, 49, 41, 34, 22, 15, 9, 6, 4, 3];
export const hourLabels = ["12a", "", "2a", "", "4a", "", "6a", "", "8a", "", "10a", "", "12p", "", "2p", "", "4p", "", "6p", "", "8p", "", "10p", ""];

export type CallStatus = "Booked" | "Quoted" | "Handled" | "Passed on";

export type CallRecord = {
  id: string;
  time: string;
  day: string;
  caller: string;
  phone: string;
  reason: string;
  status: CallStatus;
  duration: string;
  value: string;
};

export const calls: CallRecord[] = [
  { id: "c-2041", time: "7:12a", day: "Today", caller: "Ellen Prosser", phone: "(425) 555-0142", reason: "Whole-home window replacement, 14 windows", status: "Booked", duration: "6m 21s", value: "$21,400" },
  { id: "c-2040", time: "6:38a", day: "Today", caller: "Unknown caller", phone: "(206) 555-0188", reason: "Fiber cement siding, price range", status: "Quoted", duration: "4m 02s", value: "$28,000" },
  { id: "c-2039", time: "8:47p", day: "Yesterday", caller: "Devin Marsh", phone: "(425) 555-0231", reason: "Patio door replacement estimate", status: "Booked", duration: "3m 55s", value: "$4,800" },
  { id: "c-2038", time: "7:31p", day: "Yesterday", caller: "Renee Oyelaran", phone: "(360) 555-0177", reason: "Bay window measure appointment", status: "Booked", duration: "3m 12s", value: "$7,250" },
  { id: "c-2037", time: "6:58p", day: "Yesterday", caller: "Curtis Nakamura", phone: "(425) 555-0336", reason: "Warranty question, 2019 install", status: "Handled", duration: "2m 18s", value: "—" },
  { id: "c-2036", time: "5:44p", day: "Yesterday", caller: "Alina Petrov", phone: "(206) 555-0902", reason: "Entry door, fiberglass options", status: "Quoted", duration: "5m 07s", value: "$3,900" },
  { id: "c-2035", time: "4:20p", day: "Yesterday", caller: "Unknown caller", phone: "(425) 555-0558", reason: "Storm damage, needs someone today", status: "Passed on", duration: "0m 47s", value: "—" },
  { id: "c-2034", time: "2:19p", day: "Yesterday", caller: "Tom Aldridge", phone: "(360) 555-0117", reason: "Engineered wood siding consultation", status: "Booked", duration: "4m 44s", value: "$19,600" },
  { id: "c-2033", time: "11:02a", day: "Mon", caller: "Grace Whitfield", phone: "(425) 555-0664", reason: "Estimate follow-up, deck rebuild", status: "Quoted", duration: "5m 33s", value: "$12,300" },
  { id: "c-2032", time: "9:48a", day: "Mon", caller: "Marcus Bell", phone: "(206) 555-0220", reason: "Double hung windows, 6 upstairs", status: "Booked", duration: "3m 29s", value: "$9,150" },
  { id: "c-2031", time: "8:11a", day: "Mon", caller: "Sofia Ruiz", phone: "(425) 555-0779", reason: "Financing options question", status: "Handled", duration: "2m 51s", value: "—" },
  { id: "c-2030", time: "7:26a", day: "Mon", caller: "Harold Vance", phone: "(360) 555-0448", reason: "Asphalt roof + gutters quote", status: "Booked", duration: "5m 16s", value: "$16,800" },
];

export type Customer = {
  name: string;
  business: string;
  phone: string;
  jobs: number;
  lifetime: string;
  last: string;
  status: "Active" | "New" | "Lapsed";
};

export const customers: Customer[] = [
  { name: "Ellen Prosser", business: "Residential", phone: "(425) 555-0142", jobs: 2, lifetime: "$24,900", last: "Today", status: "Active" },
  { name: "Harold Vance", business: "Vance Rentals", phone: "(360) 555-0448", jobs: 9, lifetime: "$88,400", last: "Mon", status: "Active" },
  { name: "Tom Aldridge", business: "Residential", phone: "(360) 555-0117", jobs: 1, lifetime: "$19,600", last: "Yesterday", status: "New" },
  { name: "Grace Whitfield", business: "Residential", phone: "(425) 555-0664", jobs: 3, lifetime: "$31,200", last: "Mon", status: "Active" },
  { name: "Devin Marsh", business: "Residential", phone: "(425) 555-0231", jobs: 1, lifetime: "$4,800", last: "Yesterday", status: "New" },
  { name: "Marcus Bell", business: "Residential", phone: "(206) 555-0220", jobs: 2, lifetime: "$14,700", last: "Mon", status: "Active" },
  { name: "Renee Oyelaran", business: "Residential", phone: "(360) 555-0177", jobs: 1, lifetime: "$7,250", last: "Yesterday", status: "New" },
  { name: "Curtis Nakamura", business: "Residential", phone: "(425) 555-0336", jobs: 4, lifetime: "$38,900", last: "Yesterday", status: "Active" },
  { name: "Alina Petrov", business: "Petrov Properties", phone: "(206) 555-0902", jobs: 6, lifetime: "$52,100", last: "Yesterday", status: "Active" },
  { name: "Sofia Ruiz", business: "Residential", phone: "(425) 555-0779", jobs: 1, lifetime: "$2,400", last: "Mar 4", status: "Lapsed" },
];

export type Appointment = {
  day: number;
  time: string;
  who: string;
  what: string;
  tone: "book" | "quote" | "service";
  duration: string;
};

/**
 * Keyed by day-of-month so the calendar stays populated in whichever month it
 * is pointed at.
 */
export const appointments: Appointment[] = [
  { day: 2, time: "8:30a", who: "Harold Vance", what: "Roof + gutter measure", tone: "book", duration: "2h" },
  { day: 3, time: "9:00a", who: "Ellen Prosser", what: "Window measure, 14 openings", tone: "book", duration: "3h" },
  { day: 3, time: "2:00p", who: "Alina Petrov", what: "Entry door consultation", tone: "quote", duration: "1h" },
  { day: 5, time: "8:00a", who: "Tom Aldridge", what: "Siding walkthrough", tone: "quote", duration: "1h 30m" },
  { day: 8, time: "10:00a", who: "Marcus Bell", what: "Double hung install, upstairs", tone: "book", duration: "4h" },
  { day: 9, time: "8:00a", who: "Curtis Nakamura", what: "Warranty inspection", tone: "service", duration: "1h" },
  { day: 11, time: "1:00p", who: "Devin Marsh", what: "Patio door install", tone: "book", duration: "3h" },
  { day: 12, time: "9:30a", who: "Grace Whitfield", what: "Deck rebuild estimate", tone: "quote", duration: "1h" },
  { day: 15, time: "8:00a", who: "Renee Oyelaran", what: "Bay window install", tone: "book", duration: "5h" },
  { day: 16, time: "11:00a", who: "Harold Vance", what: "Unit 3 siding measure", tone: "service", duration: "2h" },
  { day: 18, time: "8:30a", who: "Ellen Prosser", what: "Window install, day 1", tone: "book", duration: "6h" },
  { day: 19, time: "8:30a", who: "Ellen Prosser", what: "Window install, day 2", tone: "book", duration: "6h" },
  { day: 22, time: "10:00a", who: "Alina Petrov", what: "Fiber cement siding start", tone: "book", duration: "5h" },
  { day: 23, time: "1:30p", who: "Sofia Ruiz", what: "Financing follow-up", tone: "quote", duration: "45m" },
  { day: 24, time: "9:00a", who: "Marcus Bell", what: "Final walkthrough", tone: "service", duration: "1h" },
  { day: 26, time: "8:00a", who: "Tom Aldridge", what: "Engineered wood install", tone: "book", duration: "6h" },
  { day: 29, time: "10:30a", who: "Curtis Nakamura", what: "Composite siding quote", tone: "quote", duration: "1h" },
];

export const activity = [
  { t: "just now", text: "Booked a 14-window measure for Ellen Prosser", tone: "book" },
  { t: "34m ago", text: "Priced fiber cement siding for an unknown caller", tone: "quote" },
  { t: "1h ago", text: "Answered a warranty question on a 2019 install", tone: "handled" },
  { t: "2h ago", text: "Booked a patio door estimate for Devin Marsh", tone: "book" },
  { t: "3h ago", text: "Passed a storm damage call straight to your mobile", tone: "quote" },
  { t: "5h ago", text: "Booked a bay window measure for Renee Oyelaran", tone: "book" },
];
