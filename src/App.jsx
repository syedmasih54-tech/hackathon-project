import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import PrivacyBanner from './components/PrivacyBanner.jsx';
import DeleteModal from './components/DeleteModal.jsx';
import SampleProfileModal from './components/SampleProfileModal.jsx';
import SchemeCalculatorModal from './components/SchemeCalculatorModal.jsx';
import MitraAssistantDrawer from './components/MitraAssistantDrawer.jsx';
import Toast from './components/Toast.jsx';

import Screen1Consent from './components/screens/Screen1Consent.jsx';
import Screen2Intake from './components/screens/Screen2Intake.jsx';
import Screen3Eligibility from './components/screens/Screen3Eligibility.jsx';
import Screen4DocumentDoctor from './components/screens/Screen4DocumentDoctor.jsx';
import Screen5Readiness from './components/screens/Screen5Readiness.jsx';
import ScreenStatus from './components/screens/ScreenStatus.jsx';
import Screen6Timeline from './components/screens/Screen6Timeline.jsx';
import Screen7Complaint from './components/screens/Screen7Complaint.jsx';
import Screen9Dashboard from './components/screens/Screen9Dashboard.jsx';
import LandingPage from './components/landing/LandingPage.jsx';

import { Sparkles, HelpCircle } from 'lucide-react';

import {
  saveConsent,
  loadConsent,
  saveCaseData,
  loadCaseData,
  wipeCaseData
} from './services/db.js';

