import { notFound } from "next/navigation";
import { products, getProduct, fmtUSD } from "@/lib/products";
import ProductDetail from "@/components/shared/products/product-detail";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name.replace("Blue Sands ", "")} — ${fmtUSD(product.priceUSD)}`,
    description: product.blurb,
    alternates: { canonical: `/products/${product.slug}` },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <div className="overflow-x-hidden">
      <ProductDetail slug={product.slug} />
    </div>
  );
}
