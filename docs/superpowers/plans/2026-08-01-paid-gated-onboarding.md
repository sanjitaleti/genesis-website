# Paid-Gated Onboarding + Create Account Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Only clients who've actually bought a package get a working dashboard; everyone else can still create an account and onboard, but lands on a blurred dashboard behind a paywall pointing at pricing.

**Architecture:** A new `customers` allowlist table (email → plan) is written by a small internal admin page after a Calendly call closes. Onboarding matches the signed-in user's email against it to set `organizations.paid`. The dashboard reads that flag and either renders normally or renders demo data blurred behind a non-blurred overlay. A new email/password Create Account page joins the existing Google OAuth and demo-login paths into the same `hasProfile()`-driven onboarding gate that already exists.

**Tech Stack:** Next.js App Router (route handlers), Supabase (Postgres + Auth, `@supabase/supabase-js` service-role client for privileged writes), no test framework in this repo — verification is via `npx tsc --noEmit`, `npm run build`, real browser testing (`mcp__Claude_Browser__*`), and disposable Supabase records created/deleted via `admin.auth.admin.createUser`/`deleteUser`, matching this project's established convention.

## Global Constraints

- Every server-side write uses `serviceClient()` from `lib/v2/supabase-server.ts` (service-role key, bypasses RLS) — never trust client-supplied identity for who owns what; the caller's own identity always comes from `serverClient().auth.getUser()`.
- New tables get `alter table ... enable row level security;` with **no policies** when they're written exclusively by service-role server routes (matches `leads`).
- New env vars are additive and optional: every new feature must degrade gracefully when its env var is unset (matches `isConfigured()` / Resend / Google patterns already in the codebase) — nothing should error for existing deployments until the new env vars are actually set.
- No secrets pasted into chat — env values go directly into `.env.local` or Vercel's dashboard.
- Disposable test users/orgs created during verification are always deleted immediately after use (via `admin.auth.admin.deleteUser` + row deletion), never left in the database.
- Temporary verification scripts are copied into the project root (for `node_modules` resolution), run, then deleted (`rm -f`) — never committed.
- Existing orgs (Green City, etc.) must not be locked out by this change — the migration backfills `paid = true` for every org that exists at migration time.

---

### Task 1: Database migration — `customers` table + `organizations.paid`

**Files:**
- Create: `supabase/customers.sql`

**Interfaces:**
- Produces: table `public.customers(id, email, plan, paid_at, claimed_org_id, created_at)`; column `public.organizations.paid boolean not null default false`. Every later task that touches paid status reads/writes these.

- [ ] **Step 1: Write the migration file**

```sql
-- =====================================================================
-- Paid-customer allowlist + organization paid flag.
--
-- Run this in the Supabase SQL editor, same as onboarding.sql. Additive —
-- schema.sql and onboarding.sql have already been run.
--
-- `customers` is the manual record of who has actually bought a package,
-- written only by the internal admin page (/v2/admin) via the service-role
-- key. There's no billing processor wired up yet, so this is filled in by
-- hand after a Calendly call closes.
-- =====================================================================

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  plan text not null,
  paid_at timestamptz not null default now(),
  -- set once an account claims this row (either because the account
  -- already existed when marked paid, or because onboarding matched it
  -- later) — makes re-running "mark as paid" for the same email safe.
  claimed_org_id uuid references public.organizations,
  created_at timestamptz not null default now()
);

alter table public.customers enable row level security;
-- Deliberately no policies: only the service-role key touches this table.

alter table public.organizations
  add column if not exists paid boolean not null default false;

-- Grandfather in every org that exists today (Green City, any existing
-- test orgs) so this change doesn't lock out current clients.
update public.organizations set paid = true where paid = false;
```

- [ ] **Step 2: Ask the user to run it**

Tell the user: paste the contents of `supabase/customers.sql` into the
Supabase SQL editor and run it, the same way `onboarding.sql` was run
earlier. Wait for confirmation before continuing.

- [ ] **Step 3: Verify via a disposable script**

Write a temporary script, copy it to the project root, run it, then delete
it:

```javascript
// _verify_migration.mjs
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const env = fs.readFileSync(".env.local", "utf8");
const get = (k) => env.match(new RegExp(`^${k}=(.*)$`, "m"))?.[1]?.trim();
const admin = createClient(get("NEXT_PUBLIC_SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"));

const { data: orgs, error: orgsErr } = await admin.from("organizations").select("name, paid").limit(5);
console.log("organizations.paid sample:", orgs, orgsErr);

const { error: custErr } = await admin.from("customers").select("id").limit(1);
console.log("customers table reachable:", custErr === null, custErr);
```

Run: `cp <path>/_verify_migration.mjs ./_verify_migration.mjs && node _verify_migration.mjs && rm -f _verify_migration.mjs`

Expected: every existing org shows `paid: true`; the `customers` query
returns no error (table exists, empty or not).

