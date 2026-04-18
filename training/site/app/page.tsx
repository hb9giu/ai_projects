import { AboutSection } from "@/components/AboutSection";
import { Hero } from "@/components/Hero";
import { JourneySection } from "@/components/JourneySection";
import { PortfolioSection } from "@/components/PortfolioSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <a href="#about" className="skip-link">
        Skip to content
      </a>
      <div className="noise" aria-hidden />
      <SiteHeader />
      <main>
        <Hero />
        <AboutSection />
        <JourneySection />
        <PortfolioSection />
        <SiteFooter />
      </main>
    </>
  );
}
