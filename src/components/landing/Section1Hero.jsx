import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Section1Hero({ onIntroComplete, onStartDemo, lang = 'en' }) {
  const containerRef = useRef(null);
  const redLayerRef = useRef(null);
  const whiteBandRef = useRef(null);
  const charsRedRef = useRef([]);
  const charsWhiteRef = useRef([]);
  const [isCompleted, setIsCompleted] = useState(() => {
    return typeof window !== 'undefined' && (
      sessionStorage.getItem('benefit_bridge_intro_seen') === 'true' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  });

  const word1 = 'BENEFIT';
  const word2 = 'BRIDGE';

  const handleSkip = () => {
    sessionStorage.setItem('benefit_bridge_intro_seen', 'true');
    setIsCompleted(true);
    document.body.style.overflow = '';
    if (redLayerRef.current) {
      redLayerRef.current.style.display = 'none';
    }
    if (whiteBandRef.current) {
      whiteBandRef.current.style.display = 'none';
    }
    const lettersUnder = charsWhiteRef.current.filter(Boolean);
    gsap.set(lettersUnder, { yPercent: 0, opacity: 1 });
    if (onIntroComplete) onIntroComplete();
  };

  useEffect(() => {
    if (isCompleted) {
      document.body.style.overflow = '';
      if (redLayerRef.current) {
        redLayerRef.current.style.display = 'none';
      }
      return;
    }

    // Lock scroll during intro
    document.body.style.overflow = 'hidden';

    // Collect letter elements
    const lettersTop = charsRedRef.current.filter(Boolean);
    const lettersUnder = charsWhiteRef.current.filter(Boolean);

    // Initial setup
    gsap.set(lettersTop, { yPercent: -115, opacity: 1 });
    gsap.set(lettersUnder, { yPercent: 0, opacity: 1 });
    gsap.set(whiteBandRef.current, { height: '1px', opacity: 1, scaleY: 1 });
    gsap.set(redLayerRef.current, { clipPath: 'inset(0% 0% 0% 0%)', display: 'flex' });

    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: () => {
        sessionStorage.setItem('benefit_bridge_intro_seen', 'true');
        setIsCompleted(true);
        document.body.style.overflow = '';
        if (redLayerRef.current) {
          redLayerRef.current.style.display = 'none';
        }
        if (onIntroComplete) onIntroComplete();
      }
    });

    // 1. Letters slide down staggered inside overflow-hidden wrappers (0s - 1.2s)
    tl.to(lettersTop, {
      yPercent: 0,
      duration: 1.05,
      stagger: 0.045,
      ease: 'expo.out'
    }, 0.2);

    // 2. Center line grows into white band at ~2.0s (height 0 to 45vh)
    tl.to(whiteBandRef.current, {
      height: '45vh',
      duration: 0.85,
      ease: 'power3.inOut'
    }, 2.0);

    // 3. Red layer wipes away from center line outward (inset 50% 0 50% 0)
    tl.to(redLayerRef.current, {
      clipPath: 'inset(50% 0% 50% 0%)',
      duration: 1.05,
      ease: 'expo.inOut'
    }, 2.3);

    // 4. Fade out white band seamlessly into the white page
    tl.to(whiteBandRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, 3.0);

    return () => {
      tl.kill();
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none bg-white"
      aria-label="BenefitBridge Introduction"
    >
      {/* ------------------------------------------------------------- */}
      {/* UNDER LAYER: White background with RED Wordmark */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0 bg-white flex flex-col justify-between p-6 sm:p-10 pointer-events-auto">
        {/* Top bar on revealed white page */}
        <div className="w-full flex items-center justify-between micro-text text-brandInk">
          <span className="font-medium tracking-tight">Open source</span>
          <div className="flex items-center gap-1.5" aria-label="BenefitBridge Arch">
            {/* Small Bridge-Arch Logo */}
            <svg
              className="w-5 h-4 text-brandRed"
              viewBox="0 0 24 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M2 14C5 6 9 3 12 3C15 3 19 6 22 14" />
              <path d="M7 14V8" />
              <path d="M17 14V8" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <span>Hindi-first</span>
            <span className="font-mono text-xs opacity-60">•••</span>
          </div>
        </div>

        {/* RED WORDMARK (revealed after wipe) */}
        <div className="w-full flex flex-col items-center justify-center my-auto">
          <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center font-wordmark text-brandRed uppercase leading-[0.88] tracking-[-0.035em]">
            <div className="overflow-hidden flex justify-center w-full">
              {word1.split('').map((char, i) => (
                <span
                  key={`white-w1-${i}`}
                  ref={(el) => (charsWhiteRef.current[i] = el)}
                  className="inline-block text-[clamp(3.8rem,14vw,11.5rem)] font-black"
                >
                  {char}
                </span>
              ))}
            </div>
            <div className="overflow-hidden flex justify-center w-full">
              {word2.split('').map((char, i) => (
                <span
                  key={`white-w2-${i}`}
                  ref={(el) => (charsWhiteRef.current[word1.length + i] = el)}
                  className="inline-block text-[clamp(3.8rem,14vw,11.5rem)] font-black"
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar on revealed white page */}
        <div className="w-full flex items-center justify-between micro-text text-brandInk/70">
          <span className="font-serif-italic text-sm text-brandInk">Welfare, made reachable</span>
          {/* 5 Dots with active dot larger */}
          <div className="flex items-center gap-2" aria-label="Step indicator">
            <span className="w-2 h-2 rounded-full bg-brandRed"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
          </div>
          <button
            type="button"
            onClick={onStartDemo}
            className="px-3 py-1.5 rounded-full bg-brandRed text-white font-medium hover:bg-deepRed transition-colors micro-text cursor-pointer"
          >
            Try the demo →
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TOP LAYER: RED FULL-SCREEN INTRO (Wipes away outward from center) */}
      {/* ------------------------------------------------------------- */}
      <div
        ref={redLayerRef}
        className="absolute inset-0 z-20 bg-brandRed flex flex-col justify-between p-6 sm:p-10 pointer-events-none"
        style={{
          clipPath: isCompleted ? 'inset(50% 0% 50% 0%)' : 'inset(0% 0% 0% 0%)',
          display: isCompleted ? 'none' : 'flex'
        }}
      >
        {/* Tiny white dash at top center */}
        <div className="w-full flex items-center justify-center relative">
          <div className="w-4 h-[2px] bg-white rounded-full opacity-90"></div>
          {/* Skip intro button */}
          <button
            type="button"
            onClick={handleSkip}
            aria-label="Skip introduction animation"
            className="absolute right-0 pointer-events-auto micro-text text-white/80 hover:text-white px-2.5 py-1 rounded-md border border-white/20 hover:border-white/50 transition-colors"
          >
            Skip intro
          </button>
        </div>

        {/* WHITE WORDMARK (slides down letter-by-letter) */}
        <div className="w-full flex flex-col items-center justify-center my-auto">
          <div className="w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center font-wordmark text-white uppercase leading-[0.88] tracking-[-0.035em]">
            <div className="overflow-hidden flex justify-center w-full">
              {word1.split('').map((char, i) => (
                <span
                  key={`red-w1-${i}`}
                  ref={(el) => (charsRedRef.current[i] = el)}
                  className="inline-block text-[clamp(3.8rem,14vw,11.5rem)] font-black"
                >
                  {char}
                </span>
              ))}
            </div>
            <div className="overflow-hidden flex justify-center w-full">
              {word2.split('').map((char, i) => (
                <span
                  key={`red-w2-${i}`}
                  ref={(el) => (charsRedRef.current[word1.length + i] = el)}
                  className="inline-block text-[clamp(3.8rem,14vw,11.5rem)] font-black"
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Middle 1px horizontal line crossing the screen */}
        <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-30 pointer-events-none">
          {/* White band that expands from height 0 to 45vh */}
          <div
            ref={whiteBandRef}
            className="absolute top-1/2 left-0 w-full -translate-y-1/2 bg-white"
            style={{ height: '1px' }}
          ></div>

          {/* Line overlay with Left/Center/Right metadata */}
          <div className="relative w-full border-t border-white/40 flex items-center justify-between px-6 sm:px-10 py-1.5 micro-text text-white">
            <span className="font-medium tracking-tight">Open source</span>
            <div className="flex items-center gap-1.5" aria-label="BenefitBridge Arch">
              <svg
                className="w-5 h-4 text-white"
                viewBox="0 0 24 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M2 14C5 6 9 3 12 3C15 3 19 6 22 14" />
                <path d="M7 14V8" />
                <path d="M17 14V8" />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span>Hindi-first</span>
              <span className="font-mono text-xs opacity-75">•••</span>
            </div>
          </div>
        </div>

        {/* Bottom row of 5 small dots (active dot is larger) */}
        <div className="w-full flex items-center justify-center gap-2 pb-2">
          <span className="w-2 h-2 rounded-full bg-white shadow-sm"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
        </div>
      </div>
    </section>
  );
}

