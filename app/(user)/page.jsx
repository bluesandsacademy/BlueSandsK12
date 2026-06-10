import K12HeroSection from "@/components/shared/k12-ar-pedia/hero";
import SocialProofTicker from "@/components/shared/k12-ar-pedia/social-proof-ticker";
import CountdownFloat from "@/components/shared/k12-ar-pedia/countdown-float";
import WhatIsSection from "@/components/shared/k12-ar-pedia/what-is";
import WhySwitchSection from "@/components/shared/k12-ar-pedia/why-switch";
import BenefitsSection from "@/components/shared/k12-ar-pedia/benefits";
import ProductExperienceSection from "@/components/shared/k12-ar-pedia/product-experience";
import ProductsTeaserSection from "@/components/shared/k12-ar-pedia/products-teaser";
import DistributionSection from "@/components/shared/k12-ar-pedia/distribution";
import CoordinatorSection from "@/components/shared/k12-ar-pedia/coordinator";
import WhatsAppSection from "@/components/shared/k12-ar-pedia/whatsapp";
import TestimonialsSection from "@/components/shared/k12-ar-pedia/testimonials";
import VisionSection from "@/components/shared/k12-ar-pedia/vision";
import K12PricingSection from "@/components/shared/k12-ar-pedia/pricing";
import FinalCtaSection from "@/components/shared/k12-ar-pedia/final-cta";
import StickyCta from "@/components/shared/k12-ar-pedia/sticky-cta";

export const metadata = {
  title:
    "Blue Sands K12 AR Pedia | Immersive AR Learning for Nigerian Children | Blue Sands STEM Labs",
  description:
    "Discover Blue Sands K12 AR Pedia — an augmented reality learning system for children ages 5–11. Immersive STEM education for schools, parents, and learning centers across Nigeria.",
};

export default function K12ArPediaPage() {
  return (
    <div className="overflow-x-hidden">
      <K12HeroSection />
      <SocialProofTicker />
      <WhatIsSection />
      <WhySwitchSection />
      <BenefitsSection />
      <ProductExperienceSection />
      <ProductsTeaserSection />
      <DistributionSection />
      <CoordinatorSection />
      <WhatsAppSection />
      <TestimonialsSection />
      <VisionSection />
      <K12PricingSection />
      <FinalCtaSection />
      <StickyCta />
      <CountdownFloat />
    </div>
  );
}
