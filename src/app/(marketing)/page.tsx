import { Faq } from "@/modules/home/ui/sections/faq";
import { Advert } from "@/modules/home/ui/sections/advert";
import HowItWorks from "@/modules/home/ui/sections/how-it-works";
import HeroSection from "@/modules/home/ui/sections/hero-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <Advert />
      <HowItWorks />
      <Faq />
    </>
  );
}
