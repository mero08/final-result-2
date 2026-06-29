import { Suspense } from 'react';
import NebulaBackground from '@/components/NebulaBackground';
import CustomCursor from '@/components/CustomCursor';
import ViewfinderHUD from '@/components/ViewfinderHUD';
import HeroSection from '@/components/HeroSection';
import CommandSidebar from '@/components/CommandSidebar';
import AboutSection from '@/components/AboutSection';
import ExpertiseSection from '@/components/ExpertiseSection';
import ReelsSection from '@/components/ReelsSection';
import ProjectsSection from '@/components/ProjectsSection';
import SystemLogs from '@/components/SystemLogs';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <div id="home" className="relative min-h-screen bg-background">
      <CustomCursor />
      <Suspense fallback={null}>
        <NebulaBackground />
      </Suspense>
      <ViewfinderHUD />
      <CommandSidebar />

      <main className="relative z-10">
        <HeroSection />

        <AboutSection />
        <ExpertiseSection />
        <ReelsSection />
        <ProjectsSection />
        <SystemLogs />
        <ContactSection />
      </main>
    </div>
  );
};

export default Index;
