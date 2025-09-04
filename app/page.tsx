import CommunityImpactSection from "@/components/home-page/community-impact-section";
import FinancialSolutionsSection from "@/components/home-page/financial-solutions-section";
import HeroBannerSection from "@/components/home-page/hero-section";
import InnovationSection from "@/components/home-page/innovation-section";
import TestimonialsSection from "@/components/home-page/testimonials-section";

export default function Home() {
  return (
    <>
      <HeroBannerSection />
      <FinancialSolutionsSection />
      <InnovationSection />
      <TestimonialsSection />
      <CommunityImpactSection />
    </>
  );
}
