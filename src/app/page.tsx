import Navbar from "@/components/layout/Navbar";
import FloatingControls from "@/components/layout/FloatingControls";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Philosophy from "@/components/sections/Philosophy";
import Services from "@/components/sections/Services";
import ServiceDetails from "@/components/sections/ServiceDetails";
import Work from "@/components/sections/Work";
import Trust from "@/components/sections/Trust";
import Process from "@/components/sections/Process";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <Services />
        <ServiceDetails />
        <Work />
        <Trust />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <FloatingControls />
    </>
  );
}
