import React, { useCallback } from 'react';
import Particles from "@tsparticles/react"; // Use the new package
import { loadFull } from "tsparticles";

// Import Components
import NavigationBar from './components/NavigationBar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import FeaturesSection from './components/FeaturesSection';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

const particleOptions = {
    background: { color: { value: '#111827' } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' },
        resize: true,
      },
      modes: { repulse: { distance: 100, duration: 0.4 } },
    },
    particles: {
      color: { value: '#3b82f6' },
      links: { color: '#ffffff', distance: 150, enable: true, opacity: 0.2, width: 1 },
      move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, speed: 2 },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: { value: 0.3 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 5 } },
    },
    detectRetina: true,
};

function App() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="App">
      <Particles id="tsparticles" init={particlesInit} options={particleOptions} />
      
      <NavigationBar />

      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <ContactForm />
      </main>

      <Footer />
    </div>
  );
}

export default App;