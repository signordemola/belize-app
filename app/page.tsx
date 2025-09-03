import HeroBanner from "@/components/home-page/hero";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <section className="h-[90dvh] bg-amber-600"></section>
      <section className="h-[90dvh] bg-pink-600"></section>
      <section className="h-[90dvh] bg-green-600"></section>
    </>
  );
}
