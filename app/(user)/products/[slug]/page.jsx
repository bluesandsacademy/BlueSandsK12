import { notFound } from "next/navigation";
import { products, getProduct } from "@/lib/products";
import { solutions, getSolution } from "@/lib/solutions";
import ProductDetail from "@/components/shared/products/product-detail";
import SolutionDetail from "@/components/shared/solutions/solution-detail";
import JsonLd from "@/components/common/json-ld";
import {
  productSchema,
  solutionSchema,
  breadcrumbSchema,
  productMetaTitle,
  solutionMetaTitle,
} from "@/lib/seo";

// One URL space for the whole catalogue: the ARpedia books and the school
// solutions both answer at /products/<slug>, but they render different
// templates because their content models have nothing in common.
export function generateStaticParams() {
  return [...products, ...solutions].map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = getProduct(slug) || getSolution(slug);
  if (!item) return {};
  const isSolutionPage = Boolean(getSolution(slug));
  const canonical = `/products/${item.slug}`;
  return {
    title: isSolutionPage ? solutionMetaTitle(item) : productMetaTitle(item),
    description: item.blurb,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      title: item.name,
      description: item.blurb,
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  const product = solution ? null : getProduct(slug);
  if (!solution && !product) notFound();

  const item = solution || product;

  return (
    <div className="overflow-x-hidden">
      <JsonLd
        data={[
          solution ? solutionSchema(slug) : productSchema(slug),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/products" },
            { name: item.name, path: `/products/${item.slug}` },
          ]),
        ]}
      />
      {solution ? <SolutionDetail slug={slug} /> : <ProductDetail slug={slug} />}
    </div>
  );
}
