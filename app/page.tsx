import MainFooter from "@/components/footer";
import Header from "@/components/header";
import CommunityImpactSection from "@/components/home-page/community-impact-section";
import FinancialSolutionsSection from "@/components/home-page/financial-solutions-section";
import HeroBannerSection from "@/components/home-page/hero-section";
import InnovationSection from "@/components/home-page/innovation-section";
import TestimonialsSection from "@/components/home-page/testimonials-section";
import { getUserSession } from "@/lib/session";

export default async function Home() {
  const session = await getUserSession();

  return (
    <>
      <Header session={session} />
      <HeroBannerSection />
      <div className="lg:hidden">
        {" "}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>

      <FinancialSolutionsSection />
      <InnovationSection />
      <TestimonialsSection />
      <CommunityImpactSection />
      <MainFooter />
    </>
  );
}
