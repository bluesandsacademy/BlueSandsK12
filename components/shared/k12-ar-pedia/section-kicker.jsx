/* A restrained, editorial eyebrow used above section headings.
   Uppercase, letter-spaced, accent-colored, with a short leading rule.
   Pass the accent via `className` (e.g. "text-primary"). */
export default function SectionKicker({ children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-bold text-xs sm:text-sm uppercase tracking-[0.18em] ${className}`}
    >
      <span className="h-px w-6 bg-current opacity-50" aria-hidden="true" />
      {children}
    </span>
  );
}
