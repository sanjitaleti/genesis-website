# Going live: Twilio → ElevenLabs → the portal

The code is written. What's left are the account and credential steps, which
only you can do — I never handle your keys.

**Until you finish these, nothing breaks.** The portal runs on demo data and
shows an orange **DEMO DATA** badge, so you can present it safely today and
switch to real numbers whenever the steps below are done.

---

## How the data flows

```
caller → Twilio number → ElevenLabs agent answers
                              │
                    call ends │ post-call webhook
                              ▼
              /api/webhooks/elevenlabs   (verifies signature)
                              │
                              ▼
                      Supabase: calls + appointments
                              │
                              ▼
                    /v2/dashboard  (reads only your org's rows)
```

---

## 1. Supabase (database + login)

1. Create a project at [supabase.com](https://supabase.com). Free tier is fine.
2. Open **SQL Editor**, paste the whole of `supabase/schema.sql`, and run it.
   That creates the tables and the row-level security that stops one client
   ever seeing another's calls.
3. Add your first client under **Table Editor → organizations**:
   - `name` — the client's business name, shown in the portal
   - `slug` — anything unique, e.g. `riverside-plumbing`
   - `plan` — `Lunar`, `Orbit`, or `Nova`
   - `elevenlabs_agent_id` — **leave blank for now**, filled in at step 2.4
4. Create their login under **Authentication → Users → Add user**. Use their
   real email and a password you share with them.
5. Link that user to the org: **Table Editor → profiles → Insert row**
   - `id` — the user's UUID from the Authentication tab
   - `org_id` — the organization's id from step 1.3

> One org per client. Repeat 1.3–1.5 for each new client; nothing else changes.

---

## 2. ElevenLabs (the agent)

### 2.1 Point Twilio at the agent
In ElevenLabs, go to **Agents → Phone Numbers** and connect your Twilio number.
ElevenLabs handles the call; Twilio is just the number.

### 2.2 Add the data-collection fields
This is the step that makes the dashboard meaningful. On your agent, open
**Analysis → Data collection** and add these fields *with exactly these names* —
the webhook reads them by name:

| Field name          | Type    | What to tell the agent to extract                     |
| ------------------- | ------- | ----------------------------------------------------- |
| `booking_made`      | Boolean | Did the caller actually book a job?                    |
| `quote_given`       | Boolean | Was a price or estimate given without booking?         |
| `passed_to_human`   | Boolean | Was the call handed off to a person?                   |
| `customer_name`     | String  | The caller's name                                      |
| `job_type`          | String  | Short description, e.g. "Burst pipe repair"            |
| `job_value`         | String  | Quoted or booked amount, e.g. "$680"                   |
| `appointment_time`  | String  | Booking date and time in ISO 8601                      |
| `job_duration_mins` | Number  | Expected job length in minutes                         |

Anything missing degrades gracefully: the call still records, it just shows as
a plain "Handled" call rather than a booking.

### 2.3 Create the webhook
**Settings → Webhooks → Create**, then:
- URL: `https://YOUR-DOMAIN/api/webhooks/elevenlabs`
- Enable the **post-call transcription** event
- **Copy the signing secret now** — it is shown only once

### 2.4 Connect the agent to the client
Copy the agent's ID from its ElevenLabs page into the `elevenlabs_agent_id`
column of that client's `organizations` row. This is how an incoming call is
matched to the right client — calls from an unrecognised agent are safely
ignored rather than landing in the wrong dashboard.

---

## 3. Environment variables

Copy `.env.example` to `.env.local` and fill in your own values:

```
NEXT_PUBLIC_SUPABASE_URL=        # Supabase → Project Settings → API
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # same page, "anon public" key
SUPABASE_SERVICE_ROLE_KEY=       # same page, "service_role" — server only
ELEVENLABS_WEBHOOK_SECRET=       # from step 2.3
```

> `SUPABASE_SERVICE_ROLE_KEY` bypasses all row-level security. Never prefix it
> `NEXT_PUBLIC_`, never paste it into client code, and never commit it.
> `.env.local` is already gitignored.

The moment `NEXT_PUBLIC_SUPABASE_URL` and the anon key are set, the portal
switches to real auth and live data, and the DEMO DATA badge disappears on its
own. No code change.

---

## 4. Deploying

**This app is no longer a static export.** It used to be `output: "export"`,
dropped onto IONOS as plain files. The portal now needs a server — it receives
webhooks, holds secrets, and reads per-user data behind a login, none of which
static files can do.

Marketing pages are still prerendered at build time, so nothing gets slower.
Only `/v2/dashboard` and `/api/*` are dynamic.

Deploy to any Node host. Vercel is the least friction:

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new), root directory
   `genesis-launchpad`.
3. Add the four variables from step 3 under **Settings → Environment Variables**.
4. Deploy, then put the real domain into the ElevenLabs webhook URL (step 2.3).

Your existing IONOS site is untouched by any of this — point the domain at
Vercel when you're ready to cut over.

---

## 5. Checking it works

Make one real call to the Twilio number and hang up. Within a few seconds:

- **ElevenLabs → Conversations** shows the call and the fields it extracted
- **Supabase → Table Editor → calls** shows a new row
- **`/v2/dashboard`** shows it in Calls and Live activity, with the badge gone

