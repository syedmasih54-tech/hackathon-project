import React, { useState, useEffect, useRef } from 'react';
import Section1Hero from './Section1Hero.jsx';
import { useLenis } from '../../hooks/useLenis.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, ArrowDown, ChevronRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ─── Translation strings ───────────────────────────────────────────────────
const T = {
  en: {
    brandName: 'BenefitBridge',
    navHome: 'Home',
    navStatement: 'Statement',
    navJourney: 'The Journey',
    navPrinciples: 'Who Decides',
    openPortal: 'Citizen Portal →',
    langToggle: 'हिंदी (Hindi)',

    tagline: 'Every benefit, to the person it was meant for.',
    taglineHindi: 'हर हक, सही व्यक्ति तक।',
    navLabel: 'Open source welfare platform',

    // Section 2
    s2Caption1: 'Welfare, made reachable',
    s2Caption2: 'Voice-assisted case platform',
    s2Headline1: 'Welfare isn\'t failing for',
    s2Headline2: 'lack of money.',
    s2Headline3: 'It\'s failing at the',
    s2Headline4: 'last mile of paperwork.',
    s2Card1Title: 'Ration Card',
    s2Card1Name: 'Sunita Devi',
    s2Card1Status: 'Name mismatch flagged',
    s2Card2Title: 'Bank Passbook',
    s2Card2Name: 'Sunita D.',
    s2Card2Status: 'Passbook name differs',
    s2Card3Title: 'Readiness',
    s2Card3Pct: '60%',
    s2Card3Status: '3 of 5 pillars ready',

    // Section 3
    s3Focus: 'Our Focus',
    s3Line1: 'We keep our focus on',
    s3Line2: 'the last mile.',

    // Section 4
    s4Label: 'The journey',
    s4Title: 'Three Steps to Welfare Rights',
    s4Disclaimer: 'Prototype with dummy data. No real PII stored.',
    tickets: [
      {
        title: 'Eligibility',
        desc: 'Fixed, source-linked rules tell Sunita if she may qualify, and show why.',
        bullets: ['Hindi voice or tap input', 'Why? panel with official source', 'Never says "approved"'],
        stub: 'Next step: check eligibility',
        tag: 'Rules decide. AI only explains.',
      },
      {
        title: 'Document Doctor',
        desc: 'Reads the name on her documents and flags possible mismatches.',
        bullets: ['Reads ration card and passbook', 'She confirms every detail', 'Never called fraud'],
        stub: 'Next step: fix the name',
        tag: 'Rules decide. AI only explains.',
      },
      {
        title: 'Complaint Draft',
        desc: 'A Hindi draft from verified facts, filed by her, never automatically.',
        bullets: ['She reads and approves', 'Opens the official portal', '21-day follow-up reminder'],
        stub: 'Next step: escalate',
        tag: 'Rules decide. AI only explains.',
        cta: true,
      },
    ],

    // Section 5
    s5Tag: 'Core Architecture',
    s5Line1: 'Rules decide eligibility.',
    s5Line2: 'Citizens confirm the facts.',
    s5Line3: 'AI only',
    s5Line3i: 'explains and drafts.',

    // Section 6
    s6Title: 'Welfare, made reachable for all.',
    s6Sub: 'Open source. Self-hostable by NGOs, panchayats and service centres.',
    s6Cta: 'Open Citizen Portal →',
    s6FooterNote: 'Device-only storage · No Aadhaar collected · Hindi-first · 100% Client-Side Privacy',
  },

  hi: {
    brandName: 'बेनिफ़िट ब्रिज',
    navHome: 'शीर्ष',
    navStatement: 'उद्देश्य',
    navJourney: 'कार्यप्रणाली',
    navPrinciples: 'सिद्धांत',
    openPortal: 'नागरिक पोर्टल →',
    langToggle: 'English',

    tagline: 'हर हक, सही व्यक्ति तक।',
    taglineHindi: 'Every benefit, to the person it was meant for.',
    navLabel: 'ओपन सोर्स कल्याण प्लेटफ़ॉर्म',

    s2Caption1: 'कल्याण, पहुँच के भीतर',
    s2Caption2: 'आवाज़-सहायक केस प्लेटफ़ॉर्म',
    s2Headline1: 'कल्याण योजनाएं पैसों की',
    s2Headline2: 'कमी से नहीं,',
    s2Headline3: 'बल्कि कागज़ी',
    s2Headline4: 'आखिरी पड़ाव पर हारती हैं।',
    s2Card1Title: 'राशन कार्ड',
    s2Card1Name: 'सुनीता देवी',
    s2Card1Status: 'नाम में अंतर मिला',
    s2Card2Title: 'बैंक पासबुक',
    s2Card2Name: 'Sunita D.',
    s2Card2Status: 'पासबुक नाम अलग है',
    s2Card3Title: 'तैयारी स्तर',
    s2Card3Pct: '60%',
    s2Card3Status: '5 में से 3 स्तंभ तैयार',

    s3Focus: 'हमारा ध्येय',
    s3Line1: 'हम ध्यान रखते हैं',
    s3Line2: 'आखिरी पड़ाव का।',

    s4Label: 'कार्यप्रणाली',
    s4Title: 'हक पाने के तीन सरल चरण',
    s4Disclaimer: 'डमी डेटा के साथ प्रोटोटाइप। वास्तविक डेटा सुरक्षित रहता है।',
    tickets: [
      {
        title: 'पात्रता जांच',
        desc: 'नियम-आधारित प्रणाली बताती है कि नागरिक पात्र हैं या नहीं, और क्यों।',
        bullets: ['हिंदी आवाज़ या टच इनपुट', 'आधिकारिक स्रोत लिंक के साथ "क्यों?"', 'कभी भ्रमित नहीं करता'],
        stub: 'अगला कदम: पात्रता जांचें',
        tag: 'नियम तय करते हैं। AI केवल समझाता है।',
      },
      {
        title: 'दस्तावेज़ डॉक्टर',
        desc: 'दस्तावेज़ों पर नाम पढ़कर संभावित अंतर को समय रहते पहचानता है।',
        bullets: ['राशन कार्ड एवं पासबुक मिलान', 'नागरिक स्वयं पुष्टि करते हैं', 'कभी गलत आरोप नहीं'],
        stub: 'अगला कदम: नाम मिलान',
        tag: 'नियम तय करते हैं। AI केवल समझाता है।',
      },
      {
        title: 'शिकायत मसौदा',
        desc: 'सत्यापित तथ्यों से विनम्र हिंदी शिकायत मसौदा, सीधे नागरिक के नियंत्रण में।',
        bullets: ['नागरिक समीक्षा व स्वीकृति', 'आधिकारिक जनसुनवाई पोर्टल लिंक', '21 दिन का कैलेंडर रिमाइंडर'],
        stub: 'अगला कदम: शिकायत दर्ज करें',
        tag: 'नियम तय करते हैं। AI केवल समझाता है।',
        cta: true,
      },
    ],

    s5Tag: 'बुनियादी सिद्धांत',
    s5Line1: 'नियम पात्रता तय करते हैं।',
    s5Line2: 'नागरिक तथ्यों की पुष्टि करते हैं।',
    s5Line3: 'AI केवल',
    s5Line3i: 'समझाता और मसौदा बनाता है।',

    s6Title: 'कल्याण, समाज के हर वर्ग के लिए।',
    s6Sub: 'ओपन सोर्स। NGOs, पंचायतों और नागरिक सेवा केंद्रों द्वारा आसानी से उपयोग योग्य।',
    s6Cta: 'नागरिक पोर्टल खोलें →',
    s6FooterNote: 'डिवाइस-केवल डेटा · कोई आधार नहीं मांगा जाता · हिंदी-प्रथम · पूर्ण गोपनीयता',
  },
};

