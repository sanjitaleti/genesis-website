# Paid-gated onboarding + Create Account

## Problem

Today, anyone who signs in (via Google OAuth or the demo flow) and has no
`profiles` row gets sent through the self-serve onboarding wizard and lands
on a fully working dashboard — regardless of whether they've actually bought
a package. There's also no way to create an account by email/password; the
only paths in are Google OAuth or the hardcoded demo login.

We want: only clients who have actually bought a package get a working
dashboard. Everyone else can still create an account and go through
onboarding (name, business, theme), but lands on a **blurred preview** of the
dashboard with a paywall overlay pointing at pricing.

There's no billing processor wired up yet (Stripe was considered and
dropped for this round — see "Future work"). Instead, the qualifying flow
ends in a Calendly call with the founder, and "paid" status is granted
manually through a small internal admin page after the deal closes on that
call.

## Data model

### `customers` (new table)

The manual paid-allowlist. Written only by the admin page via the
service-role key — no RLS policies, same pattern as `leads`.

```sql
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  plan text not null,
  paid_at timestamptz not null default now(),
  -- set once an account claims this row, so re-running "mark as paid"
  -- for the same email is idempotent and traceable
  claimed_org_id uuid references public.organizations,
  created_at timestamptz not null default now()
);

alter table public.customers enable row level security;
-- Deliberately no policies: only the service-role key touches this table.
```

Email is normalized to lowercase/trimmed before insert and before every
lookup, so matching is case-insensitive.

### `organizations.paid` (new column)

```sql
alter table public.organizations
  add column if not exists paid boolean not null default false;

-- Grandfather in every org that already exists today (Green City, any
-- existing test orgs) so this change doesn't lock out current clients.
update public.organizations set paid = true;
```

## Flows

### A. Marketing funnel (anonymous, unchanged up to a point)

1. Pricing page "Get started" on any tier → existing intake form
   (`/v2/get-started/[plan]`), same qualifying questions as today, still
   saved to `leads`.
2. **New**: on successful intake submission, instead of just a thank-you
   message, the page shows an embedded Calendly widget
   (`https://calendly.com/meridiansocial01/30min`) so they can book a call
   with the founder right there. The Calendly URL comes from a
   `NEXT_PUBLIC_CALENDLY_URL` env var; if unset, the section is skipped and
   the page falls back to today's plain thank-you copy (same
   graceful-degradation pattern used for Resend/Supabase).
3. Nothing here creates an account or marks anyone paid — this stays a lead
   until the founder closes the deal on the call.

### B. Marking someone paid (internal, manual)

New page `/v2/admin`, gated by a shared password in `ADMIN_PASSWORD` (env
var). A simple form posts email + plan to `POST /api/admin/customers`,
which normalizes the email and handles three cases so it works regardless
of signup order:

1. **Account + profile already exist for that email** (found via
   `admin.auth.admin.listUsers` filtered by email, then `profiles`) → update
   that org's `organizations.paid = true` and `plan` directly. Also upsert
   the `customers` row with `claimed_org_id` set, for the record.
2. **Account exists, no profile yet** (mid-onboarding) → upsert `customers`
   row only; picked up automatically when onboarding runs (see Flow D).
3. **No account yet** → upsert `customers` row only; same as above, picked
   up whenever they do eventually onboard.

The admin route is server-only, uses the service-role client, and is not
linked from anywhere in the public nav.

**Admin auth**: a login form at `/v2/admin` posts a password to
`POST /api/admin/session`, which compares it to `ADMIN_PASSWORD` and, on
match, sets a short-lived signed httpOnly cookie. Middleware (or a check at
the top of the admin page/route) requires that cookie for both the admin
page and the `/api/admin/*` routes. This is deliberately simple — a shared
password, not a Supabase user role — matching the scope of a single
internal tool used by one person today.

### C. Create Account (new)

