import type { Metadata } from "next";
import Link from "next/link";
import { AuroraField } from "@/components/v2/AuroraField";
import { SignInForm } from "@/components/v2/SignInForm";
import { SpaceScene } from "@/components/v2/SpaceScene";
import { IconX } from "@/components/v2/icons";

export const metadata: Metadata = {
  title: { absolute: "Sign in to Genesis LP" },
  description: "Sign in to your Genesis LP dashboard.",
};

export default function V2SignIn() {
  return (
    <>
      <AuroraField />

      <Link href="/" className="v2-auth-close" aria-label="Close and go back">
        <IconX />
      </Link>

      <div className="v2-content">
        <div className="v2-auth">
          {/* ---------------------------------------- form side */}
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
              <span
                aria-hidden
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 7,
                  background: "var(--grad-brand)",
                }}
              />
              Genesis LP
            </Link>

            <SignInForm />
          </div>

          {/* ---------------------------------------- art side */}
          <aside className="v2-auth-art">
            <SpaceScene />
            <div className="v2-auth-art-grain" aria-hidden />
          </aside>
        </div>
      </div>
    </>
  );
}
