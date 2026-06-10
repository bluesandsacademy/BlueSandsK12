import ShopContent from "@/components/shared/products/shop-content";

export const metadata = {
  title: "AR Media Shop — Immersive STEM Devices",
  description:
    "Preorder Blue Sands immersive EdTech devices for K–12: the AR Vision Headset, Smart Interactive Board, STEM Lab Kit, and Immersive Learning Tablet. Reserve with just a 30% deposit.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <div className="overflow-x-hidden">
      <ShopContent />
    </div>
  );
}
