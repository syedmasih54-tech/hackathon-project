import React from 'react';
import {
  Globe,
  BarChart3,
  Trash2,
  Activity,
  Clock,
  Send,
  FileCheck2,
  CheckCircle2,
  Sparkles,
  Calculator,
  HelpCircle
} from 'lucide-react';

export default function Header({
  lang,
  onToggleLang,
  currentScreen,
  onNavigate,
  onOpenDeleteModal,
  onOpenSampleProfiles,
  onOpenCalculator,
  onOpenMitra
}) {
  const isHi = lang === 'hi';

  const sections = [
    {
      id: 'landing',
      activeScreens: ['landing'],
      targetScreen: 'landing',
      icon: Globe,
      label_hi: 'वेबसाइट परिचय',
      label_en: 'Site Tour'
    },
    {
      id: 'eligibility_group',
      activeScreens: ['consent', 'intake', 'eligibility', 'documents', 'readiness'],
      targetScreen: 'consent',
      icon: FileCheck2,
      label_hi: 'पात्रता एवं दस्तावेज़',
      label_en: 'Eligibility & Docs'
    },
    {
      id: 'status',
      activeScreens: ['status'],
      targetScreen: 'status',
      icon: Activity,
      label_hi: 'आवेदन स्थिति',
      label_en: 'Status Tracker'
    },
    {
      id: 'timeline',
      activeScreens: ['timeline'],
      targetScreen: 'timeline',
      icon: Clock,
      label_hi: 'साक्ष्य टाइमलाइन',
      label_en: 'Timeline'
    },
    {
      id: 'complaint',
      activeScreens: ['complaint'],
      targetScreen: 'complaint',
      icon: Send,
      label_hi: 'शिकायत निवारण',
      label_en: 'Grievance'
    },
    {
      id: 'dashboard',
      activeScreens: ['dashboard'],
      targetScreen: 'dashboard',
      icon: BarChart3,
      label_hi: 'डैशबोर्ड (नमूना)',
      label_en: 'Sample Stats'
    }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Top Branding & Utilities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3 border-b border-slate-100">
        {/* Brand Logo & Title */}
        <div
          onClick={() => onNavigate('landing')}
          className="cursor-pointer flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brandRed to-deepRed text-white flex items-center justify-center font-black text-base shadow-md shadow-red-200 group-hover:scale-105 transition-transform">
            BB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                BenefitBridge
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-red-50 text-brandRed border border-red-200 rounded-full">
                Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {isHi ? 'हर हक, सही व्यक्ति तक' : 'Every benefit, to the person it was meant for'}
            </p>
          </div>
        </div>

        {/* Global Controls & Interactive Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Demo Case Trigger */}
          <button
            type="button"
            onClick={onOpenSampleProfiles}
            title={isHi ? 'नमूना प्रोफ़ाइल भरें (Quick Demo)' : 'One-Click Demo Case'}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-600 animate-spin [animation-duration:8s]" />
            <span className="hidden md:inline">{isHi ? 'नमूना केस' : 'Demo Case'}</span>
          </button>

          {/* Scheme & Benefit Calculator Trigger */}
          <button
            type="button"
            onClick={onOpenCalculator}
            title={isHi ? 'योजना कैलकुलेटर' : 'Scheme Calculator'}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-blue-600" />
            <span className="hidden md:inline">{isHi ? 'कैलकुलेटर' : 'Calculator'}</span>
          </button>

          {/* Benefit Mitra Assistant Helpdesk Trigger */}
          <button
            type="button"
            onClick={onOpenMitra}
            title={isHi ? 'बेनिफ़िट मित्र (हेल्पलाइन एवं समाधान)' : 'Benefit Mitra (Helpdesk & Guides)'}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-brandRed border border-red-200 font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-brandRed" />
            <span className="hidden lg:inline">{isHi ? 'सहायता' : 'Help'}</span>
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            aria-label="Toggle language"
            className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 hover:border-brandRed hover:bg-red-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Globe className="w-4 h-4 text-brandRed" />
            <span>{isHi ? 'English' : 'हिन्दी'}</span>
          </button>

          {/* Delete My Case */}
          <button
            type="button"
            onClick={onOpenDeleteModal}
            title={isHi ? 'डेटा मिटाएं (IndexedDB वाइप)' : 'Wipe all data'}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-brandRed border border-slate-200 hover:border-red-200 flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isHi ? 'डेटा मिटाएं' : 'Wipe'}</span>
          </button>
        </div>
      </div>

      {/* DISTINCT SECTION NAVIGATION TABS */}
      <nav aria-label="Main sections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto scrollbar-none flex items-center gap-2">
        {sections.map((sec) => {
          const isActive = sec.activeScreens.includes(currentScreen);
          const IconComponent = sec.icon;

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => onNavigate(sec.targetScreen)}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-brandRed text-white shadow-md shadow-brandRed/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{isHi ? sec.label_hi : sec.label_en}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
