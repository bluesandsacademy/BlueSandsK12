import { notFound } from "next/navigation";
import { products, getProduct } from "@/lib/products";
import ProductDetail from "@/components/shared/products/product-detail";
import JsonLd from "@/components/common/json-ld";
import { productSchema, breadcrumbSchema, productMetaTitle } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const canonical = `/products/${product.slug}`;
  return {
    title: productMetaTitle(product),
    description: product.blurb,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: product.name,
      description: product.blurb,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <div className="overflow-x-hidden">
      <JsonLd
        data={[
          productSchema(product.slug),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/products" },
            { name: product.name, path: `/products/${product.slug}` },
          ]),
        ]}
      />
      <ProductDetail slug={product.slug} />
    </div>
  );
}
