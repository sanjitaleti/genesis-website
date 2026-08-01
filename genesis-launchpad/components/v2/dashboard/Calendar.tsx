"use client";

import { useMemo, useState, useEffect } from "react";
import { type Appointment } from "@/lib/v2/data";
import { usePortalData } from "./PortalData";
import { IconChevron, IconPlus, IconClock } from "../icons";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type Cell = { day: number; inMonth: boolean; key: string };

/** Monday-first grid covering the whole month plus the days that pad it out. */
function buildGrid(year: number, month: number): Cell[] {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  // getDay() is Sunday-first; shift so Monday is column zero
  const lead = (first.getDay() + 6) % 7;

  const cells: Cell[] = [];
  for (let i = lead - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, inMonth: false, key: `p${daysInPrev - i}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, key: `c${d}` });
  }
  let next = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: next, inMonth: false, key: `n${next}` });
    next++;
  }
  return cells;
}

export function CalendarView() {
  const { appointments } = usePortalData();
  const forDay = (day: number): Appointment[] => appointments.filter((a) => a.day === day);

  const [mounted, setMounted] = useState(false);
  const [cursor, setCursor] = useState({ year: 2026, month: 6 });
  const [today, setToday] = useState<{ year: number; month: number; day: number } | null>(null);
  const [selected, setSelected] = useState(3);

  // The month is derived from the visitor's clock, which the prerendered HTML
  // cannot know. Rendering after mount keeps the markup from disagreeing.
  useEffect(() => {
    const now = new Date();
    setCursor({ year: now.getFullYear(), month: now.getMonth() });
    setToday({ year: now.getFullYear(), month: now.getMonth(), day: now.getDate() });
    setSelected(now.getDate());
    setMounted(true);
  }, []);

  const cells = useMemo(() => buildGrid(cursor.year, cursor.month), [cursor]);

  const isToday = (c: Cell) =>
    !!today &&
    c.inMonth &&
    today.year === cursor.year &&
    today.month === cursor.month &&
    today.day === c.day;

  const step = (dir: number) => {
    setCursor((c) => {
      const m = c.month + dir;
      if (m < 0) return { year: c.year - 1, month: 11 };
      if (m > 11) return { year: c.year + 1, month: 0 };
      return { year: c.year, month: m };
    });
  };

  const dayList = forDay(selected);

  // Near the end of a month there is nothing "later" left, so the list rolls
  // over rather than showing an empty panel on an otherwise busy calendar.
  const later = appointments.filter((a) => a.day > selected);
  const rollsOver = later.length === 0;
  const upcoming = (rollsOver ? appointments : later).slice(0, 5);

  if (!mounted) {
    return <div className="v2-dash-skeleton" aria-hidden />;
  }

  return (
    <div className="v2-cal">
      <section className="v2-dash-card v2-cal-main">
        <header className="v2-cal-head">
          <div className="v2-cal-title">
            <h3>
              {MONTHS[cursor.month]} <span>{cursor.year}</span>
            </h3>
            <p>{appointments.length} jobs booked this month</p>
          </div>
          <div className="v2-cal-nav">
            <button type="button" onClick={() => step(-1)} aria-label="Previous month">
              <IconChevron style={{ transform: "rotate(180deg)" }} />
            </button>
            <button
              type="button"
              className="v2-cal-today"
              onClick={() => {
                if (!today) return;
                setCursor({ year: today.year, month: today.month });
                setSelected(today.day);
              }}
            >
              Today
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next month">
              <IconChevron />
            </button>
          </div>
        </header>

        <div className="v2-cal-dows" role="presentation">
          {DAY_NAMES.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        <div className="v2-cal-grid">
          {cells.map((c) => {
            const items = c.inMonth ? forDay(c.day) : [];
            const active = c.inMonth && c.day === selected;
            return (
              <button
                key={c.key}
                type="button"
                className="v2-cal-cell"
                data-out={!c.inMonth}
                data-today={isToday(c)}
                data-active={active}
                onClick={() => c.inMonth && setSelected(c.day)}
                disabled={!c.inMonth}
                aria-label={`${MONTHS[cursor.month]} ${c.day}, ${items.length} jobs`}
              >
                <span className="v2-cal-n">{c.day}</span>
                {items.length > 0 ? (
                  <span className="v2-cal-chips">
                    {items.slice(0, 2).map((a, i) => (
                      <span key={i} className={`v2-cal-chip v2-cal-chip--${a.tone}`}>
                        <em>{a.time}</em> {a.what}
                      </span>
                    ))}
                    {items.length > 2 ? (
                      <span className="v2-cal-more">+{items.length - 2} more</span>
                    ) : null}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      <aside className="v2-cal-side">
        <section className="v2-dash-card">
          <header className="v2-dash-card-head">
            <div>
              <h4>
                {MONTHS[cursor.month]} {selected}
              </h4>
              <p>{dayList.length === 0 ? "Nothing booked" : `${dayList.length} scheduled`}</p>
            </div>
            <button type="button" className="v2-icon-btn" aria-label="Add a job">
              <IconPlus />
            </button>
          </header>

          {dayList.length === 0 ? (
            <p className="v2-dash-empty">
              A clear day. Anything your receptionist books will appear here.
            </p>
          ) : (
            <ul className="v2-cal-day">
              {dayList.map((a, i) => (
                <li key={i} className={`v2-cal-item v2-cal-item--${a.tone}`}>
                  <span className="v2-cal-item-time">{a.time}</span>
                  <span className="v2-cal-item-body">
                    <strong>{a.what}</strong>
                    <span>{a.who}</span>
                  </span>
                  <span className="v2-cal-item-dur">
                    <IconClock />
                    {a.duration}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="v2-dash-card">
          <header className="v2-dash-card-head">
            <div>
              <h4>Coming up</h4>
              <p>{rollsOver ? "Early next month" : "Rest of the month"}</p>
            </div>
          </header>
          {upcoming.length === 0 ? (
            <p className="v2-dash-empty">Nothing on the books yet.</p>
          ) : (
            <ul className="v2-cal-up">
              {upcoming.map((a, i) => (
                <li key={i}>
                  <span className={`v2-cal-dot v2-cal-dot--${a.tone}`} aria-hidden />
                  <span className="v2-cal-up-day">{a.day}</span>
                  <span className="v2-cal-up-body">
                    <strong>{a.what}</strong>
                    <span>
                      {a.who} · {a.time}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </div>
  );
}
