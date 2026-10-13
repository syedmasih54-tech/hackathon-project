import React from 'react';
import Section1Hero from './Section1Hero.jsx';
import { useLenis } from '../../hooks/useLenis.js';

export default function LandingPage({
  onStartDemo,
  onNavigate,
  lang = 'en'
}) {
  // Sync Lenis smooth scroll
  useLenis(true);

  return (
    <div className="relative w-full bg-white text-brandInk overflow-x-hidden font-body">
      {/* SECTION 1: INTRO / PRELOADER HERO */}
      <Section1Hero
        onStartDemo={onStartDemo}
        lang={lang}
      />

      {/* Section 2 will be added here upon your 'next' command */}
    </div>
  );
}

