import React, { useCallback } from 'react';
import Particles from "@tsparticles/react";
import { loadFull } from "tsparticles";

// Imports for NavigationBar and Footer are added back
import NavigationBar from '../components/NavigationBar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import FeaturesSection from '../components/FeaturesSection';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

function HomePage() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particleOptions = {
    background: {
      color: { value: '#111827' },
    },
    fpsLimit: 60,
    particles: {
      number: {
        value: 30,
        density: { enable: true, area: 800 },
      },
      color: { value: '#3b82f6' },
      shape: {
        type: ['circle', 'triangle', 'polygon'],
        options: {
            polygon: {
                sides: 5
            }
        }
      },
      opacity: {
        value: {min: 0.1, max: 0.3},
      },
      size: {
        value: { min: 10, max: 40 },
      },
      move: {
        enable: true,
        speed: 1,
        direction: 'top',
        straight: false,
        outModes: {
          default: 'out',
        },
        trail: {
            enable: true,
            fillColor: "#111827",
            length: 10
        }
      },
    },
    interactivity: {
        events: {
            onHover: {
                enable: true,
                mode: "slow"
            }
        },
        modes: {
            slow: {
                factor: 1,
                radius: 200
            }
        }
    },
    detectRetina: true,
  };

  return (
    <div className="App">
      <Particles id="tsparticles" init={particlesInit} options={particleOptions} />
      
      {/* NavigationBar is added back here */}
      <NavigationBar />
      
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <ContactForm />
      </main>

      {/* Footer is added back here */}
      <Footer />
    </div>
  );
}

export default HomePage;