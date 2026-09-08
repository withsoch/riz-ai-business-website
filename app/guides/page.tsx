import { Caveat } from "next/font/google";
import { getAllGuides } from "@/lib/guides";
import GuidesClient from "./GuidesClient";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-caveat",
});

export const metadata = {
  title: "Guides · Rizwan Mahmood",
  description: "Automation guides for engineers and founders. Practical, no fluff.",
};

export default function GuidesPage() {
  const guides = getAllGuides();
  return (
    <div className={caveat.variable}>
      <GuidesClient guides={guides} />
    </div>
  );
}
