import Link from "next/link";
import { MapPin, Mail, Phone, CalendarCheck, RefreshCw } from "lucide-react";
import { COMPANY, legalDocs } from "@/lib/legal";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";

// Stable anchor ids from section titles, so the contents list can link to them.
const anchor = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function Stamp({ Icon, label, value }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-secondary/10 px-4 py-2 text-sm font-bold text-secondary/70">
      <Icon className="w-4 h-4 text-primary" strokeWidth={2.5} />
      {label} <span className="text-secondary">{value}</span>
    </span>
  );
}

function ContactCard() {
  return (
    <div className="rounded-3xl bg-secondary text-white p-6 sm:p-8 not-prose">
      <p className="font-display font-bold text-lg">{COMPANY.name}</p>
      <ul className="mt-4 space-y-3 text-sm font-semibold text-white/80">
        <li className="flex items-start gap-3">
          <MapPin className="w-5 h-5 shrink-0 text-sunshine" strokeWidth={2.5} />
          {COMPANY.address}
        </li>
        <li className="flex items-center gap-3">
          <Mail className="w-5 h-5 shrink-0 text-sunshine" strokeWidth={2.5} />
          <a href={`mailto:${COMPANY.email}`} className="hover:text-white underline-offset-4 hover:underline">
            {COMPANY.email}
          </a>
        </li>
        <li className="flex items-center gap-3">
          <Phone className="w-5 h-5 shrink-0 text-sunshine" strokeWidth={2.5} />
          <a href={`tel:${COMPANY.phone.replace(/[^\d+]/g, "")}`} className="hover:text-white underline-offset-4 hover:underline">
            {COMPANY.phone}
          </a>
        </li>
      </ul>
    </div>
  );
}

export default function LegalDoc({ doc }) {
  const others = legalDocs.filter((d) => d.slug !== doc.slug);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky/25 via-cream to-cream">
        <div className="absolute top-16 left-8 w-10 h-10 bg-coral/20 blob-1 pointer-events-none" />
        <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-20">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <SectionKicker className="text-primary">Legal</SectionKicker>
            <h1 className="font-display font-bold text-secondary leading-[1.08] text-[2rem] sm:text-4xl lg:text-[2.9rem]">
              {doc.title}
            </h1>
            <div className="flex flex-wrap justify-center gap-2.5 pt-1">
              <Stamp Icon={CalendarCheck} label="Effective" value={doc.effective} />
              <Stamp Icon={RefreshCw} label="Last updated" value={doc.updated} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Document ── */}
      <section className="relative pb-16 sm:pb-20 lg:pb-24" style={{ background: "#FFFBF0" }}>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12 xl:gap-16">
            {/* Contents — sticky on desktop, collapsed above the fold on mobile */}
            <nav aria-label="Contents" className="hidden lg:block">
              <div className="sticky top-28 py-2">
                <p className="font-display font-bold text-sm uppercase tracking-[0.14em] text-secondary/70">
                  Contents
                </p>
                <ol className="mt-4 space-y-1.5 border-l-2 border-secondary/10">
                  {doc.sections.map((s, i) => (
                    <li key={s.title}>
                      <a
                        href={`#${anchor(s.title)}`}
                        className="block -ml-0.5 border-l-2 border-transparent pl-4 py-1 text-sm font-semibold text-gray-500 hover:text-primary hover:border-primary transition-colors"
                      >
                        <span className="text-gray-400 tabular-nums">{i + 1}.</span> {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            <article className="max-w-3xl">
              <p className="text-lg text-gray-600 font-semibold leading-relaxed border-l-4 border-primary/30 pl-5">
                {doc.intro}
              </p>

              <div className="mt-10 space-y-10">
                {doc.sections.map((s, i) => (
                  <section key={s.title} id={anchor(s.title)} className="scroll-mt-28">
                    <h2 className="font-display font-bold text-secondary text-xl sm:text-2xl leading-tight">
                      <span className="text-primary tabular-nums mr-2">{i + 1}.</span>
                      {s.title}
                    </h2>
                    {s.contact ? (
                      <div className="mt-5">
                        <ContactCard />
                      </div>
                    ) : (
                      <div className="mt-3 space-y-3">
                        {s.body.map((para) => (
                          <p key={para} className="text-gray-600 leading-relaxed">
                            {para}
                          </p>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
              </div>

              {/* Cross-links to the rest of the pack */}
              <div className="mt-16 pt-10 border-t-2 border-secondary/10">
                <p className="font-display font-bold text-secondary text-lg">
                  The rest of the policy pack
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {others.map((d) => (
                    <Link
                      key={d.slug}
                      href={`/legal/${d.slug}`}
                      className="rounded-full bg-white border-2 border-secondary/10 px-4 py-2 text-sm font-bold text-secondary/80 hover:border-primary hover:text-primary transition-colors"
                    >
                      {d.navLabel}
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
