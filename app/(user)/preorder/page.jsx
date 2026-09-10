import { permanentRedirect } from "next/navigation";

/*
 * The previous K12 AR Pedia bulk quote flow that lived here is retired. It is
 * kept in git history if we need it back. Every visitor is now sent to the
 * Blue Sands K12 platform pre-order form with a permanent (308) redirect so
 * search engines move any ranking signal to the new URL.
 */
export default function PreorderPage() {
  permanentRedirect("/k12-preorder");
}
