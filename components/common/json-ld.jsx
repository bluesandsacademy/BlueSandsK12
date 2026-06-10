// Renders one or more JSON-LD structured-data blocks.
// Pass a single schema object or an array of them.
export default function JsonLd({ data }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.filter(Boolean).map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Schema is built from trusted, static site data only.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
