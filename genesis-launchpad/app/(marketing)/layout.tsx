import { Navbar } from "@/components/v2/Navbar";
import { AiDock } from "@/components/v2/AiDock";

/** Chrome shared by every marketing page: fixed top nav, page content, AI panel. */
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
      <AiDock />
    </>
  );
}
