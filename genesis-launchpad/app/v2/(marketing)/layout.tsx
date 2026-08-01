import { AuroraField } from "@/components/v2/AuroraField";
import { DockNav } from "@/components/v2/DockNav";
import { AiDock } from "@/components/v2/AiDock";

/** Chrome shared by every marketing page: ambient background, floating dock, AI panel. */
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <AuroraField />
      {children}
      <DockNav />
      <AiDock />
    </>
  );
}
