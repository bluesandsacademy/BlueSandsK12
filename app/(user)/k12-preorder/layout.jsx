const TITLE = "Blue Sands K12 Pre-Order";
const DESCRIPTION =
  "Reserve Blue Sands K12 for your school. Choose a package, tell us your student numbers and launch timing, and our team follows up with pricing and next steps. A pre-order request, not a payment.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/k12-preorder" },
  openGraph: {
    type: "website",
    url: "/k12-preorder",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function K12PreorderLayout({ children }) {
  return children;
}
