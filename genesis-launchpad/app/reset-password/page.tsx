import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/v2/ResetPasswordForm";
import { IconX } from "@/components/v2/icons";

export const metadata: Metadata = {
  title: { absolute: "Reset password · Genesis LP" },
  description: "Reset your Genesis LP password.",
};

export default function ResetPasswordPage() {
  return (
    <>

      <Link href="/sign-in" className="v2-auth-close" aria-label="Close and go back">
        <IconX />
      </Link>

      <div className="v2-content">
        <div className="v2-auth" style={{ gridTemplateColumns: "1fr" }}>
          <div className="v2-auth-form" style={{ margin: "0 auto", maxWidth: 460 }}>
            <Link
              href="/"
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
              <span
                aria-hidden
                style={{ width: 22, height: 22, borderRadius: 7, background: "var(--grad-brand)" }}
              />
              Genesis LP
            </Link>

            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </>
  );
}
