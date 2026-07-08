import { notFound } from "next/navigation";
import { legalDocs, getLegalDoc } from "@/lib/legal";
import LegalDoc from "@/components/shared/legal/legal-doc";
import JsonLd from "@/components/common/json-ld";
import { breadcrumbSchema } from "@/lib/seo";

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return {};
  const canonical = `/legal/${doc.slug}`;
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title: doc.title,
      description: doc.description,
    },
  };
}

export default async function LegalPage({ params }) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  return (
    <div className="overflow-x-hidden">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: doc.navLabel, path: `/legal/${doc.slug}` },
        ])}
      />
      <LegalDoc doc={doc} />
    </div>
  );
}