- [ ] **Step 4: Commit**

```bash
git add supabase/customers.sql
git commit -m "Add customers allowlist table and organizations.paid column"
```

---

### Task 2: Onboarding-time paid matching

**Files:**
- Modify: `app/api/onboarding/route.ts`

**Interfaces:**
- Consumes: `public.customers(email, plan, claimed_org_id)` and `public.organizations.paid` from Task 1.
- Produces: `organizations.paid`/`organizations.plan` set correctly at org-creation time — Task 4 (dashboard gating) reads this.

- [ ] **Step 1: Add the customers lookup and use it when creating the org**

In `app/api/onboarding/route.ts`, after the existing "already onboarded"
check and before building the org insert, add a lookup by the caller's own
email (from their session, never from the request body) and use it to set
`paid`/`plan` on insert:

```typescript
  // Already onboarded — don't let a resubmit spawn a second organization.
  const { data: existing } = await db.from("profiles").select("id").eq("id", user.id).maybeSingle();
  if (existing) {
    return NextResponse.json({ error: "already onboarded" }, { status: 409 });
  }

  // Has this email already been marked paid (e.g. via the admin page after
  // a Calendly call closed)? If so, this org starts unlocked and picks up
  // whatever plan was recorded — never trust a client-supplied "paid" flag.
  const email = user.email?.trim().toLowerCase();
  const { data: customer } = email
    ? await db.from("customers").select("id, plan").eq("email", email).maybeSingle()
    : { data: null };

  // Slugs must be unique; a short random suffix avoids collisions between
  // two businesses that happen to share a name, without asking the user to
  // think about it.
  const slug = `${slugify(business)}-${Math.random().toString(36).slice(2, 7)}`;

  const { data: org, error: orgError } = await db
    .from("organizations")
    .insert({
      name: business,
      slug,
      theme_accent: accent,
      theme_mode: mode,
      paid: Boolean(customer),
      ...(customer ? { plan: customer.plan } : {}),
    })
    .select("id")
    .single();
```

Then, after the profile is successfully created (after the existing
`profileError` check), claim the customer row so it's traceable:

