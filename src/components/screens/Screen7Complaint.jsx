import React, { useState, useEffect } from 'react';
import {
  FileText,
  AlertTriangle,
  Send,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Copy,
  Clock,
  ArrowLeft,
  Sparkles,
  Download,
  ShieldCheck,
  Building
} from 'lucide-react';
import SpeakButton from '../SpeakButton.jsx';
import { callComplaintApi } from '../../services/api.js';
import { saveGrievanceData, loadGrievanceData } from '../../services/db.js';
import { downloadGrievanceReminderIcs } from '../../utils/calendar.js';
import { SCHEMES } from '../../utils/rulesLoader.js';

export default function Screen7Complaint({
  caseData,
  onBack,
  lang = 'hi'
}) {
  const isHi = lang === 'hi';
  const activeScheme = SCHEMES.find(s => s.id === caseData?.selectedScheme) || SCHEMES[0];
  const [tone, setTone] = useState('polite');

  const defaultSchemeName = activeScheme.name_en;
  const defaultIssue = caseData?.selectedScheme === 'pm-kisan'
    ? (isHi ? 'ई-केवाईसी और भूलेख सत्यापन पूरा होने के बाद भी 60 दिनों से किसान सम्मान निधि की किस्त प्राप्त नहीं हुई है।' : 'PM-KISAN installment not credited after 60 days despite e-KYC and land verification.')
    : caseData?.selectedScheme === 'post-matric-scholarship'
    ? (isHi ? 'संस्थान स्तर पर सत्यापन होने के बाद भी 60 दिनों से छात्रवृत्ति और शुल्क प्रतिपूर्ति खाते में नहीं आई है।' : 'Scholarship disbursement delayed after 60 days following institutional verification.')
    : (isHi ? 'आवेदन जमा करने के 60 दिन बाद भी कोई सत्यापन या पेंशन राशि प्राप्त नहीं हुई है।' : 'No verification status or pension disbursement received after 60 days.');

  const [isDelayed, setIsDelayed] = useState(false);
  const [daysElapsed, setDaysElapsed] = useState(60);
  const [applicationDate, setApplicationDate] = useState('2026-08-15');
  const [referenceNumber, setReferenceNumber] = useState(caseData?.referenceNumber || 'UP2026APP98214');
  const [issueSummary, setIssueSummary] = useState(defaultIssue);

  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [grievanceRegNo, setGrievanceRegNo] = useState('');
  const [hasDownloadedCalendar, setHasDownloadedCalendar] = useState(false);

  // Load existing grievance data if previously saved
  useEffect(() => {
    loadGrievanceData().then((saved) => {
      if (saved) {
        setIsDelayed(saved.isDelayed ?? false);
        if (saved.draft) setDraft(saved.draft);
        if (saved.grievanceRegNo) setGrievanceRegNo(saved.grievanceRegNo);
        if (saved.isApproved) setIsApproved(saved.isApproved);
      }
    });
  }, []);

  // Generate complaint using Gemini with STRICT constraints
  const handleGenerateComplaint = async () => {
    setIsGenerating(true);

    const facts = {
      scheme: defaultSchemeName,
      application_date: applicationDate,
      days_elapsed: Number(daysElapsed),
      reference_number: referenceNumber,
      issue: issueSummary
    };

    const res = await callComplaintApi(facts);
    setIsGenerating(false);

    if (res.success && res.data?.draft) {
      setDraft(res.data.draft);
      setIsApproved(false);
      saveGrievanceData({
        isDelayed: true,
        draft: res.data.draft,
        facts
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveRegNo = async (val) => {
    setGrievanceRegNo(val);
    await saveGrievanceData({
      isDelayed: true,
      draft,
      grievanceRegNo: val,
      isApproved
    });
  };

  const handleDownloadReminder = () => {
    downloadGrievanceReminderIcs({
      registrationNumber: grievanceRegNo || referenceNumber,
      schemeName: 'Widow Pension (IGNWPS)'
    });
    setHasDownloadedCalendar(true);
  };

  // Word count helper
  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-6">
        {/* Step Indicator */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-brandRed font-bold text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" />
            {isHi ? 'चरण 7: शिकायत मसौदा' : 'Step 7: Complaint Draft'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isHi ? 'आधिकारिक शिकायत (Grievance) मसौदा' : 'Official Grievance Draft'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isHi
              ? 'केवल संरचित तथ्यों के आधार पर विनम्र हिंदी शिकायत तैयार करें।'
              : 'Drafts a polite complaint strictly using verified facts for the CPGRAMS portal.'}
          </p>
        </div>

        {/* DELAY REQUIREMENT: Show this only when case marked delayed */}
        {!isDelayed ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                {isHi ? 'क्या आपके मामले में देरी हुई है?' : 'Is your case delayed?'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
                {isHi
                  ? 'शिकायत सुविधा केवल उन मामलों के लिए है जहाँ सामान्य समय सीमा (45 दिन) से अधिक समय बीत चुका है और कोई प्रगति नहीं हुई है।'
                  : 'Grievance drafting is intended for applications exceeding standard processing timelines (45+ days).'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsDelayed(true);
                handleGenerateComplaint();
              }}
              className="min-h-[44px] px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-sm"
            >
              {isHi ? 'हाँ, मेरा केस विलंबित है (शिकायत तैयार करें)' : 'Yes, my case is delayed (Draft Complaint)'}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Structured Facts Input Section */}
            <div className="p-4 sm:p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {isHi ? 'भेजे जाने वाले संरचित तथ्य (Structured Facts):' : 'Structured Facts Sent to Generator:'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">
                    {isHi ? 'योजना का नाम:' : 'Scheme Name:'}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={defaultSchemeName}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-100 text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">
                    {isHi ? 'आवेदन तिथि:' : 'Application Date:'}
                  </label>
                  <input
                    type="date"
                    value={applicationDate}
                    onChange={(e) => setApplicationDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">
                    {isHi ? 'बीते हुए दिन:' : 'Days Elapsed:'}
                  </label>
                  <input
                    type="number"
                    value={daysElapsed}
                    onChange={(e) => setDaysElapsed(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">
                    {isHi ? 'संदर्भ संख्या:' : 'Reference Number:'}
                  </label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1 text-xs">
                  {isHi ? 'समस्या का संक्षिप्त विवरण:' : 'Specific Issue:'}
                </label>
                <input
                  type="text"
                  value={issueSummary}
                  onChange={(e) => setIssueSummary(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>

              {/* Interactive Tone Selector */}
              <div>
                <label className="block text-slate-500 font-semibold mb-1 text-xs">
                  {isHi ? 'शिकायत का लहज़ा (Tone):' : 'Draft Tone & Urgency:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTone('polite')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                      tone === 'polite'
                        ? 'bg-red-100 border-brandRed text-red-950 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isHi ? '🌸 विनम्र (Polite)' : 'Polite'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setTone('formal')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                      tone === 'formal'
                        ? 'bg-indigo-100 border-indigo-400 text-indigo-950 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isHi ? '⚖️ औपचारिक (Formal)' : 'Formal'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setTone('urgent')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                      tone === 'urgent'
                        ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isHi ? '⚡ त्वरित (Urgent)' : 'Urgent'}
                  </button>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleGenerateComplaint}
                  disabled={isGenerating}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-brandRed hover:bg-deepRed text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? (isHi ? 'मसौदा तैयार हो रहा है...' : 'Generating...') : (isHi ? 'नया मसौदा तैयार करें' : 'Generate Complaint Draft')}</span>
                </button>
              </div>
            </div>

            {/* Editable Draft Area */}
            {draft && (
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {isHi ? 'शिकायत का संपादन योग्य मसौदा:' : 'Editable Complaint Draft:'}
                    </span>
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      wordCount <= 120 ? 'bg-red-100 text-brandRed font-bold' : 'bg-red-100 text-red-800'
                    }`}>
                      {wordCount} / 120 {isHi ? 'शब्द' : 'words'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <SpeakButton
                      text={draft}
                      lang="hi"
                      size="sm"
                      labelHi="मसौदा सुनें"
                      labelEn="Listen"
                    />

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="min-h-[36px] px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? (isHi ? 'कॉपी हो गया!' : 'Copied!') : (isHi ? 'कॉपी करें' : 'Copy')}</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows="7"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-slate-300 bg-white text-sm text-slate-900 font-sans leading-relaxed focus:border-brandRed shadow-sm"
                />

                {/* Approval Checkbox (Mandatory before enabling portal link) */}
                <div className="p-3.5 rounded-2xl bg-red-50/70 border border-red-300">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isApproved}
                      onChange={(e) => setIsApproved(e.target.checked)}
                      className="w-5 h-5 mt-0.5 text-brandRed rounded focus:ring-brandRed border-slate-300"
                    />
                    <div className="text-xs sm:text-sm text-slate-900 font-bold">
                      {isHi
                        ? 'मैंने यह शिकायत मसौदा पढ़ लिया है और इसे स्वीकृत करता/करती हूँ।'
                        : 'I have read and approve this complaint draft.'}
                    </div>
                  </label>
                </div>

                {/* External Portal Button (Strict: NEVER submitted automatically!) */}
                <div className="pt-2">
                  <a
                    href={isApproved ? "https://pgportal.gov.in" : undefined}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      if (!isApproved) e.preventDefault();
                    }}
                    className={`min-h-[48px] w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all ${
                      isApproved
                        ? 'bg-brandRed hover:bg-deepRed text-white shadow-brandRed/25 cursor-pointer cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>{isHi ? 'आधिकारिक शिकायत पोर्टल खोलें (pgportal.gov.in)' : 'Open the Official Grievance Portal (pgportal.gov.in)'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <p className="text-[11px] text-center text-slate-500 mt-2 font-medium">
                    🔒 {isHi ? 'सुरक्षा नियम: कोई भी शिकायत स्वचालित रूप से जमा नहीं की जाती। आप स्वयं पोर्टल पर पेस्ट करके जमा करते हैं।' : 'Strict Safety: Nothing is ever submitted automatically. You submit yourself on pgportal.gov.in.'}
                  </p>

                  {/* State Grievance Portals Quick Links */}
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-[11px] font-bold text-slate-600 mb-1.5">
                      {isHi ? 'राज्य स्तरीय जन-शिकायत पोर्टल लिंक:' : 'Direct State Grievance Portals:'}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <a
                        href="https://jansunwai.up.nic.in"
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-1"
                      >
                        <span>UP जनसुनवाई</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                      <a
                        href="http://lokshikayat.bihar.gov.in"
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-1"
                      >
                        <span>बिहार लोक शिकायत</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                      <a
                        href="https://sampark.rajasthan.gov.in"
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold flex items-center gap-1"
                      >
                        <span>राजस्थान संपर्क</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Grievance Registration Number Input & 21-day Calendar Reminder */}
                <div className="mt-6 p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {isHi ? 'पोर्टल पर जमा करने के बाद:' : 'After Submitting on Portal:'}
                  </h3>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1">
                      {isHi ? 'प्राप्त शिकायत पंजीकरण संख्या (Grievance Registration Number):' : 'Enter Grievance Registration Number:'}
                    </label>
                    <input
                      type="text"
                      value={grievanceRegNo}
                      onChange={(e) => handleSaveRegNo(e.target.value)}
                      placeholder="उदा. MORAE/E/2026/00123"
                      className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white font-mono"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadReminder}
                    className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm w-full"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isHi ? '21-दिन का फॉलो-अप रिमाइंडर डाउनलोड करें (.ics कैलेंडर)' : 'Download 21-Day Follow-up Reminder (.ics Calendar)'}</span>
                  </button>

                  {hasDownloadedCalendar && (
                    <p className="text-xs text-brandRed font-semibold text-center">
                      ✓ {isHi ? 'कैलेंडर फ़ाइल डाउनलोड हो गई है।' : 'Calendar event downloaded.'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[48px] px-5 py-2.5 rounded-2xl border border-slate-300 hover:bg-slate-100 font-bold text-sm text-slate-700 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHi ? 'पीछे' : 'Back'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