If nothing arrives, check in this order:

| Symptom                            | Cause                                                |
| ---------------------------------- | ---------------------------------------------------- |
| ElevenLabs shows a 401             | `ELEVENLABS_WEBHOOK_SECRET` doesn't match the webhook |
| 200 but no row appears             | `elevenlabs_agent_id` doesn't match the org's row     |
| Row exists but dashboard is empty  | The signed-in user has no `profiles` row for that org |
| Still shows DEMO DATA              | Supabase env vars missing on the deployed environment |

Server logs print `[elevenlabs]` lines for rejected or unmatched calls.

---

## 6. Resend (contact form + pricing intake emails)

The contact form and the "Get started" intake page both save to a new
`leads` table in Supabase and *try* to email you a notification on top of
that. The save always happens; the email is best-effort.

### 6.1 Run the leads table migration
Supabase → **SQL Editor** → paste the whole of `supabase/leads.sql` → Run.
(This is separate from `schema.sql`, which you already ran — this one's new.)

### 6.2 Create a Resend account
1. Go to [resend.com](https://resend.com) → sign up (free tier: 3,000
   emails/month, no card required)
2. **API Keys** → **Create API Key** → copy it

### 6.3 Add the environment variables
In `.env.local` (and later, Vercel's Environment Variables — same pattern as
every other key so far):

```
RESEND_API_KEY=            # from step 6.2
LEAD_NOTIFICATION_EMAIL=   # the inbox that should receive these — your email
```

That's enough to go live. Emails send from Resend's shared sandbox address
(`onboarding@resend.dev`) — it works immediately, no domain setup required,
but it'll show that address as the sender rather than something at
`genesislp.ai`.

### 6.4 Optional: send from your own domain
1. Resend → **Domains** → **Add Domain** → `genesislp.ai`
2. It'll give you DNS records (similar to the Vercel/Cloudflare dance from
   earlier) — add them in Cloudflare the same way
3. Once verified, set `RESEND_FROM_EMAIL=Genesis LP <hello@genesislp.ai>` (or
   whatever address you want) in the environment variables

### 6.5 Checking it works
Submit the contact form or a "Get started" intake at
`/v2/get-started/lunar`. Within a few seconds:
- **Supabase → Table Editor → leads** shows the new row
- Your inbox gets the notification email (check spam the first time — sandbox
  sender addresses sometimes land there until your own domain is verified)

If the row appears but no email arrives, `RESEND_API_KEY` or
`LEAD_NOTIFICATION_EMAIL` is likely missing on the deployed environment —
the submission is never lost either way, since Supabase is the source of
truth and email is only a notification on top of it.

---

## 7. Google sign-in

The "Continue with Google" button on the sign-in page is fully wired in
code — it calls Supabase's real OAuth flow. Right now clicking it shows
"Google sign-in isn't set up yet," because Supabase doesn't have Google
credentials configured. No code changes needed for this one, only account
setup.

### 7.1 Create the OAuth client
1. Go to [console.cloud.google.com](https://console.cloud.google.com) →
   create a project (or use an existing one)
2. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Under **Authorized redirect URIs**, add:
   ```
   https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
   ```
   (find `YOUR-PROJECT-REF` in your Supabase Project URL — it's the part
   before `.supabase.co`)
5. Create it, then copy the **Client ID** and **Client Secret**

### 7.2 Enable it in Supabase
1. Supabase → **Authentication → Providers → Google**
2. Toggle it on, paste the Client ID and Client Secret from 7.1
3. Save

### 7.3 Allow the redirect back to your site
Supabase → **Authentication → URL Configuration**:
- **Site URL**: `https://genesislp.ai`
- **Redirect URLs**: add `https://genesislp.ai/v2/welcome` (and
  `https://www.genesislp.ai/v2/welcome`, since both resolve)

Without this step Google sign-in will authenticate but then fail to redirect
back into the app.

### 7.4 Checking it works
Click "Continue with Google" on `/v2/sign-in` — it should take you to a real
Google account picker, then land you on `/v2/welcome` signed in. Note: a
Google login created this way has no matching `profiles` row automatically —
follow the same steps as adding any client (SETUP.md step 1.4–1.5) to link
that Google account to an organization, or it'll sign in to an empty
dashboard.

---

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
immediately instead of waiting on a confirmation email: go to **Authentication → Sign In / Providers** (not "Providers" alone — Supabase's current dashboard nests this under a "Sign In / Providers" page). Under the **User Signups** section, make sure **"Allow new users to sign up"** is on, then turn off **"Confirm email"** (it's a separate toggle in that same section, described as "Users will need to confirm their email address before signing in for the first time"). Also confirm the **Email** provider itself is enabled under the **Auth Providers** section on the same page — if it's off, email/password sign-in and sign-up won't work at all regardless of the Confirm-email setting. Click **Save changes** after any change on this page.

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

---

## Before the site goes public

Two placeholders are still in the marketing copy and should be replaced or
removed — they read as real and aren't:

- **`app/v2/(marketing)/page.tsx`** — three invented testimonials (Dana
  Morales, Priya Anand, Marcus Webb) attributed to businesses that don't exist.
- **`lib/v2/data.ts`** — the demo figures. Harmless while the badge is showing,
  but worth swapping for a real client's numbers once you have consent.
