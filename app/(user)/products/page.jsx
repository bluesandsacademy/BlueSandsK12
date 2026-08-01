import ShopContent from "@/components/shared/products/shop-content";
import SchoolsCta from "@/components/shared/products/schools-cta";
import JsonLd from "@/components/common/json-ld";
import { productListSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "Shop AR Books & Classroom Technology",
  description:
    "Shop the ARpedia collection: Into the Community, Into the Curiosity Q, and the 8-book AR Science Lab Kit. Plus classroom technology for schools: the Smart Blackboard and the Virtual Science Lab Tablet.",
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    url: "/products",
    title: "Shop AR Books & Classroom Technology",
    description:
      "Augmented-reality books for children ages 4–13, and the classroom technology Nigerian schools use to teach STEM.",
  },
};

export default function ProductsPage() {
  return (
    <div className="overflow-x-hidden">
      <JsonLd
        data={[
          productListSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/products" },
          ]),
        ]}
      />
      {/* One ending, not three. This page used to close with the app-store
          badges, then AudiencesSection's three buttons, then SchoolsCta's two,
          putting five competing calls to action and three "Book a Demo" links
          below the fold. AudiencesSection already runs on the home page, so the
          shop keeps a single close. */}
      <ShopContent />
      <SchoolsCta />
    </div>
  );
}