New page `/v2/create-account`, new `CreateAccountForm` component (visually
consistent with `SignInForm`): email, password, confirm password. Submits
via `supabase.auth.signUp({ email, password })`. Because Supabase's "Confirm
email" setting will be turned off (documented in SETUP.md, same as the
existing Google-provider toggle), the returned session is usable
immediately — no email round-trip. On success, redirects to `/v2/welcome`,
same as sign-in.

Cross-links:
- `SignInForm`: bottom copy changes to include a "Create an account" link
  to `/v2/create-account`, alongside the existing "Talk to us" link.
- `CreateAccountForm`: "Already have an account? Sign in" link back to
  `/v2/sign-in`.

Google OAuth sign-in is unaffected — it's just another way to end up
authenticated with no profile yet, same as today.

### D. Onboarding-time paid check

`POST /api/onboarding` (existing route) gains one step: after validating
the request but before creating the org, look up `customers` by the
caller's own email (from their authenticated session, not the request
body). On match:
- `organizations.paid = true`, `organizations.plan = customers.plan`
- update that `customers` row's `claimed_org_id` to the new org's id

No match → org is created exactly as today, with `paid` defaulting to
`false`. Either way, onboarding itself (name, business, theme picker)
behaves identically — paid status doesn't change that experience at all.

### E. Dashboard gating (the blur)

`PortalData` (in `lib/v2/portal.ts`) gains `paid: boolean`, sourced from
`organizations.paid` in `buildLive()`.

In `DashboardShell` (`components/v2/dashboard/Dashboard.tsx`):
- If `paid` is `true`: unchanged, renders real data exactly as today.
- If `paid` is `false`: **skip the live data fetch entirely** (no reason to
  query an unpaid org's near-empty tables) and render using the existing
  demo dataset (`demoData()`) instead, purely for visual richness. The
  dashboard root renders with a `data-locked="true"` attribute, which:
  - blurs the entire `.v2-dash` tree via CSS (`filter: blur(...)`,
    `pointer-events: none`, `user-select: none`)
  - renders a centered, non-blurred overlay on top: "Choose a plan to
    unlock your dashboard" + a button linking to `/v2/pricing`.

  The org's real theme (`theme_accent`/`theme_mode` chosen during
  onboarding) still applies underneath the blur — it's their dashboard,
  just locked, not a generic preview.

  Settings (including the theme picker) is not reachable while locked,
  since the whole `.v2-dash` is blurred and non-interactive — consistent
  with "they shouldn't be able to see the dashboard" from the original
  request. (If this proves too restrictive once it's live — e.g. they want
  to revisit their theme choice — that's a follow-up, not part of this
  change.)

## Out of scope / future work

- **Stripe checkout**: considered for this round, dropped in favor of
  Calendly + manual admin marking. The `customers` table and paid-matching
  logic are written so a future Stripe webhook could populate `customers`
  the same way the admin page does, without changing anything downstream
  (onboarding matching, dashboard gating).
- **Discount/pricing mechanics** (50% off month 2 for Lunar) — moot without
  a checkout flow; revisit whenever Stripe is actually wired up.
- Orbit/Nova stay "Talk to us" — no fixed self-serve price, unaffected by
  this change beyond sharing the new Calendly step.

## Testing

- Real disposable Supabase test users (created/deleted via
  `admin.auth.admin.createUser`/`deleteUser`), per this project's existing
  convention — no test users or orgs left behind.
- Verify all three admin-route orderings (account+profile exists / account
  no profile / no account) actually produce the right `paid` state.
- Verify existing Green City account is unaffected (`paid = true` after
  migration, dashboard renders normally, no blur).
- Verify a freshly onboarded, unmatched email lands on the blurred
  dashboard with a working link to `/v2/pricing`.
- Browser-verify: intake form → Calendly embed appears; create-account →
  sign-in cross-links both directions; admin page rejects wrong password
  and accepts the right one.
