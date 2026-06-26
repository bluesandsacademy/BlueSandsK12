import Link from "next/link";
import { Handshake, ArrowRight, Rocket } from "lucide-react";
import SectionKicker from "@/components/shared/k12-ar-pedia/section-kicker";
import CoordinatorSection from "@/components/shared/k12-ar-pedia/coordinator";
import K12PricingSection from "@/components/shared/k12-ar-pedia/pricing";
import DistributionSection from "@/components/shared/k12-ar-pedia/distribution";

export const metadata = {
  title:
    "Partnership — Join the Nigerian STEM Revolution | Blue Sands K12 AR Pedia",
  description:
    "Partner with Blue Sands K12 AR Pedia. Become a State Distribution Officer, explore pre-order options, and help bring immersive AR learning to schools across Nigeria.",
};

export default function PartnershipPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky/25 via-cream to-cream">
        <div className="absolute top-16 left-8 w-10 h-10 bg-coral/30 blob-1 kid-float pointer-events-none" />
        <div className="absolute top-32 right-12 w-7 h-7 bg-grape/40 rounded-full kid-float pointer-events-none" style={{ animationDelay: "0.8s" }} />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center">
          <SectionKicker className="text-primary">Become a Partner</SectionKicker>

          <h1 className="mt-5 font-display font-bold text-secondary leading-[1.05] text-4xl sm:text-5xl lg:text-6xl">
            Join the Nigerian{" "}
            <span className="text-primary doodle-underline">STEM Revolution</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-gray-600 font-semibold leading-snug">
            Bring immersive AR learning to schools and families in your region.
            Lead your state, build a network, and grow with Nigeria&apos;s fastest
            rising EdTech movement.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/apply"
              className="group inline-flex items-center gap-2 rounded-2xl bg-coral px-8 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_#d63a3f] hover:translate-y-0.5 hover:shadow-[0_5px_0_#d63a3f] transition-all"
            >
              <Handshake className="w-6 h-6" strokeWidth={2.5} />
              Become a State Distribution Officer
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-secondary font-display font-bold text-lg shadow-[0_8px_0_rgba(2,52,90,0.15)] hover:translate-y-0.5 hover:shadow-[0_5px_0_rgba(2,52,90,0.15)] transition-all border-2 border-secondary/10"
            >
              <Rocket className="w-5 h-5 text-primary" strokeWidth={2.5} />
              See Pricing
            </Link>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none">
          <svg viewBox="0 0 1440 110" preserveAspectRatio="none" className="w-full" style={{ height: 60 }}>
            <path
              fill="#FFFBF0"
              d="M0,50 C180,100 360,10 540,40 C720,70 900,110 1080,80 C1260,55 1380,20 1440,40 L1440,110 L0,110 Z"
            />
          </svg>
        </div>
      </section>

      {/* Distribution officer programme */}
      <CoordinatorSection />

      {/* Pre-order options */}
      <K12PricingSection />

      {/* Reach / interactive map */}
      <DistributionSection />

      {/* Closing CTA */}
      <section className="relative py-16 sm:py-20 text-center" style={{ background: "#FFFBF0" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <h2 className="font-display font-bold text-secondary text-3xl sm:text-4xl">
            Ready to lead your region?
          </h2>
          <p className="text-gray-600 font-semibold text-lg">
            Limited distribution positions are available per state.
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-9 py-4 text-white font-display font-bold text-lg shadow-[0_8px_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 hover:shadow-[0_5px_0_rgba(0,0,0,0.2)] transition-all"
          >
            Apply Now
            <ArrowRight className="w-6 h-6" strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </div>
  );
}
