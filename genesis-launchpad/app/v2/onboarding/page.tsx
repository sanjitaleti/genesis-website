import type { Metadata } from "next";
import { AuroraField } from "@/components/v2/AuroraField";
import { OnboardingWizard } from "@/components/v2/OnboardingWizard";

export const metadata: Metadata = {
  title: { absolute: "Set up your account — Genesis LP" },
  description: "Tell us about your business and pick a look for your dashboard.",
};

export default function OnboardingPage() {
  return (
    <>
      <AuroraField />
      <div className="v2-content">
        <div className="v2-auth" style={{ gridTemplateColumns: "1fr" }}>
          <div className="v2-auth-form" style={{ margin: "0 auto", maxWidth: 560 }}>
            <OnboardingWizard />
          </div>
        </div>
      </div>
    </>
  );
}
