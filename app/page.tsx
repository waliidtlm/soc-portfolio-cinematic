import Navbar from "@/components/Navbar";
import HeroExpand from "@/components/HeroExpand";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import SocOperations from "@/components/SocOperations";
import Certifications from "@/components/Certifications";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden">
        <HeroExpand />
        <Projects />
        <Skills />
        <SocOperations />
        <Certifications />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
