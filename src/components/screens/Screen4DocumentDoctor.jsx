import React, { useState } from 'react';
import {
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Edit3,
  FileCheck2,
  ShieldCheck,
  FileText
} from 'lucide-react';
import SpeakButton from '../SpeakButton.jsx';
import { checkImageQuality } from '../../utils/imageQuality.js';
import { callOcrApi } from '../../services/api.js';
import { compareBeneficiaryNames } from '../../utils/nameMatcher.js';
import { SCHEMES } from '../../utils/rulesLoader.js';
import { generateSampleDocumentImage } from '../../utils/sampleDocGenerator.js';

export default function Screen4DocumentDoctor({
  caseData,
  onSaveDocuments,
  onNext,
  onBack,
  lang = 'hi',
  allowAiDocs = true
}) {
  const isHi = lang === 'hi';
  const activeScheme = SCHEMES.find(s => s.id === caseData?.selectedScheme) || SCHEMES[0];

  // Slot 1: Scheme Primary Document
  const [rationImage, setRationImage] = useState(caseData?.rationImage || null);
  const [rationQuality, setRationQuality] = useState(null);
  const [rationName, setRationName] = useState(caseData?.ration_name || caseData?.confirmedRationName || '');
  const [isProcessingRation, setIsProcessingRation] = useState(false);
  const [rationOcrError, setRationOcrError] = useState('');

  // Slot 2: Bank Passbook
  const [passbookImage, setPassbookImage] = useState(caseData?.passbookImage || null);
  const [passbookQuality, setPassbookQuality] = useState(null);
  const [passbookName, setPassbookName] = useState(caseData?.confirmedPassbookName || '');
  const [isProcessingPassbook, setIsProcessingPassbook] = useState(false);
  const [passbookOcrError, setPassbookOcrError] = useState('');

  // Image upload handler with browser-side quality check
  const handleImageSelect = async (file, slotType) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target.result;

      // 1. Browser-side image quality check (no upload needed yet)
      const quality = await checkImageQuality(dataUrl);

      if (slotType === 'ration') {
        setRationImage(dataUrl);
        setRationQuality(quality);
        setRationOcrError('');
        if (quality.passesQuality && allowAiDocs) {
          triggerOcr(dataUrl, 'ration');
        }
      } else {
        setPassbookImage(dataUrl);
        setPassbookQuality(quality);
        setPassbookOcrError('');
        if (quality.passesQuality && allowAiDocs) {
          triggerOcr(dataUrl, 'passbook');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Generates realistic official document on HTML canvas for instant testing
  const handleGenerateSampleDoc = async (slotType) => {
    const candidateName = rationName || caseData?.ration_name || 'Sunita Devi';
    let docType = 'ration';
    if (slotType === 'ration') {
      if (activeScheme.id === 'pm-kisan') docType = 'land';
      else if (activeScheme.id === 'post-matric-scholarship') docType = 'student_id';
      else docType = 'ration';
    } else {
      docType = 'passbook';
    }

    const dataUrl = generateSampleDocumentImage({
      type: docType,
      name: candidateName,
      state: caseData?.state === 'UP' ? 'Uttar Pradesh' : 'Bihar',
      district: caseData?.district ? caseData.district.toUpperCase() : 'VARANASI',
      schemeId: activeScheme.id
    });

    const quality = await checkImageQuality(dataUrl);

    if (slotType === 'ration') {
      setRationImage(dataUrl);
      setRationQuality(quality);
      setRationOcrError('');
      setRationName(candidateName);
    } else {
      setPassbookImage(dataUrl);
      setPassbookQuality(quality);
      setPassbookOcrError('');
      setPassbookName(candidateName);
    }
  };

  // Calls serverless endpoint for in-memory Gemini Vision OCR
  const triggerOcr = async (dataUrl, slotType) => {
    if (slotType === 'ration') {
      setIsProcessingRation(true);
      setRationOcrError('');
    } else {
      setIsProcessingPassbook(true);
      setPassbookOcrError('');
    }

    const res = await callOcrApi(dataUrl);

    if (slotType === 'ration') {
      setIsProcessingRation(false);
      if (res.success && res.data?.name) {
        setRationName(res.data.name);
      } else {
        setRationOcrError(res.message || 'AI reading unavailable. Please type name manually.');
      }
    } else {
      setIsProcessingPassbook(false);
      if (res.success && res.data?.name) {
        setPassbookName(res.data.name);
      } else {
        setPassbookOcrError(res.message || 'AI reading unavailable. Please type name manually.');
      }
    }
  };

  // Compare the two names using code-based nameMatcher (no AI)
  const comparison = compareBeneficiaryNames(rationName, passbookName);

  const handleContinue = () => {
    onSaveDocuments({
      confirmedRationName: rationName,
      confirmedPassbookName: passbookName,
      nameComparison: comparison,
      rationImageQuality: rationQuality?.passesQuality,
      passbookImageQuality: passbookQuality?.passesQuality
    });
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-6">
        {/* Step Indicator & Header Actions */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <FileCheck2 className="w-3.5 h-3.5" />
              {isHi ? 'चरण 4: दस्तावेज़ डॉक्टर' : 'Step 4: Document Doctor'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isHi ? 'दस्तावेज़ और नाम मिलान' : 'Document Doctor & Name Verification'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isHi
                ? 'राशन कार्ड और बैंक पासबुक की फ़ोटो अपलोड करें। नाम का मिलान कोड द्वारा किया जाता है।'
                : 'Upload ration card and passbook. Names are compared algorithmically in code.'}
            </p>
          </div>

          <SpeakButton
            text={isHi
              ? 'चरण 4: कृपया राशन कार्ड और बैंक पासबुक की साफ़ फ़ोटो अपलोड करें या नमूना दस्तावेज़ बनाएं। दोनों में नाम का मिलान सुरक्षित कोड द्वारा किया जाता है।'
              : 'Step 4: Upload clear photos of your ration card and bank passbook or create sample documents. Names are compared deterministically in code.'}
            lang={lang}
            size="sm"
          />
        </div>

        {/* 2 Upload Slots */}
        <div className="space-y-6">
          {/* SLOT 1: Primary Document */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-900 text-base">
                1. {isHi ? activeScheme.docSlot1Label_hi : activeScheme.docSlot1Label_en}
              </h2>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                {isHi ? 'फ़ोटो या फ़ाइल' : 'Photo or File'}
              </span>
            </div>

            {/* Quality Warning Alert if Retake Recommended */}
            {rationQuality && !rationQuality.passesQuality && (
              <div className="mb-3 p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">{isHi ? 'फ़ोटो की गुणवत्ता कमजोर है:' : 'Image quality issue:'}</p>
                  <p>{isHi ? rationQuality.guidance_hi : rationQuality.guidance_en}</p>
                </div>
              </div>
            )}

            {/* Upload Action */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="w-full sm:w-auto flex-1 min-h-[44px] px-4 py-3 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-100/60 text-emerald-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>{rationImage ? (isHi ? 'अन्य फ़ोटो बदलें' : 'Change Photo') : (isHi ? 'फ़ोटो लें या चुनें' : 'Take or Upload Photo')}</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleImageSelect(e.target.files?.[0], 'ration')}
                />
              </label>

              {/* One-Click Sample Document Generator */}
              <button
                type="button"
                onClick={() => handleGenerateSampleDoc('ration')}
                className="w-full sm:w-auto min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{isHi ? '⚡ नमूना कार्ड बनाएं' : '⚡ Generate Sample'}</span>
              </button>

              {rationImage && allowAiDocs && (
                <button
                  type="button"
                  onClick={() => triggerOcr(rationImage, 'ration')}
                  disabled={isProcessingRation}
                  className="w-full sm:w-auto min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isProcessingRation ? (isHi ? 'पढ़ रहे हैं...' : 'Reading...') : (isHi ? 'AI से दोबारा पढ़ें' : 'Re-scan with AI')}</span>
                </button>
              )}
            </div>

            {/* Error or Manual typing fallback notice */}
            {rationOcrError && (
              <p className="mt-2 text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                ℹ️ {rationOcrError}
              </p>
            )}

            {/* Extracted & Editable Name Input Box */}
            <div className="mt-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'राशन कार्ड पर दर्ज नाम (सत्यापित या सही करें):' : 'Name on Ration Card (Confirm or Edit):'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={rationName}
                  onChange={(e) => setRationName(e.target.value)}
                  placeholder={isHi ? 'उदा. सुनीता देवी' : 'e.g. Sunita Devi'}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-white focus:border-emerald-500"
                />
                <Edit3 className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* SLOT 2: Bank Passbook */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-900 text-base">
                2. {isHi ? 'बैंक पासबुक (Bank Passbook)' : 'Bank Passbook'}
              </h2>
              <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                {isHi ? 'फ़ोटो या फ़ाइल' : 'Photo or File'}
              </span>
            </div>

            {/* Quality Warning Alert */}
            {passbookQuality && !passbookQuality.passesQuality && (
              <div className="mb-3 p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">{isHi ? 'फ़ोटो की गुणवत्ता कमजोर है:' : 'Image quality issue:'}</p>
                  <p>{isHi ? passbookQuality.guidance_hi : passbookQuality.guidance_en}</p>
                </div>
              </div>
            )}

            {/* Upload Action */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="w-full sm:w-auto flex-1 min-h-[44px] px-4 py-3 rounded-xl border border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-100/60 text-emerald-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>{passbookImage ? (isHi ? 'अन्य पासबुक फ़ोटो चुनें' : 'Change Passbook') : (isHi ? 'पासबुक फ़ोटो लें या चुनें' : 'Take or Upload Passbook')}</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleImageSelect(e.target.files?.[0], 'passbook')}
                />
              </label>

              {/* One-Click Sample Passbook Generator */}
              <button
                type="button"
                onClick={() => handleGenerateSampleDoc('passbook')}
                className="w-full sm:w-auto min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{isHi ? '⚡ नमूना पासबुक बनाएं' : '⚡ Generate Passbook'}</span>
              </button>

              {passbookImage && allowAiDocs && (
                <button
                  type="button"
                  onClick={() => triggerOcr(passbookImage, 'passbook')}
                  disabled={isProcessingPassbook}
                  className="w-full sm:w-auto min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{isProcessingPassbook ? (isHi ? 'पढ़ रहे हैं...' : 'Reading...') : (isHi ? 'AI से दोबारा पढ़ें' : 'Re-scan with AI')}</span>
                </button>
              )}
            </div>

            {/* Error or Fallback notice */}
            {passbookOcrError && (
              <p className="mt-2 text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                ℹ️ {passbookOcrError}
              </p>
            )}

            {/* Extracted & Editable Name Input Box */}
            <div className="mt-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {isHi ? 'पासबुक पर दर्ज नाम (सत्यापित या सही करें):' : 'Name on Passbook (Confirm or Edit):'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={passbookName}
                  onChange={(e) => setPassbookName(e.target.value)}
                  placeholder={isHi ? 'उदा. सुनीता डी / Sunita D.' : 'e.g. Sunita Devi'}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-white focus:border-emerald-500"
                />
                <Edit3 className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* CODE-BASED NAME COMPARISON VERDICT */}
        {rationName && passbookName && (
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            comparison.match
              ? 'bg-emerald-50/70 border-emerald-300'
              : 'bg-amber-50/80 border-amber-300'
          }`}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white shadow-sm flex-shrink-0">
                {comparison.match ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                )}
              </div>
              <div className="flex-1 text-sm">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {comparison.match
                      ? (isHi ? 'नाम मेल खाता है' : 'Names Match')
                      : (isHi ? 'संभावित नाम में अंतर पाया गया' : 'Possible Name Difference Found')}
                  </h3>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    comparison.match ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                  }`}>
                    {comparison.percentage}% {isHi ? 'समानता स्कोर' : 'Similarity Score'}
                  </span>
                </div>

                <p className="text-slate-700 mt-1">
                  {isHi ? comparison.message_hi : comparison.message_en}
                </p>

                {/* Show both names side by side if difference found */}
                {!comparison.match && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-amber-200">
                    <div>
                      <span className="text-slate-500 font-medium">{isHi ? 'राशन कार्ड:' : 'Ration Card:'}</span>{' '}
                      <strong className="text-slate-900 font-bold">{rationName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">{isHi ? 'बैंक पासबुक:' : 'Passbook:'}</span>{' '}
                      <strong className="text-slate-900 font-bold">{passbookName}</strong>
                    </div>
                  </div>
                )}

                {/* Algorithmic Details Breakdown */}
                <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-700">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 flex items-center gap-1">
                    ✓ {isHi ? 'आदरसूचक (श्रीमती/श्री) अनदेखा' : 'Honorifics normalized'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 flex items-center gap-1">
                    ✓ {isHi ? 'संक्षिप्त नाम (Initials) मिलान' : 'Initials support (e.g. S. Devi)'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 flex items-center gap-1">
                    ✓ {isHi ? 'देवनागरी लिप्यंतरण' : 'Devanagari transliteration'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 flex items-center gap-1">
                    🛡️ {isHi ? '100% कोड-आधारित (AI का कोई निर्णय नहीं)' : '100% Deterministic Code'}
                  </span>
                </div>
              </div>
            </div>
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

          <button
            type="button"
            onClick={handleContinue}
            disabled={!rationName.trim()}
            className={`min-h-[48px] px-6 py-2.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 shadow-md ${
              rationName.trim()
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{isHi ? 'तैयारी स्कोर देखें' : 'View Readiness Card'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
