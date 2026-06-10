import ShopContent from "@/components/shared/products/shop-content";
import JsonLd from "@/components/common/json-ld";
import { productListSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata = {
  title: "AR Media Shop — Immersive STEM Devices",
  description:
    "Preorder Blue Sands immersive EdTech devices for K–12: the AR Vision Headset, Smart Interactive Board, STEM Lab Kit, and Immersive Learning Tablet. Reserve with just a 30% deposit.",
  alternates: { canonical: "/products" },
  openGraph: {
    type: "website",
    url: "/products",
    title: "AR Media Shop — Immersive STEM Devices",
    description:
      "Preorder Blue Sands immersive EdTech devices for K–12 schools and families across Nigeria.",
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
    </div>
  );
}
