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

## Before the site goes public

Two placeholders are still in the marketing copy and should be replaced or
removed — they read as real and aren't:

- **`app/v2/(marketing)/page.tsx`** — three invented testimonials (Dana
  Morales, Priya Anand, Marcus Webb) attributed to businesses that don't exist.
- **`lib/v2/data.ts`** — the demo figures. Harmless while the badge is showing,
  but worth swapping for a real client's numbers once you have consent.