```typescript
  if (customer) {
    await db.from("customers").update({ claimed_org_id: org.id }).eq("id", customer.id);
  }

  return NextResponse.json({ ok: true });
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify with a disposable test user, through the real browser**

The onboarding route reads its caller from a cookie-bound session
(`serverClient()`), so the most direct way to exercise it is the same way
earlier onboarding work in this project was verified: through the browser,
not a raw HTTP script.

1. Write and run a temporary script that creates a disposable auth user via
   `admin.auth.admin.createUser({ email, password, email_confirm: true })`
   and inserts a matching `customers` row (`email`, `plan: "Orbit"`). Delete
   the script after running it.
2. In the browser pane, sign in as that user at `/v2/sign-in` (it'll be
   redirected into `/v2/onboarding` since there's no profile yet), complete
   the wizard.
3. Write and run a second temporary script that queries `organizations` for
   the org that got created and asserts `paid: true, plan: "Orbit"`, and
   that the `customers` row's `claimed_org_id` now points at it.
4. Clean up: delete the org, profile, customer row, and auth user.
5. Repeat steps 1–4 once more with an email that has no `customers` row at
   all, and confirm the resulting org has `paid: false` and the default
   plan (`"Lunar"`).

- [ ] **Step 4: Commit**

```bash
git add app/api/onboarding/route.ts
git commit -m "Match onboarding email against paid customers allowlist"
```

---

### Task 3: Portal data layer — `paid` flag and locked content

**Files:**
- Modify: `lib/v2/portal.ts`

**Interfaces:**
- Consumes: `organizations.paid` column (Task 1), existing `demoData()`, `buildLive()`, `LiveSource` type, `Accent`/`Mode` from `./theme`.
- Produces: `PortalData.paid: boolean` — Task 4 (Dashboard component) reads this to decide whether to blur.

- [ ] **Step 1: Add `paid` to the `PortalData` type**

In `lib/v2/portal.ts`, add the field:

```typescript
export type PortalData = {
  live: boolean;
  paid: boolean;
  business: string;
  plan: string;
  // ...unchanged...
```

- [ ] **Step 2: Set `paid: true` in `demoData()`**

Demo mode (Supabase unconfigured, or a fresh unauthenticated visit) is
never gated — only a real, unpaid org is. In `demoData()`'s return object,
add `paid: true,` right after `live: false,`.

- [ ] **Step 3: Include `paid` in the live org query and type**

Update `LiveSource`'s `org` type and the `fetchLive()` select:

```typescript
type LiveSource = {
  org: { name?: string; plan?: string; theme_accent?: string; theme_mode?: string; paid?: boolean } | null;
  rows: CallRow[];
  appts: Record<string, unknown>[];
};
```

```typescript
    db.from("organizations").select("name, plan, theme_accent, theme_mode, paid").maybeSingle(),
```

- [ ] **Step 4: Add `buildLocked()` — real identity/theme, demo content**

Add this function right after `buildLive` (it deliberately reuses
`demoData()`'s content so an unpaid org sees an enticing full dashboard,
not an empty one, while still showing their own business name and chosen
theme):

```typescript
/**
 * An unpaid org's dashboard: their real business name, plan, and chosen
 * theme, but demo content underneath — the caller (DashboardShell) is
 * responsible for actually blurring it and showing the paywall overlay.
 * Never touches `src.rows`/`src.appts`, so an unpaid org's real call data
 * is never rendered anywhere, even blurred.
 */
function buildLocked(org: LiveSource["org"], range: Range): PortalData {
  const demo = demoData(range);
  return {
    ...demo,
    paid: false,
    business: org?.name ?? demo.business,
    plan: org?.plan ?? demo.plan,
    themeAccent: (["mono", "punch", "cyan", "citrus"].includes(org?.theme_accent ?? "")
      ? org!.theme_accent
      : DEFAULT_ACCENT) as Accent,
    themeMode: (["dark", "light"].includes(org?.theme_mode ?? "") ? org!.theme_mode : DEFAULT_MODE) as Mode,
  };
}
```

- [ ] **Step 5: Set `paid: true` in `buildLive()` and route unpaid orgs to `buildLocked()`**

In `buildLive()`'s return object, add `paid: true,` right after `live: true,`
(this function is only reached for paid orgs after the next change).

Update `getPortalBundle()` to check `paid` before deciding which builder to
use:

```typescript
export async function getPortalBundle(): Promise<Record<Range, PortalData>> {
  if (!isConfigured()) return demoBundle();
  try {
    const src = await fetchLive();
    if (!src) return demoBundle();
    if (src.org && src.org.paid === false) {
      return Object.fromEntries(RANGES.map((r) => [r, buildLocked(src.org, r)])) as Record<Range, PortalData>;
    }
    return Object.fromEntries(RANGES.map((r) => [r, buildLive(src, r)])) as Record<Range, PortalData>;
  } catch (err) {
    console.error("[portal] falling back to demo data:", err);
    return demoBundle();
  }
}
```

(`src.org` can be `null`/`paid` can be `undefined` for a signed-in user with
no org row yet — that path shouldn't reach the dashboard at all, since
`hasProfile()` already redirects them to onboarding first, but falling
through to `buildLive` in that edge case is harmless since `fetchLive`'s
RLS-scoped queries would just return empty rows.)

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add lib/v2/portal.ts
git commit -m "Add paid flag to portal data, serving locked demo content for unpaid orgs"
```

---

### Task 4: Dashboard blur + paywall overlay

**Files:**
- Modify: `components/v2/dashboard/Dashboard.tsx`
- Modify: `app/v2/v2.css`

**Interfaces:**
- Consumes: `PortalData.paid` (Task 3) via `usePortalData()`.
- Produces: nothing consumed by later tasks — this is a leaf UI change.

- [ ] **Step 1: Read `paid` and set `data-locked` on the dashboard root**

In `DashboardShell` (`components/v2/dashboard/Dashboard.tsx`), the `data`
variable already comes from `usePortalData()`. Change the root element:

```tsx
    <div className="v2-dash" data-accent={accent} data-mode={mode} data-locked={!data.paid}>
      <div className="v2-dash-glow" aria-hidden />

      {!data.paid ? (
        <div className="v2-lock-overlay">
          <div className="v2-lock-card">
            <h2>Choose a plan to unlock your dashboard</h2>
            <p>
              This is a preview of what {data.business} will see once a plan is active. Talk to
              us and we&rsquo;ll get you set up.
            </p>
            <Link href="/v2/pricing" className="v2-btn v2-btn--lg">
              See pricing
            </Link>
          </div>
        </div>
      ) : null}

      {/* ------------------------------------------------------- sidebar */}
      <aside className="v2-dash-side">
```

(`Link` is already imported at the top of this file.)

- [ ] **Step 2: Add the blur + overlay CSS**

In `app/v2/v2.css`, insert this new section immediately before the existing
`Onboarding wizard` section header (search for
`Onboarding wizard\n   ---`):

```css
/* ---------------------------------------------------------------
   Paywall lock — unpaid orgs see their real theme, blurred, with a
   non-blurred overlay pointing at pricing
   --------------------------------------------------------------- */

.v2-dash[data-locked="true"] {
  position: relative;
}
.v2-dash[data-locked="true"] > .v2-dash-side,
.v2-dash[data-locked="true"] > .v2-dash-main {
  filter: blur(11px);
  pointer-events: none;
  user-select: none;
}

.v2-lock-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(var(--ink-rgb), 0.45);
}
.v2-lock-card {
  max-width: 420px;
  width: 100%;
  text-align: center;
  padding: 40px 34px;
  border-radius: 20px;
  border: 1px solid var(--line-2);
  background: rgba(var(--ink-rgb), 0.94);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
}
.v2-lock-card h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 650;
}
.v2-lock-card p {
  margin: 12px 0 24px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-dim);
}
```

- [ ] **Step 3: Typecheck and build**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `preview_stop` any running dev server, `rm -rf .next`, `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Browser-verify with a disposable unpaid test account**

Restart the dev server (`preview_start` with the `launchpad_dev`
configuration). Create a disposable test user via
`admin.auth.admin.createUser`, sign in as them in the browser pane, walk
through onboarding (any theme), and confirm:
- The dashboard renders visibly blurred (screenshot).
- A non-blurred card reading "Choose a plan to unlock your dashboard" sits
  on top, with a working link to `/v2/pricing`.
- The chosen theme's colors are still visible through the blur (confirm via
  `data-accent`/`data-mode` on `.v2-dash` in the DOM, same technique used
  for the earlier theme verification).

Then delete the test user, profile, and org.

- [ ] **Step 5: Commit**

```bash
git add components/v2/dashboard/Dashboard.tsx app/v2/v2.css
git commit -m "Blur the dashboard behind a pricing paywall for unpaid orgs"
```

---

### Task 5: Admin authentication

**Files:**
- Create: `lib/v2/admin-auth.ts`
- Create: `app/api/admin/session/route.ts`

**Interfaces:**
- Produces: `ADMIN_COOKIE_NAME: string`, `adminPasswordConfigured(): boolean`, `checkAdminPassword(candidate: string): boolean`, `adminCookieValue(): string`, `isValidAdminCookie(value: string | undefined): boolean` — consumed by Task 6 (mark-paid route) and Task 7 (admin page).

- [ ] **Step 1: Write the admin-auth helper**

```typescript
// lib/v2/admin-auth.ts
import "server-only";
import crypto from "crypto";

/**
 * A single shared password, not a Supabase user role — this gates one
 * internal tool used by one person today. `ADMIN_PASSWORD` unset means the
 * admin page is entirely unreachable (fails closed), same as every other
 * optional integration in this codebase.
 */

export const ADMIN_COOKIE_NAME = "v2-admin";

const sha256 = (value: string) => crypto.createHash("sha256").update(value).digest("hex");

const timingSafeStringEqual = (a: string, b: string) => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
};

