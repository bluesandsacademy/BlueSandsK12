import ShopContent from "@/components/shared/products/shop-content";
import AudiencesSection from "@/components/shared/k12-ar-pedia/audiences";
import JsonLd from "@/components/common/json-ld";
import { productListSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "Shop AR Books — ARpedia Collection",
  description:
    "Shop the ARpedia collection: Into the Community, Into the Curiosity Q, and the 8-book AR Science Lab Kit. Augmented-reality books that bring STEM to life for kids ages 4–13, read with the Spotty tablet holder.",
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    url: "/products",
    title: "Shop AR Books — ARpedia Collection",
    description:
      "Augmented-reality books that bring STEM learning to life for children ages 4–13 across Nigeria.",
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
      <ShopContent />
      <AudiencesSection />
    </div>
  );
}
