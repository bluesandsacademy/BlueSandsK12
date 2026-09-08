import { redirect } from "next/navigation";

/*
 * The previous K12 AR Pedia bulk quote flow that lived here is retired. It is
 * kept in git history if we need it back. Every visitor is now sent to the
 * Blue Sands K12 platform pre-order form.
 */
export default function PreorderPage() {
  redirect("/k12-preorder");
}
