import K12HeroSection from "@/components/shared/k12-ar-pedia/hero";
import SocialProofTicker from "@/components/shared/k12-ar-pedia/social-proof-ticker";
import CountdownFloat from "@/components/shared/k12-ar-pedia/countdown-float";
import MetricsSection from "@/components/shared/k12-ar-pedia/metrics";
import DesignedForChildrenSection from "@/components/shared/k12-ar-pedia/designed-for-children";
import FeaturesSection from "@/components/shared/k12-ar-pedia/what-is";
import ComparisonSection from "@/components/shared/k12-ar-pedia/comparison";
import K12PricingSection from "@/components/shared/k12-ar-pedia/pricing";
import FinalCtaSection from "@/components/shared/k12-ar-pedia/final-cta";
import StickyCta from "@/components/shared/k12-ar-pedia/sticky-cta";

export const metadata = {
  title:
    "Blue Sands K12 AR Pedia | Revolutionizing STEM Learning with AR Books | Blue Sands STEM Labs",
  description:
    "Blue Sands K12 AR Pedia — an augmented reality learning system for children ages 5–11. Immersive STEM education for schools, parents, and learning centers across Nigeria.",
};

export default function K12ArPediaPage() {
  return (
    <div className="overflow-x-hidden">
      <K12HeroSection />
      <SocialProofTicker />
      <MetricsSection />
      <DesignedForChildrenSection />
      <FeaturesSection />
      <ComparisonSection />
      <K12PricingSection />
      <FinalCtaSection />
      <StickyCta />
      <CountdownFloat />
    </div>
  );
}
