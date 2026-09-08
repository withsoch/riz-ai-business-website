import { redirect } from "next/navigation";

// Legacy route - the live writing index is /blog (linked from the navbar).
// This stub keeps old /writing URLs working instead of serving a stale
// duplicate design of the same content.
export default function WritingRedirect() {
  redirect("/blog");
}
