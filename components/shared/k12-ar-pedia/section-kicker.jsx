/* A restrained, editorial eyebrow used above section headings.
   Quiet by design: one consistent muted tone, a calm weight, and no
   decoration — so the headline carries the weight and sections don't
   compete down the page. Single source of truth; only pass a `className`
   color override when a section's background genuinely needs it. */
export default function SectionKicker({ children, className = "" }) {
  return (
    <span
      className={`inline-block font-bold text-xs sm:text-sm uppercase tracking-[0.14em] text-secondary/70 ${className}`}
    >
      {children}
    </span>
  );
}
