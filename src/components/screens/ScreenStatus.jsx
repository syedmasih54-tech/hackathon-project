import React, { useState, useEffect } from 'react';
import {
  Activity,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Building,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Send,
  HelpCircle
} from 'lucide-react';
import { maskLongNumber } from '../../utils/masking.js';
import { saveCaseData, loadCaseData } from '../../services/db.js';
import { SCHEMES } from '../../utils/rulesLoader.js';

export default function ScreenStatus({
  caseData,
  onNavigate,
  lang = 'hi'
}) {
  const isHi = lang === 'hi';
  const activeScheme = SCHEMES.find(s => s.id === caseData?.selectedScheme) || SCHEMES[0];

  const [applicationDate, setApplicationDate] = useState(caseData?.applicationDate || '2026-08-15');
  const [referenceNumber, setReferenceNumber] = useState(caseData?.referenceNumber || 'UP2026APP98214');
  const [currentStatus, setCurrentStatus] = useState(caseData?.applicationStatus || 'delayed');
  const [statusReason, setStatusReason] = useState(
    caseData?.statusReason || (isHi ? 'ब्लॉक स्तर से सत्यापन रिपोर्ट अभी तक ज़िला समाज कल्याण अधिकारी को नहीं भेजी गई है।' : 'Verification report pending from Block Development Office to District Officer.')
  );
  const [isUnmasked, setIsUnmasked] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calculate days elapsed dynamically
  const calculateDaysElapsed = (appDateStr) => {
    try {
      const appDate = new Date(appDateStr);
      const today = new Date();
      const diffTime = Math.max(0, today - appDate);
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    } catch (e) {
      return 60;
    }
  };

  const daysElapsed = calculateDaysElapsed(applicationDate);
  const isOverdue = daysElapsed > 45;

  const handleSaveStatus = async () => {
    await saveCaseData({
      ...caseData,
      applicationDate,
      referenceNumber,
      applicationStatus: currentStatus,
      statusReason,
      daysElapsed
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const statusOptions = [
    { id: 'submitted', title_hi: 'आवेदन जमा (Submitted)', title_en: 'Submitted', color: 'bg-blue-100 text-blue-800' },
    { id: 'block_verification', title_hi: 'ब्लॉक सत्यापन प्रक्रियाधीन (Under Verification)', title_en: 'Under Verification', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'delayed', title_hi: 'अनावश्यक विलंब (Delayed > 45 Days)', title_en: 'Delayed (> 45 Days)', color: 'bg-amber-100 text-amber-900 border border-amber-300' },
    { id: 'objection', title_hi: 'आपत्ति / दस्तावेज़ सुधार आवश्यक (Action Required)', title_en: 'Action Required', color: 'bg-red-100 text-red-900' },
    { id: 'approved', title_hi: 'स्वीकृत एवं पेंशन जारी (Approved / Disbursed)', title_en: 'Sanctioned / Active', color: 'bg-emerald-100 text-emerald-900' }
  ];

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-6">
        {/* Section Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5" />
              {isHi ? 'अनुभाग: आवेदन स्थिति ट्रैकर' : 'Section: Application Status Tracker'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isHi ? 'आवेदन की वास्तविक स्थिति' : 'Application Live Status'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isHi
                ? 'सरकारी सेवा गारंटी (SLA) और दिनों की गणना के साथ स्थिति ट्रैक करें।'
                : 'Track processing timeline against citizen charter service standards (45-day SLA).'}
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
            {isHi ? activeScheme.tag_hi : activeScheme.tag_en}
          </span>
        </div>

        {/* Days Elapsed SLA Counter Card */}
        <div className={`p-5 rounded-2xl border ${
          isOverdue
            ? 'bg-gradient-to-r from-amber-50 to-amber-100/60 border-amber-300'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isHi ? 'आवेदन किए हुए समय (Days Elapsed)' : 'Time Elapsed Since Application'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-4xl sm:text-5xl font-black ${isOverdue ? 'text-amber-900' : 'text-slate-900'}`}>
                  {daysElapsed} {isHi ? 'दिन' : 'days'}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  / {isHi ? 'मानक समय: 45 दिन' : 'Benchmark: 45 Days'}
                </span>
              </div>
            </div>

            {isOverdue && (
              <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-sm text-xs space-y-1">
                <div className="font-extrabold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{isHi ? 'SLA समय सीमा पार' : 'SLA Limit Exceeded'}</span>
                </div>
                <p className="text-slate-600">
                  {isHi
                    ? '45 दिन से अधिक होने पर CPGRAMS पर शिकायत का अधिकार है।'
                    : 'Over 45 days entitles you to register an official CPGRAMS grievance.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reference & Application Date Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50/70 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isHi ? 'आवेदन तिथि (Submission Date):' : 'Submission Date:'}
            </label>
            <input
              type="date"
              value={applicationDate}
              onChange={(e) => setApplicationDate(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                {isHi ? 'आवेदन / संदर्भ संख्या (Reference No):' : 'Reference / Receipt No:'}
              </label>
              <button
                type="button"
                onClick={() => setIsUnmasked(!isUnmasked)}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                {isUnmasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{isUnmasked ? (isHi ? 'छिपाएं' : 'Mask') : (isHi ? 'दिखाएं' : 'Show')}</span>
              </button>
            </div>
            <input
              type="text"
              value={isUnmasked ? referenceNumber : maskLongNumber(referenceNumber)}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm font-mono"
            />
          </div>
        </div>

        {/* Current Status Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            {isHi ? 'वर्तमान स्थिति चुनें:' : 'Select Current Status:'}
          </label>
          <div className="space-y-2">
            {statusOptions.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  currentStatus === opt.id
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400 font-bold'
                    : 'bg-white border-slate-200 hover:bg-slate-50 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="applicationStatus"
                    value={opt.id}
                    checked={currentStatus === opt.id}
                    onChange={() => setCurrentStatus(opt.id)}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs sm:text-sm text-slate-900">
                    {isHi ? opt.title_hi : opt.title_en}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${opt.color}`}>
                  {opt.id}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Official Remarks / Reason Text Box */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {isHi ? 'अधिकारियों/कार्यालय द्वारा बताया गया कारण या स्थिति टिप्पणी:' : 'Official Remarks / Reason for Pending Status:'}
          </label>
          <textarea
            rows="3"
            value={statusReason}
            onChange={(e) => setStatusReason(e.target.value)}
            placeholder={isHi ? 'उदा. सत्यापन रिपोर्ट लंबित है / दस्तावेज स्पष्ट नहीं हैं...' : 'e.g. Verification pending at block level...'}
            className="w-full p-3.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:border-emerald-500"
          />
        </div>

        {/* Save Status Button */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleSaveStatus}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm shadow-sm"
          >
            {isHi ? 'स्थिति अपडेट सहेजें' : 'Save Status Update'}
          </button>
          {saveSuccess && (
            <span className="text-xs text-emerald-700 font-bold">
              ✓ {isHi ? 'सहेजा गया!' : 'Saved locally!'}
            </span>
          )}
        </div>

        {/* Cross-Section Action Cards (Direct Jumps to Timeline and Complaint) */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {isHi ? 'संबंधित अनुभाग में कार्रवाई करें:' : 'Take Action in Other Sections:'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Jump to Timeline */}
            <div
              onClick={() => onNavigate('timeline')}
              className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  {isHi ? 'साक्ष्य टाइमलाइन' : 'Evidence Timeline'}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isHi ? 'ब्लॉक विज़िट, नोट और पावती रसीद की फ़ोटो जोड़ें।' : 'Log office visits and attach slip photos.'}
              </p>
            </div>

            {/* Jump to Complaint */}
            <div
              onClick={() => onNavigate('complaint')}
              className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-amber-600" />
                  {isHi ? 'शिकायत निवारण' : 'Grievance Draft'}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {isHi ? 'CPGRAMS के लिए विनम्र 120-शब्दों का मसौदा तैयार करें।' : 'Draft polite Hindi complaint for pgportal.gov.in.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