// ─── Seeded barcode SVG ─────────────────────────────────────────────────────
function Barcode({ seed = 42 }) {
  const bars = [];
  let x = 0;
  let s = seed;
  const lcg = () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
  while (x < 80) {
    const w = Math.round(lcg() * 3) + 1;
    const isBar = lcg() > 0.4;
    if (isBar) bars.push({ x, w });
    x += w + 1;
  }
  return (
    <svg viewBox="0 0 82 16" width="82" height="16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={16} fill="currentColor" />
      ))}
    </svg>
  );
}

// ─── Ticket card ────────────────────────────────────────────────────────────
function TicketCard({ ticket, index, lang, onTryDemo }) {
  const [torn, setTorn] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches) return;
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    gsap.to(cardRef.current, {
      rotateY: dx * 6,
      rotateX: -dy * 4,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'elastic.out(1,0.6)',
    });
  };

  return (
    <div
      ref={cardRef}
      className="ticket-card relative bg-white rounded-2xl select-none cursor-default w-full max-w-[320px] mx-auto border border-white/20 transition-all"
      style={{
        boxShadow: '0 20px 50px rgba(0,0,0,.14)',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top body */}
      <div className="p-6 pb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="micro-text text-brandRed font-bold uppercase tracking-widest font-body">
            STEP {String(index + 1).padStart(2, '0')}
          </span>
          <span className="w-2 h-2 rounded-full bg-brandRed/40"></span>
        </div>
        <h3 className="font-serif-italic text-brandRed text-[1.65rem] leading-tight mb-2.5">
          {ticket.title}
        </h3>
        <p className="font-body text-brandInk/75 text-sm leading-relaxed mb-4">
          {ticket.desc}
        </p>
        <ul className="space-y-2.5">
          {ticket.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm font-body text-brandInk/85">
              <span className="text-brandRed font-bold text-sm leading-none mt-0.5">›</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Perforation line */}
      <div className="relative h-px mx-0 border-0">
        <div className="absolute inset-0 border-t border-dashed border-brandInk/20" />
        <div className="absolute -left-3 -top-2.5 w-5 h-5 rounded-full bg-[#5FA3E8] shadow-inner" />
        <div className="absolute -right-3 -top-2.5 w-5 h-5 rounded-full bg-[#5FA3E8] shadow-inner" />
      </div>

      {/* Stub */}
      <div
        className={`p-5 transition-all duration-300 ${torn ? 'rotate-[6deg] translate-y-2' : ''}`}
        onClick={() => {
          if (ticket.cta) setTorn((t) => !t);
        }}
        style={{ cursor: ticket.cta ? 'pointer' : 'default' }}
      >
        <div className="flex items-center justify-between mb-2.5">
          <p className="micro-text text-brandInk/70 font-semibold font-body">{ticket.stub}</p>
          <div className="text-brandRed/50">
            <Barcode seed={42 + index * 17} />
          </div>
        </div>
        <p className="micro-text text-brandInk/45 italic font-body mb-2">{ticket.tag}</p>

        {ticket.cta && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTryDemo();
            }}
            className="mt-2 w-full py-2.5 px-4 rounded-xl bg-brandRed text-white font-body font-medium text-xs sm:text-sm hover:bg-deepRed transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            style={{ minHeight: '44px' }}
          >
            <span>{lang === 'hi' ? 'नागरिक पोर्टल खोलें' : 'Open Citizen Portal'}</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main LandingPage ────────────────────────────────────────────────────────
export default function LandingPage({
  onStartDemo,
  onNavigate,
  lang = 'hi',
  onToggleLang,
}) {
  // Sync Lenis smooth scroll
  useLenis(true);

  const t = T[lang] || T.hi;
  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Scroll animations ──────────────────────────────────────────────────
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // Refresh ScrollTrigger once DOM mounts
      ScrollTrigger.refresh();

      // Section 2 — headline mask reveal
      const lines = gsap.utils.toArray('.s2-line');
      lines.forEach((el, i) => {
        gsap.from(el, {
          yPercent: 105,
          opacity: 0,
          duration: 0.85,
          ease: 'expo.out',
          delay: i * 0.08,
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      });

      // Section 2 — document cards parallax rise
      const cards = gsap.utils.toArray('.s2-card');
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 70,
          opacity: 0,
          rotate: i === 0 ? -3 : i === 2 ? 3 : 1,
          duration: 0.95,
          ease: 'power3.out',
          delay: i * 0.12,
          scrollTrigger: {
            trigger: card,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        });
      });

      // Section 3 — word-by-word scrub
      const words = gsap.utils.toArray('.s3-word');
      if (words.length) {
        gsap.from(words, {
          opacity: 0.15,
          filter: 'blur(8px)',
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: {
            trigger: '#section3',
            start: 'top 65%',
            end: 'bottom 45%',
            scrub: 1,
          },
        });
      }

      // Section 4 — ticket fly-in
      const ticketCards = gsap.utils.toArray('.ticket-card');
      const startConfigs = [
        { x: '-25vw', rotateY: -30, rotateZ: -10, scale: 0.85 },
        { x: 0, rotateY: 0, rotateZ: 4, scale: 0.85 },
        { x: '25vw', rotateY: 30, rotateZ: 10, scale: 0.85 },
      ];
      ticketCards.forEach((card, i) => {
        const cfg = startConfigs[i] || startConfigs[1];
        gsap.from(card, {
          y: '50vh',
          x: cfg.x,
          rotateY: cfg.rotateY,
          rotateZ: cfg.rotateZ,
          scale: cfg.scale,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          delay: i * 0.15,
          scrollTrigger: {
            trigger: '#section4',
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        });
      });

      // Section 5 — mask lines
      gsap.utils.toArray('.s5-line').forEach((el, i) => {
        gsap.from(el, {
          yPercent: 110,
          opacity: 0,
          duration: 0.9,
          ease: 'expo.out',
          delay: i * 0.12,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });

      // Section 6 — fade in
      gsap.from('#section6 .s6-content', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#section6',
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      });
    });

    return () => ctx.revert();
  }, [lang]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full bg-white text-brandInk overflow-x-hidden font-body">

      {/* ── Top Navigation Bar (Clean UI & Accessible Controls) ── */}
      <nav
        className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-brandInk/10 px-4 sm:px-8 py-3 flex items-center justify-between transition-all"
        aria-label="Main Navigation"
      >
        {/* Brand */}
        <div
          onClick={() => scrollToSection('section1')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-brandRed text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
            BB
          </div>
          <div>
            <span className="font-extrabold text-sm sm:text-base text-brandInk tracking-tight block">
              {t.brandName}
            </span>
            <span className="text-[10px] text-brandInk/50 leading-none hidden sm:block">
              {t.tagline}
            </span>
          </div>
        </div>

        {/* Section Quick Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6 micro-text text-brandInk/70 font-medium">
          <button
            type="button"
            onClick={() => scrollToSection('section2')}
            className="hover:text-brandRed transition-colors"
          >
            {t.navStatement}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('section3')}
            className="hover:text-brandRed transition-colors"
          >
            {t.s3Focus}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('section4')}
            className="hover:text-brandRed transition-colors"
          >
            {t.navJourney}
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('section5')}
            className="hover:text-brandRed transition-colors"
          >
            {t.navPrinciples}
          </button>
        </div>

        {/* Right actions: Language Switcher & Direct Portal Entry */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle Button */}
          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brandRed/30 text-brandRed hover:bg-brandRed hover:text-white transition-all text-xs font-semibold shadow-sm active:scale-95"
            aria-label="Toggle Language"
            title="Switch Language (हिंदी / English)"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t.langToggle}</span>
          </button>

          {/* Open Citizen Portal button */}
          <button
            type="button"
            onClick={onStartDemo}
            className="px-3.5 sm:px-4 py-1.5 rounded-full bg-brandRed text-white text-xs sm:text-sm font-medium hover:bg-deepRed transition-all shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer"
            style={{ minHeight: '38px' }}
          >
            <span>{t.openPortal}</span>
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════
          SECTION 1: INTRO / PRELOADER HERO
      ════════════════════════════════════════════════════ */}
      <div id="section1">
        <Section1Hero
          onStartDemo={onStartDemo}
          lang={lang}
        />
      </div>

      {/* ════════════════════════════════════════════════════
          SECTION 2: STATEMENT (white)
      ════════════════════════════════════════════════════ */}
      <section id="section2" className="w-full bg-white px-6 sm:px-10 lg:px-20 py-20 lg:py-32 border-b border-brandInk/5">
        {/* Captions row */}
        <div className="flex items-start justify-between mb-12 max-w-7xl mx-auto">
          <span className="micro-text text-brandInk/50 font-body uppercase tracking-widest max-w-[200px]">
            {t.s2Caption1}
          </span>
          <span className="micro-text text-brandInk/50 font-body uppercase tracking-widest text-right max-w-[200px]">
            {t.s2Caption2}
          </span>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          {/* Headline */}
          <div>
            <div className="overflow-hidden mb-1">
              <p className="s2-line font-body text-[clamp(1.6rem,4vw,3.2rem)] font-light text-brandInk leading-tight">
                {t.s2Headline1}
              </p>
            </div>
            <div className="overflow-hidden mb-1">
              <p className="s2-line font-body text-[clamp(1.6rem,4vw,3.2rem)] font-light text-brandInk leading-tight">
                {t.s2Headline2}
              </p>
            </div>
            <div className="overflow-hidden mb-1">
              <p className="s2-line font-body text-[clamp(1.6rem,4vw,3.2rem)] font-light text-deepRed leading-tight">
                {t.s2Headline3}
              </p>
            </div>
            <div className="overflow-hidden">
              <p className="s2-line font-serif-italic text-[clamp(1.6rem,4vw,3.2rem)] text-deepRed leading-tight">
                {t.s2Headline4}
              </p>
            </div>

            <div className="mt-8 h-px bg-brandInk/10 w-24" />
            <p className="mt-5 font-body text-sm sm:text-base text-brandInk/60 max-w-md leading-relaxed">
              {t.tagline}
            </p>
          </div>

          {/* Document cards (Ration Card, Bank Passbook, Readiness) */}
          <div className="flex flex-col sm:flex-row gap-4 items-start" style={{ perspective: '800px' }}>
            <div
              className="s2-card flex-1 bg-white border border-brandInk/10 rounded-2xl p-5 w-full"
              style={{ boxShadow: '0 20px 45px rgba(0,0,0,.07)' }}
            >
              <p className="micro-text text-brandInk/40 uppercase tracking-widest mb-2 font-body">
                {t.s2Card1Title}
              </p>
              <p className="font-body font-bold text-brandInk text-base mb-1">
                {t.s2Card1Name}
              </p>
              <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-brandInk/5">
                <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 animate-pulse" />
                <span className="micro-text text-amber-800 font-medium font-body">{t.s2Card1Status}</span>
              </div>
            </div>

            <div
              className="s2-card flex-1 bg-white border border-brandInk/10 rounded-2xl p-5 w-full"
              style={{ boxShadow: '0 20px 45px rgba(0,0,0,.07)' }}
            >
              <p className="micro-text text-brandInk/40 uppercase tracking-widest mb-2 font-body">
                {t.s2Card2Title}
              </p>
              <p className="font-body font-bold text-brandInk text-base mb-1">
                {t.s2Card2Name}
              </p>
              <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-brandInk/5">
                <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 animate-pulse" />
                <span className="micro-text text-amber-800 font-medium font-body">{t.s2Card2Status}</span>
              </div>
            </div>

            <div
              className="s2-card flex-shrink-0 w-full sm:w-40 bg-white border border-brandInk/10 rounded-2xl p-5"
              style={{ boxShadow: '0 20px 45px rgba(0,0,0,.07)' }}
            >
              <p className="micro-text text-brandInk/40 uppercase tracking-widest mb-2 font-body">
                {t.s2Card3Title}
              </p>
              <p className="font-wordmark text-brandRed text-3xl leading-none mb-2">
                {t.s2Card3Pct}
              </p>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-brandRed rounded-full transition-all duration-700"
                  style={{ width: '60%' }}
                />
              </div>
              <p className="micro-text text-brandInk/60 font-body">{t.s2Card3Status}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 3: FOCUS (sky-blue gradient, scrubbed)
      ════════════════════════════════════════════════════ */}
      <section
        id="section3"
        className="w-full py-28 lg:py-44 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #ffffff 0%, #8FC3F7 60%, #5FA3E8 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto z-10">
          <p className="micro-text text-white/80 uppercase tracking-widest font-body mb-6 px-3 py-1 rounded-full bg-white/20 inline-block">
            {t.s3Focus}
          </p>
          <div className="text-white font-body font-light text-[clamp(1.8rem,5vw,3.6rem)] leading-snug">
            {[...t.s3Line1.split(' '), ...t.s3Line2.split(' ')].map((word, i, arr) => {
              const isLastPart = i >= arr.length - t.s3Line2.split(' ').length;
              return (
                <span
                  key={i}
                  className={`s3-word inline-block mr-[0.28em] ${isLastPart ? 'font-serif-italic font-normal' : ''}`}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 4: JOURNEY TICKETS
      ════════════════════════════════════════════════════ */}
      <section
        id="section4"
        className="w-full py-24 lg:py-36 px-6 sm:px-10"
        style={{ background: 'linear-gradient(to bottom, #5FA3E8 0%, #357ec7 100%)' }}
      >
        {/* Pill label & Section Heading */}
        <div className="text-center mb-12">
          <span
            className="font-serif-italic text-white text-sm px-5 py-2 rounded-full inline-block mb-3"
            style={{ border: '1px solid rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.08)' }}
          >
            {t.s4Label}
          </span>
          <h2 className="text-white text-xl sm:text-2xl font-body font-semibold">
            {t.s4Title}
          </h2>
        </div>

        {/* Ticket cards in 3D perspective row */}
        <div
          className="flex flex-col md:flex-row gap-6 items-stretch justify-center max-w-5xl mx-auto"
          style={{ perspective: '1200px' }}
        >
          {t.tickets.map((ticket, i) => (
            <TicketCard
              key={i}
              ticket={ticket}
              index={i}
              lang={lang}
              onTryDemo={onStartDemo}
            />
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-center mt-10 font-serif-italic text-white/60 text-sm">
          {t.s4Disclaimer}
        </p>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 5: WHO DECIDES (red full-bleed)
      ════════════════════════════════════════════════════ */}
      <section
        id="section5"
        className="w-full bg-brandRed px-6 sm:px-10 lg:px-20 py-24 lg:py-36"
      >
        <div className="max-w-5xl mx-auto space-y-6">
          <span className="micro-text text-white/70 uppercase tracking-widest font-body block mb-4">
            {t.s5Tag}
          </span>

          {[
            { text: t.s5Line1 },
            { text: t.s5Line2 },
            { text: t.s5Line3, italic: t.s5Line3i },
          ].map((item, i) => (
            <div key={i} className="overflow-hidden">
              <p className="s5-line font-body font-light text-white text-[clamp(1.7rem,5vw,3.5rem)] leading-tight">
                {item.text}{' '}
                {item.italic && (
                  <span className="font-serif-italic font-normal">{item.italic}</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 6: CLOSING (white)
      ════════════════════════════════════════════════════ */}
      <section id="section6" className="w-full bg-white px-6 sm:px-10 py-20 lg:py-32">
        <div className="s6-content max-w-3xl mx-auto text-center">
          <h3 className="font-serif-italic text-brandRed text-3xl sm:text-4xl mb-4">
            {t.s6Title}
          </h3>
          <p className="font-body text-brandInk/70 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            {t.s6Sub}
          </p>

          <button
            type="button"
            onClick={onStartDemo}
            className="px-8 sm:px-10 py-4 rounded-full bg-brandRed text-white font-body font-semibold text-base sm:text-lg hover:bg-deepRed transition-all shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
            style={{ minHeight: '52px' }}
          >
            {t.s6Cta}
          </button>
        </div>

        {/* Divider line */}
        <div className="max-w-6xl mx-auto mt-16 mb-4 h-px bg-brandInk/10" />
        <p className="text-center micro-text text-brandInk/40 font-body mb-8">
          {t.s6FooterNote}
        </p>

        {/* Giant wordmark at bottom — cropped */}
        <div className="w-full overflow-hidden" aria-hidden="true">
          <div
            className="font-wordmark uppercase text-brandRed select-none text-center leading-none translate-y-[38%] pointer-events-none"
            style={{ fontSize: 'clamp(5rem,20vw,17rem)', letterSpacing: '-0.03em' }}
          >
            <div>BENEFIT</div>
            <div>BRIDGE</div>
          </div>
        </div>
      </section>

    </div>
  );
}
