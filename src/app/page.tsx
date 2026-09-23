import Navbar from "@/components/ui/Navbar";
import Loader from "@/components/ui/Loader";
import GlobalScene from "@/components/3d/GlobalScene";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import StatsSection from "@/components/sections/StatsSection";
import ContactSection from "@/components/sections/ContactSection";
import { SectionObserver } from "@/components/interaction/SectionObserver";

export default function Home() {
  return (
    <>
      <Loader />
      <GlobalScene />
      <SectionObserver />
      <main className="relative z-10 flex min-h-screen flex-col overflow-x-hidden selection:bg-[#00E5FF] selection:text-black">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <StatsSection />
        <ContactSection />
      </main>
    </>
  );
}