export function adminPasswordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeStringEqual(sha256(candidate), sha256(expected));
}

/**
 * Derived from the password itself, so no separate signing secret is
 * needed — only someone who already knows ADMIN_PASSWORD can produce this
 * value. httpOnly keeps it out of reach of any client-side script.
 */
export function adminCookieValue(): string {
  return sha256(`v2-admin:${process.env.ADMIN_PASSWORD ?? ""}`);
}

export function isValidAdminCookie(value: string | undefined): boolean {
  if (!value || !adminPasswordConfigured()) return false;
  return timingSafeStringEqual(value, adminCookieValue());
}
```

- [ ] **Step 2: Write the session route**

```typescript
// app/api/admin/session/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  adminCookieValue,
  adminPasswordConfigured,
  checkAdminPassword,
} from "@/lib/v2/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!adminPasswordConfigured()) {
    return NextResponse.json({ error: "admin login is not configured" }, { status: 503 });
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body.password || !checkAdminPassword(body.password)) {
    return NextResponse.json({ error: "wrong password" }, { status: 401 });
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, adminCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/v2/admin-auth.ts app/api/admin/session/route.ts
git commit -m "Add shared-password admin session auth"
```

---

### Task 6: Admin mark-paid route

**Files:**
- Create: `app/api/admin/customers/route.ts`

**Interfaces:**
- Consumes: `ADMIN_COOKIE_NAME`, `isValidAdminCookie` (Task 5); `public.customers`/`public.organizations.paid` (Task 1).
- Produces: `POST /api/admin/customers` accepting `{ email: string; plan: string }`, returning `{ ok: true; matchedExistingOrg: boolean }` — consumed by Task 7 (admin page UI).

- [ ] **Step 1: Write the route**

```typescript
// app/api/admin/customers/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serviceClient } from "@/lib/v2/supabase-server";
import { ADMIN_COOKIE_NAME, isValidAdminCookie } from "@/lib/v2/admin-auth";

/**
 * Marks an email as paid, however it needs to work regardless of when the
 * client actually creates their own account:
 *
 *  - account + profile already exist  -> update that org's paid/plan now
 *  - account exists, no profile yet   -> upsert `customers`; picked up
 *                                        when onboarding runs
 *  - no account yet                   -> same as above
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PLANS = ["Lunar", "Orbit", "Nova"];

export async function POST(req: Request) {
  const store = await cookies();
  if (!isValidAdminCookie(store.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "not signed in as admin" }, { status: 401 });
  }

  let body: { email?: string; plan?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const plan = body.plan?.trim();

  if (!email || !plan || !PLANS.includes(plan)) {
    return NextResponse.json({ error: "a valid email and plan are required" }, { status: 400 });
  }

  const db = serviceClient();

  const { data: usersPage, error: usersError } = await db.auth.admin.listUsers({ perPage: 200 });
  if (usersError) {
    console.error("[admin/customers] failed to list users:", usersError);
    return NextResponse.json({ error: "could not check for an existing account" }, { status: 500 });
  }
  const existingUser = usersPage.users.find((u) => u.email?.toLowerCase() === email);

  let claimedOrgId: string | null = null;

  if (existingUser) {
    const { data: profile } = await db
      .from("profiles")
      .select("org_id")
      .eq("id", existingUser.id)
      .maybeSingle();

    if (profile) {
      const { error: orgError } = await db
        .from("organizations")
        .update({ paid: true, plan })
        .eq("id", profile.org_id);

      if (orgError) {
        console.error("[admin/customers] failed to mark org paid:", orgError);
        return NextResponse.json({ error: "could not update the organization" }, { status: 500 });
      }
      claimedOrgId = profile.org_id;
    }
  }

  const { error: upsertError } = await db
    .from("customers")
    .upsert(
      { email, plan, paid_at: new Date().toISOString(), claimed_org_id: claimedOrgId },
      { onConflict: "email" },
    );

  if (upsertError) {
    console.error("[admin/customers] failed to upsert customer:", upsertError);
    return NextResponse.json({ error: "could not save the customer record" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, matchedExistingOrg: Boolean(claimedOrgId) });
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify without the UI (curl-style, via a disposable script)**

With `ADMIN_PASSWORD` set in `.env.local` and the dev server running: write
a temporary script that POSTs to `/api/admin/session` to get a cookie,
then POSTs to `/api/admin/customers` with `{ email: "case-check@example.com",
plan: "Orbit" }` (no existing account), confirm `matchedExistingOrg: false`
and a `customers` row exists with that email lowercased. Then create a
disposable auth user + profile + org for that same email, re-run the same
mark-paid call, confirm `matchedExistingOrg: true` and the org's `paid` is
now `true`. Clean up everything created (customer row, org, profile, auth
user).

- [ ] **Step 4: Commit**

```bash
git add app/api/admin/customers/route.ts
git commit -m "Add admin mark-as-paid route"
```

---

### Task 7: Admin page UI

**Files:**
- Create: `app/v2/admin/page.tsx`
- Create: `components/v2/AdminPanel.tsx`

**Interfaces:**
- Consumes: `ADMIN_COOKIE_NAME`, `isValidAdminCookie` (Task 5); `POST /api/admin/session`, `POST /api/admin/customers` (Tasks 5–6).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Write the client panel component**

```tsx
// components/v2/AdminPanel.tsx
"use client";

import { useState } from "react";

const PLANS = ["Lunar", "Orbit", "Nova"];

export function AdminPanel({ initialAuthed }: { initialAuthed: boolean }) {
  const [authed, setAuthed] = useState(initialAuthed);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);

  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState(PLANS[0]);
  const [markBusy, setMarkBusy] = useState(false);
  const [markError, setMarkError] = useState("");
  const [markResult, setMarkResult] = useState("");

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginBusy) return;
    setLoginBusy(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error("bad password");
      setAuthed(true);
    } catch {
      setLoginError("That password isn't right.");
    } finally {
      setLoginBusy(false);
    }
  };

  const markPaid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (markBusy) return;
    setMarkBusy(true);
    setMarkError("");
    setMarkResult("");
    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, plan }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "request failed");
      setMarkResult(
        json.matchedExistingOrg
          ? `${email} already has an account — unlocked their dashboard now.`
          : `${email} is saved. Their dashboard unlocks as soon as they create an account.`,
      );
      setEmail("");
    } catch (err) {
      setMarkError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setMarkBusy(false);
    }
  };

  if (!authed) {
    return (
      <div className="v2-content">
        <div className="v2-wrap" style={{ paddingBlock: "clamp(104px, 15vh, 150px) 60px", maxWidth: 420 }}>
          <form className="v2-panel" style={{ padding: "34px 30px" }} onSubmit={login} noValidate>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Admin</h1>
            <div className="v2-field" style={{ marginTop: 20 }}>
              <label htmlFor="admin-password">Password</label>
              <div className="v2-input-wrap">
                <input
                  id="admin-password"
                  type="password"
                  className="v2-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            {loginError ? (
              <p className="v2-auth-error" role="alert">
                {loginError}
              </p>
            ) : null}
            <button
              type="submit"
              className="v2-btn v2-btn--block v2-btn--lg"
              disabled={loginBusy}
              style={{ marginTop: 14 }}
            >
              {loginBusy ? "Checking…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="v2-content">
      <div className="v2-wrap" style={{ paddingBlock: "clamp(104px, 15vh, 150px) 60px", maxWidth: 480 }}>
        <form className="v2-panel" style={{ padding: "34px 30px" }} onSubmit={markPaid} noValidate>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Mark a customer paid</h1>
          <p style={{ margin: "8px 0 0", fontSize: 13.5, color: "var(--text-dim)" }}>
            Unlocks the real dashboard for this email, whether they&rsquo;ve created an account
            yet or not.
          </p>

          <div className="v2-field" style={{ marginTop: 20 }}>
            <label htmlFor="admin-email">Email</label>
            <div className="v2-input-wrap">
              <input
                id="admin-email"
                type="email"
                className="v2-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@theirbusiness.com"
                required
              />
            </div>
          </div>

          <div className="v2-field">
            <label htmlFor="admin-plan">Plan</label>
            <div className="v2-input-wrap">
              <select id="admin-plan" className="v2-input" value={plan} onChange={(e) => setPlan(e.target.value)}>
                {PLANS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {markError ? (
            <p className="v2-auth-error" role="alert">
              {markError}
            </p>
          ) : null}
          {markResult ? <p style={{ fontSize: 13.5, color: "var(--text-dim)", marginTop: 4 }}>{markResult}</p> : null}

          <button
            type="submit"
            className="v2-btn v2-btn--block v2-btn--lg"
            disabled={markBusy}
            style={{ marginTop: 14 }}
          >
            {markBusy ? "Saving…" : "Mark as paid"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write the page (server component gate)**

```tsx
// app/v2/admin/page.tsx
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminPanel } from "@/components/v2/AdminPanel";
import { ADMIN_COOKIE_NAME, isValidAdminCookie } from "@/lib/v2/admin-auth";

export const metadata: Metadata = {
  title: { absolute: "Admin — Genesis LP" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const store = await cookies();
  const authed = isValidAdminCookie(store.get(ADMIN_COOKIE_NAME)?.value);
  return <AdminPanel initialAuthed={authed} />;
}
```

- [ ] **Step 3: Typecheck and build**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `preview_stop` any running dev server, `rm -rf .next`, `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Browser-verify**

With `ADMIN_PASSWORD` set in `.env.local`, restart the dev server and open
`/v2/admin`. Confirm: wrong password shows an error and doesn't proceed;
correct password reveals the mark-paid form; submitting a test email marks
it (confirm via a direct Supabase query on `customers`, then delete that
row).

- [ ] **Step 5: Commit**

```bash
git add app/v2/admin/page.tsx components/v2/AdminPanel.tsx
git commit -m "Add internal admin page for marking customers paid"
```

---

### Task 8: Create Account page

**Files:**
- Modify: `lib/v2/session.ts`
- Create: `components/v2/CreateAccountForm.tsx`
- Create: `app/v2/create-account/page.tsx`
- Modify: `components/v2/SignInForm.tsx`

**Interfaces:**
- Consumes: `isConfigured`, `browserClient` from `./supabase` (already imported in `session.ts`); existing `SignInResult` type.
- Produces: `createAccount(email: string, password: string): Promise<SignInResult>` in `lib/v2/session.ts`.

- [ ] **Step 1: Add `createAccount` to `lib/v2/session.ts`**

Add this function after `signInWithGoogle` (before `requestPasswordReset`):

```typescript
/**
 * Email/password self-serve signup. Supabase's "Confirm email" setting must
 * be turned off (see SETUP.md) for the returned session to be usable
 * immediately — otherwise this succeeds but the user can't sign in until
 * they click a confirmation link.
 */
export async function createAccount(email: string, password: string): Promise<SignInResult> {
  if (!isConfigured()) {
    return { ok: false, message: "Account creation isn't available in demo mode." };
  }

  const { error } = await browserClient().auth.signUp({
    email: email.trim(),
    password,
  });

  if (error) {
    return { ok: false, message: "Couldn't create that account — try a different email or a longer password." };
  }
  return { ok: true };
}
```

- [ ] **Step 2: Write `CreateAccountForm`**

```tsx
// components/v2/CreateAccountForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff } from "./icons";
import { createAccount } from "@/lib/v2/session";

export function CreateAccountForm() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }

    setBusy(true);
    setError("");

    const result = await createAccount(email, password);
    if (!result.ok) {
      setError(result.message);
      setBusy(false);
      return;
    }

    router.push("/v2/welcome");
  };

  return (
    <form className="v2-auth-inner" onSubmit={submit} noValidate>
      <h1 className="v2-display v2-in" style={{ ["--d" as string]: "0.05s", fontSize: "clamp(2.6rem, 5vw, 3.6rem)" }}>
        Create your account
      </h1>
      <p
        className="v2-in"
        style={{ ["--d" as string]: "0.14s", margin: "14px 0 34px", fontSize: "1.02rem", lineHeight: 1.6, color: "var(--text-dim)" }}
      >
        Use the same email you talked to us with, if you have one — it&rsquo;s how we match you up.
      </p>

      <div className="v2-in" style={{ ["--d" as string]: "0.22s" }}>
        <div className="v2-field">
          <label htmlFor="email">Email address</label>
          <div className="v2-input-wrap">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              className="v2-input"
              placeholder="you@yourcompany.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              required
            />
          </div>
        </div>

        <div className="v2-field">
          <label htmlFor="password">Password</label>
          <div className="v2-input-wrap">
            <input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              className="v2-input"
              placeholder="At least 8 characters"
              style={{ paddingRight: 50 }}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              required
            />
            <button
              type="button"
              className="v2-eye"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </div>

        <div className="v2-field">
          <label htmlFor="confirm">Confirm password</label>
          <div className="v2-input-wrap">
            <input
              id="confirm"
              name="confirm"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              className="v2-input"
              placeholder="Type it again"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                if (error) setError("");
              }}
              required
            />
          </div>
        </div>

        {error ? (
          <p className="v2-auth-error" role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" className="v2-btn v2-btn--block v2-btn--lg" disabled={busy}>
          {busy ? "Creating your account…" : "Create account"}
        </button>

        <p style={{ textAlign: "center", margin: "30px 0 0", fontSize: 14, color: "var(--text-faint)" }}>
          Already have an account?{" "}
          <Link href="/v2/sign-in" className="v2-link">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Write the page**

Mirror `app/v2/sign-in/page.tsx` exactly, swapping the form component:

```tsx
// app/v2/create-account/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { AuroraField } from "@/components/v2/AuroraField";
import { CreateAccountForm } from "@/components/v2/CreateAccountForm";
import { SpaceScene } from "@/components/v2/SpaceScene";
import { IconX } from "@/components/v2/icons";

export const metadata: Metadata = {
  title: { absolute: "Create your account — Genesis LP" },
  description: "Create your Genesis LP account.",
};

export default function V2CreateAccount() {
  return (
    <>
      <AuroraField />

      <Link href="/v2" className="v2-auth-close" aria-label="Close and go back">
        <IconX />
      </Link>

      <div className="v2-content">
        <div className="v2-auth">
          <div className="v2-auth-form">
            <Link
              href="/v2"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 44,
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text)",
                textDecoration: "none",
              }}
            >
              <span aria-hidden style={{ width: 22, height: 22, borderRadius: 7, background: "var(--grad-brand)" }} />
              Genesis LP
            </Link>

            <CreateAccountForm />
          </div>

          <aside className="v2-auth-art">
            <SpaceScene />
            <div className="v2-auth-art-grain" aria-hidden />

            <figure className="v2-quote">
              <div className="v2-quote-head">
                <div className="v2-quote-av" aria-hidden>
                  DM
                </div>
                <div>
                  <p className="v2-quote-name">Dana Morales</p>
                  <p className="v2-quote-handle">Morales Plumbing &amp; Heating</p>
                </div>
              </div>
              <blockquote className="v2-quote-body">
                &ldquo;We used to lose two or three jobs a week to voicemail. Now every call gets
                picked up, and I can see exactly what it booked while I was under a sink.&rdquo;
              </blockquote>
            </figure>
          </aside>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 4: Cross-link from Sign In**

In `components/v2/SignInForm.tsx`, replace the bottom "New to Genesis LP?"
paragraph:

```tsx
        <p
          style={{
            textAlign: "center",
            margin: "30px 0 0",
            fontSize: 14,
            color: "var(--text-faint)",
          }}
        >
          New to Genesis LP?{" "}
          <Link href="/v2/create-account" className="v2-link">
            Create an account
          </Link>{" "}
          or{" "}
          <Link href="/v2/contact" className="v2-link">
            talk to us
          </Link>
          .
        </p>
```

- [ ] **Step 5: Typecheck and build**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `preview_stop` any running dev server, `rm -rf .next`, `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Browser-verify end to end**

Restart the dev server. Visit `/v2/sign-in`, confirm the new "Create an
account" link goes to `/v2/create-account`. On that page, create a
disposable test account (a real, throwaway email/password), confirm it
redirects through `/v2/welcome` into `/v2/onboarding` (since the fresh
account has no profile yet). Confirm "Already have an account? Sign in"
goes back to `/v2/sign-in`. Delete the disposable auth user afterward.

- [ ] **Step 7: Commit**

```bash
git add lib/v2/session.ts components/v2/CreateAccountForm.tsx app/v2/create-account/page.tsx components/v2/SignInForm.tsx
git commit -m "Add email/password Create Account page"
```

---

### Task 9: Calendly embed on the intake success step

**Files:**
- Modify: `components/v2/IntakeForm.tsx`
- Modify: `.env.example`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_CALENDLY_URL` env var (new).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add the env var to `.env.example`**

Append to `.env.example`:

```
# --- Calendly (book-a-call step after the pricing intake form) ----------
# Public — embedded client-side. Leave unset and the intake success step
# falls back to plain "we'll reply within a business day" copy.
NEXT_PUBLIC_CALENDLY_URL=
```

- [ ] **Step 2: Embed the widget in the success state**

In `components/v2/IntakeForm.tsx`, add the import and constant at the top:

```tsx
"use client";

import { useState } from "react";
import Script from "next/script";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;
```

Replace the `if (sent)` block:

```tsx
  if (sent) {
    return (
      <div className="v2-panel" style={{ padding: "34px 30px" }}>
        <h3 style={{ margin: 0, fontSize: 19, fontWeight: 600 }}>Got it — thanks.</h3>
        <p style={{ margin: "10px 0 0", fontSize: 14.5, lineHeight: 1.65, color: "var(--text-dim)" }}>
          {CALENDLY_URL
            ? "Grab a time below and let's talk it through."
            : "We'll go through this and reply within one business day to set up your call."}
        </p>

        {CALENDLY_URL ? (
          <>
            <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
            <div
              className="calendly-inline-widget"
              data-url={CALENDLY_URL}
              style={{ minWidth: 320, width: "100%", height: 700, marginTop: 20 }}
            />
          </>
        ) : null}
      </div>
    );
  }
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Browser-verify both states**

With `NEXT_PUBLIC_CALENDLY_URL` unset: submit the intake form on
`/v2/get-started/lunar`, confirm the plain thank-you copy still shows (no
Calendly script requested — check `read_network_requests` for no
`calendly.com` request).

Set `NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/meridiansocial01/30min`
in `.env.local`, restart the dev server, submit again, confirm the Calendly
widget loads and is interactive (screenshot).

- [ ] **Step 5: Commit**

```bash
git add components/v2/IntakeForm.tsx .env.example
git commit -m "Embed Calendly booking on the pricing intake success step"
```

---

### Task 10: SETUP.md documentation

**Files:**
- Modify: `SETUP.md`
- Modify: `.env.example`

**Interfaces:**
- Consumes: nothing new — this documents Tasks 1–9 for the user.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Add `ADMIN_PASSWORD` to `.env.example`**

Append:

```
# --- Admin (internal "mark customer as paid" page at /v2/admin) ---------
# Pick any strong password. Unset means /v2/admin is entirely unreachable.
ADMIN_PASSWORD=
```

- [ ] **Step 2: Add a new numbered section to `SETUP.md`**

Insert a new `## 8. Paid customers, Calendly, and Create Account` section
after the existing `## 7. Google sign-in` section and before
`## Before the site goes public`:

```markdown
## 8. Paid customers, Calendly, and Create Account

Only clients who've actually bought a package get a working dashboard.
Everyone else can still create an account and go through onboarding, but
sees a blurred preview with a link back to pricing.

### 8.1 Run the customers table migration

Open **SQL Editor**, paste the whole of `supabase/customers.sql`, and run
it. This also backfills every existing organization to `paid = true`, so
current clients aren't affected.

### 8.2 Turn off "Confirm email"

So a freshly created account (via `/v2/create-account`) can sign in
immediately instead of waiting on a confirmation email: **Authentication →
Providers → Email**, turn off **Confirm email**.

### 8.3 Set an admin password

Add `ADMIN_PASSWORD` to `.env.local` (and to Vercel's environment
variables) — any strong password. This gates `/v2/admin`, the internal page
for marking a client paid after a Calendly call closes. Leaving it unset
makes that page entirely unreachable.

### 8.4 Add your Calendly link

Add `NEXT_PUBLIC_CALENDLY_URL` — your scheduling link, e.g.
`https://calendly.com/yourname/30min`. This is public (it's just embedded
on the page), so it's safe in the client bundle. Without it, the pricing
intake form falls back to plain "we'll reply within a business day" copy.

### 8.5 How marking someone paid works

1. A lead fills out the pricing intake form and books a call via the
   embedded Calendly widget.
2. If the call closes, go to `/v2/admin`, sign in with `ADMIN_PASSWORD`,
   and enter their email + plan.
3. If they already have an account, their dashboard unlocks immediately.
   If not, it unlocks automatically the moment they create an account
   (`/v2/create-account`) or sign in with Google using that same email and
   finish onboarding.

### 8.6 Checking it works

- Sign in as an account with no matching `customers` row → onboard → the
  dashboard should be visibly blurred with a "Choose a plan" link to
  `/v2/pricing`.
- Mark that same email as paid from `/v2/admin` → refresh the dashboard →
  it should unlock immediately, still showing their real theme.
```

- [ ] **Step 3: Commit**

```bash
git add SETUP.md .env.example
git commit -m "Document the paid-gated onboarding setup steps"
```
