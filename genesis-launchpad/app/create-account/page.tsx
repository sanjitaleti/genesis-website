import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { AuroraField } from "@/components/v2/AuroraField";
import { CreateAccountForm } from "@/components/v2/CreateAccountForm";
import { SpaceScene } from "@/components/v2/SpaceScene";
import { IconX } from "@/components/v2/icons";

export const metadata: Metadata = {
  title: { absolute: "Create your account · Genesis LP" },
  description: "Create your Genesis LP account.",
};

export default function V2CreateAccount() {
  return (
    <>
      <AuroraField />

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

          <aside className="v2-auth-art">
            <SpaceScene />
            <div className="v2-auth-art-grain" aria-hidden />

            <figure className="v2-quote">
              <div className="v2-quote-head">
                <div className="v2-quote-av">
                  <Image src="/testimonials/dana-morales.jpg" alt="Dana Morales" width={42} height={42} />
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
