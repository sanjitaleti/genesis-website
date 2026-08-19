"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { WarpField } from "./WarpField";
import { IconArrow, IconChart, IconUsers, IconPhone } from "./icons";
import { account as demoAccount, isSignedIn, hasProfile } from "@/lib/v2/session";
import { isConfigured, browserClient } from "@/lib/v2/supabase";

const beats = [
  {
    Icon: IconPhone,
    title: "Every call, logged",
    body: "Who rang, what they wanted, and how it ended, down to the overnight ones.",
  },
  {
    Icon: IconUsers,
    title: "Every customer, tracked",
    body: "Callers, jobs booked, and lifetime value, rolled up automatically.",
  },
  {
    Icon: IconChart,
    title: "The numbers that matter",
    body: "Answer rate, bookings, revenue recovered, all computed from real calls.",
  },
];

export function Welcome() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [business, setBusiness] = useState(demoAccount.business);
  const [plan, setPlan] = useState(demoAccount.plan);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      const signedIn = await isSignedIn();
      if (!alive) return;
      if (!signedIn) {
        router.replace("/sign-in");
        return;
      }

      const onboarded = await hasProfile();
      if (!alive) return;
      if (!onboarded) {
        router.replace("/onboarding");
        return;
      }

      // Real org, not the hardcoded demo one — a signed-in client should see
      // their own business name here, not whichever account this app was
      // last demoed with.
      if (isConfigured()) {
        const { data } = await browserClient().from("organizations").select("name, plan").maybeSingle();
        if (alive && data) {
          setBusiness(data.name);
          setPlan(data.plan);
        }
      }

      if (alive) setReady(true);
    })();

    return () => {
      alive = false;
    };
  }, [router]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const launch = () => {
    if (launched) return;
    setLaunched(true);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = window.setTimeout(
      () => router.push("/dashboard"),
      reduce ? 200 : 2100,
    );
  };

  if (!ready) return <div className="v2-welcome-hold" aria-hidden />;

  return (
    <div className={`v2-welcome${launched ? " is-launched" : ""}`}>
      <WarpField launched={launched} />

      <div className="v2-welcome-inner">
        <span className="v2-welcome-mark" aria-hidden />

        <p className="v2-welcome-eyebrow">{plan} plan · now live</p>

        <h1 className="v2-display v2-welcome-title">
          Welcome aboard,{" "}
          <span className="v2-grad-text">{business}.</span>
        </h1>

        <p className="v2-welcome-sub">
          Your receptionist has been answering since Tuesday. Here&rsquo;s what
          you&rsquo;ll find waiting inside.
        </p>

        <div className="v2-welcome-beats">
          {beats.map(({ Icon, title, body }, i) => (
            <div
              key={title}
              className="v2-welcome-beat"
              style={{ ["--d" as string]: `${0.45 + i * 0.13}s` }}
            >
              <Icon className="v2-welcome-beat-icon" />
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          ))}
        </div>

        <button type="button" className="v2-btn v2-btn--lg v2-welcome-cta" onClick={launch}>
          {launched ? "Opening your portal…" : "Next"}
          <IconArrow style={{ width: 18, height: 18 }} />
        </button>

        <p className="v2-welcome-foot">Takes you straight to your dashboard.</p>
      </div>

      <div className="v2-welcome-bloom" aria-hidden />
    </div>
  );
}