export default function App() {
  // Hindi is default language with English toggle
  const [lang, setLang] = useState('hi');
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [consentData, setConsentData] = useState(null);
  const [caseData, setCaseData] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isWiping, setIsWiping] = useState(false);

  // Interactive Modals & Drawer States
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [isMitraDrawerOpen, setIsMitraDrawerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Load saved state from device IndexedDB on initial mount
  useEffect(() => {
    async function initFromDb() {
      try {
        const savedConsent = await loadConsent();
        if (savedConsent) {
          setConsentData(savedConsent);
        }

        const savedCase = await loadCaseData();
        if (savedCase) {
          setCaseData(savedCase);
        }
      } catch (err) {
        console.warn('Initial IndexedDB load warning:', err);
      }
    }
    initFromDb();
  }, []);

  const handleToggleLang = () => {
    setLang(prev => (prev === 'hi' ? 'en' : 'hi'));
  };

  const handleSaveConsent = async (data) => {
    setConsentData(data);
    await saveConsent(data);
  };

  const handleSaveIntake = async (data) => {
    const updated = { ...caseData, ...data };
    setCaseData(updated);
    await saveCaseData(updated);
    setToast({
      message: lang === 'hi' ? 'आवेदन विवरण सुरक्षित हुआ' : 'Intake details saved to device',
      type: 'success'
    });
  };

  const handleSaveDocuments = async (data) => {
    const updated = { ...caseData, ...data };
    setCaseData(updated);
    await saveCaseData(updated);
    setToast({
      message: lang === 'hi' ? 'दस्तावेज़ एवं नाम मिलान सुरक्षित' : 'Documents & name verification saved',
      type: 'success'
    });
  };

  // Full Privacy Wipe: wipes IndexedDB and resets memory
  const handleWipeAllData = async () => {
    setIsWiping(true);
    await wipeCaseData();
    setConsentData(null);
    setCaseData({});
    setIsDeleteModalOpen(false);
    setIsWiping(false);
    setCurrentScreen('consent');
    setToast({
      message: lang === 'hi' ? 'सभी डेटा स्थायी रूप से मिटा दिया गया' : 'All device case records wiped',
      type: 'success'
    });
  };

  // One-Click Sample Profile Selection
  const handleSelectSampleProfile = async (profileData) => {
    setCaseData(profileData);
    await saveCaseData(profileData);

    const consent = {
      agreeBasics: true,
      allowCamera: true,
      allowAiDocs: true,
      allowVoice: true,
      timestamp: new Date().toISOString()
    };
    setConsentData(consent);
    await saveConsent(consent);

    setCurrentScreen('intake');
    setToast({
      message: lang === 'hi'
        ? `${profileData.ration_name || 'नागरिक'} का नमूना डेटा लोड हो गया!`
        : `Sample profile loaded for ${profileData.ration_name || 'citizen'}!`,
      type: 'success'
    });
  };

  // Scheme Calculator Selection
  const handleSelectScheme = async (schemeId) => {
    const updated = { ...caseData, selectedScheme: schemeId };
    setCaseData(updated);
    await saveCaseData(updated);
    setCurrentScreen('intake');
    setToast({
      message: lang === 'hi' ? 'योजना सफलतापूर्वक चुनी गई' : 'Target scheme updated',
      type: 'success'
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-red-100 selection:text-red-900 relative">
      {/* LANDING PAGE ROUTE */}
      {currentScreen === 'landing' ? (
        <LandingPage
          onStartDemo={() => setCurrentScreen('consent')}
          onNavigate={setCurrentScreen}
          lang={lang}
          onToggleLang={handleToggleLang}
        />
      ) : (
        <>
          {/* Top Application Header */}
          <Header
            lang={lang}
            onToggleLang={handleToggleLang}
            currentScreen={currentScreen}
            onNavigate={setCurrentScreen}
            onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
            onOpenSampleProfiles={() => setIsSampleModalOpen(true)}
            onOpenCalculator={() => setIsCalculatorModalOpen(true)}
            onOpenMitra={() => setIsMitraDrawerOpen(true)}
          />

          {/* Stepped Progress Bar (Shown during the 7-step citizen flow) */}
          {currentScreen !== 'dashboard' && (
            <ProgressBar
              currentStepId={currentScreen}
              onStepClick={setCurrentScreen}
              lang={lang}
            />
          )}

          {/* Main Screen Content */}
          <main className="flex-1 pb-20 bg-slate-50">
            {/* Persistent Privacy Banner at top of each flow screen */}
            {currentScreen !== 'dashboard' && (
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
                <PrivacyBanner lang={lang} />
              </div>
            )}

            {/* Screen 1: CONSENT */}
            {currentScreen === 'consent' && (
              <Screen1Consent
                consentData={consentData}
                onSaveConsent={handleSaveConsent}
                onNext={() => setCurrentScreen('intake')}
                onOpenSampleProfiles={() => setIsSampleModalOpen(true)}
                onOpenCalculator={() => setIsCalculatorModalOpen(true)}
                lang={lang}
              />
            )}

            {/* Screen 2: INTAKE FORM */}
            {currentScreen === 'intake' && (
              <Screen2Intake
                initialData={caseData}
                onSaveIntake={handleSaveIntake}
                onNext={() => setCurrentScreen('eligibility')}
                onBack={() => setCurrentScreen('consent')}
                onOpenSampleProfiles={() => setIsSampleModalOpen(true)}
                lang={lang}
                allowVoice={consentData?.allowVoice ?? true}
              />
            )}

            {/* Screen 3: ELIGIBILITY RESULT */}
            {currentScreen === 'eligibility' && (
              <Screen3Eligibility
                userData={caseData}
                onNext={() => setCurrentScreen('documents')}
                onBack={() => setCurrentScreen('intake')}
                lang={lang}
              />
            )}

            {/* Screen 4: DOCUMENT DOCTOR */}
            {currentScreen === 'documents' && (
              <Screen4DocumentDoctor
                caseData={caseData}
                onSaveDocuments={handleSaveDocuments}
                onNext={() => setCurrentScreen('readiness')}
                onBack={() => setCurrentScreen('eligibility')}
                lang={lang}
                allowAiDocs={consentData?.allowAiDocs ?? true}
              />
            )}

            {/* Screen 5: READINESS CARD */}
            {currentScreen === 'readiness' && (
              <Screen5Readiness
                caseData={caseData}
                onNext={() => setCurrentScreen('status')}
                onBack={() => setCurrentScreen('documents')}
                lang={lang}
              />
            )}

            {/* Dedicated Section: APPLICATION STATUS TRACKER */}
            {currentScreen === 'status' && (
              <ScreenStatus
                caseData={caseData}
                onNavigate={setCurrentScreen}
                lang={lang}
              />
            )}

            {/* Dedicated Section: EVIDENCE TIMELINE */}
            {currentScreen === 'timeline' && (
              <Screen6Timeline
                onNext={() => setCurrentScreen('complaint')}
                onBack={() => setCurrentScreen('status')}
                lang={lang}
              />
            )}

            {/* Dedicated Section: COMPLAINT DRAFT */}
            {currentScreen === 'complaint' && (
              <Screen7Complaint
                caseData={caseData}
                onBack={() => setCurrentScreen('timeline')}
                lang={lang}
              />
            )}

            {/* Screen 9: SAMPLE DASHBOARD */}
            {currentScreen === 'dashboard' && (
              <Screen9Dashboard
                onBack={() => setCurrentScreen('consent')}
                lang={lang}
              />
            )}
          </main>
        </>
      )}

      {/* FLOATING ACTION BUTTON (FAB): Benefit Mitra Citizen Helpdesk */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsMitraDrawerOpen(true)}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-brandRed to-deepRed text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 transition-all ring-2 ring-brandRed/30 cursor-pointer"
          title={lang === 'hi' ? 'बेनिफ़िट मित्र सहायता' : 'Benefit Mitra Helpdesk'}
        >
          <HelpCircle className="w-5 h-5 text-red-100" />
          <span>{lang === 'hi' ? 'सहायता मित्र' : 'Mitra Help'}</span>
        </button>
      </div>

      {/* One-Click Sample Profiles Modal */}
      <SampleProfileModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectProfile={handleSelectSampleProfile}
        lang={lang}
      />

      {/* Interactive Scheme & Benefit Calculator Modal */}
      <SchemeCalculatorModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
        onSelectScheme={handleSelectScheme}
        lang={lang}
      />

      {/* Benefit Mitra FAQ & Helplines Drawer */}
      <MitraAssistantDrawer
        isOpen={isMitraDrawerOpen}
        onClose={() => setIsMitraDrawerOpen(false)}
        lang={lang}
      />

      {/* Privacy Deletion Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleWipeAllData}
        lang={lang}
      />

      {/* Toast Feedback */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />
    </div>
  );
}
