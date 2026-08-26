import type { Metadata } from "next";
import Link from "next/link";
import { CreateAccountForm } from "@/components/v2/CreateAccountForm";
import { GenesisLogo } from "@/components/v2/GenesisLogo";
import { IconX } from "@/components/v2/icons";

export const metadata: Metadata = {
  title: { absolute: "Create your account · Genesis LP" },
  description: "Create your Genesis LP account.",
};

export default function V2CreateAccount() {
  return (
    <>

      <Link href="/" className="v2-auth-close" aria-label="Close and go back">
        <IconX />
      </Link>

      <div className="v2-content">
        <div className="v2-auth">
          <div className="v2-auth-form">
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
              <span aria-hidden style={{ width: 22, height: 22, borderRadius: 7, background: "var(--grad-brand)" }} />
              Genesis LP
            </Link>

            <CreateAccountForm />
          </div>

          <aside className="v2-auth-art" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--ink-1)" }}>
            <GenesisLogo size={64} />
          </aside>
        </div>
      </div>
    </>
  );
}
