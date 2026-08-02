import "server-only";
import { Resend } from "resend";

/**
 * Email notifications for form submissions.
 *
 * Without RESEND_API_KEY set this silently no-ops rather than throwing — a
 * missing email service should never be the reason a lead's submission gets
 * lost. The submission is stored in Supabase regardless; email is a
 * best-effort notification on top of that, not the source of truth.
 */
export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendLeadEmail(subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  if (!key || !to) return false;

  const resend = new Resend(key);
  // Resend's shared sandbox sender works with zero setup; swap in a verified
  // genesislp.ai address once the domain is verified in Resend (see SETUP.md).
  const from = process.env.RESEND_FROM_EMAIL || "Genesis LP <onboarding@resend.dev>";

  const { error } = await resend.emails.send({ from, to, subject, html });
  if (error) {
    console.error("[resend] send failed:", error);
    return false;
  }
  return true;
}
