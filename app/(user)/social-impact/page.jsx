import ImpactHero from "@/components/shared/social-impact/hero";
import ImpactChallenge from "@/components/shared/social-impact/challenge";
import ImpactApproach from "@/components/shared/social-impact/approach";
import ImpactRegions from "@/components/shared/social-impact/regions";
import ImpactPartners from "@/components/shared/social-impact/partners";
import ImpactNumbers from "@/components/shared/social-impact/impact";
import ImpactVoices from "@/components/shared/social-impact/voices";
import ImpactGetInvolved from "@/components/shared/social-impact/get-involved";
import ImpactClosing from "@/components/shared/social-impact/closing";

export const metadata = {
  title:
    "Social Impact — Learning Without Limits Across Nigeria | Blue Sands K12 AR Pedia",
  description:
    "AR Pedia brings immersive, curriculum-aligned learning to children across Northern and Southern Nigeria, closing the gap between where a child is born and what they can become.",
};

export default function SocialImpactPage() {
  return (
    <div className="overflow-x-hidden">
      <ImpactHero />
      <ImpactChallenge />
      <ImpactApproach />
      <ImpactRegions />
      <ImpactPartners />
      <ImpactNumbers />
      <ImpactVoices />
      <ImpactGetInvolved />
      <ImpactClosing />
    </div>
  );
}
