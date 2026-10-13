import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Shield,
  Camera,
  Cpu,
  Mic,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calculator,
  Heart,
  Tractor,
  GraduationCap
} from 'lucide-react';
import { speakText, stopSpeaking, isSpeaking } from '../../utils/speech.js';

export default function Screen1Consent({
  consentData,
  onSaveConsent,
  onNext,
  onOpenSampleProfiles,
  onOpenCalculator,
  lang = 'hi'
}) {
  const isHi = lang === 'hi';

  const [agreeBasics, setAgreeBasics] = useState(consentData?.agreeBasics || false);
  const [allowCamera, setAllowCamera] = useState(consentData?.allowCamera ?? true);
  const [allowAiDocs, setAllowAiDocs] = useState(consentData?.allowAiDocs ?? true);
  const [allowVoice, setAllowVoice] = useState(consentData?.allowVoice ?? true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const consentNarrationText = isHi
    ? `बेनिफ़िट ब्रिज में आपका स्वागत है। हम केवल आपका नाम, आयु, राशन कार्ड प्रकार और बैंक खाता होने की जानकारी एकत्र करते हैं, ताकि विधवा पेंशन पात्रता की जांच हो सके। हम कभी भी आपका आधार नंबर, फ़ोन नंबर या बैंक खाता नंबर नहीं मांगते। आपके दस्तावेज़ केवल एक बार पढ़े जाते हैं और हमारे सर्वर पर कभी सुरक्षित नहीं होते। आप जब चाहें अपना सारा डेटा मिटा सकते हैं। आगे बढ़ने के लिए कृपया बुनियादी सहमति स्वीकार करें।`
    : `Welcome to BenefitBridge. We collect only your name, age, ration card type, and bank account status to assess widow pension eligibility. We never ask for your Aadhaar number, phone number, or full bank account number. Your documents are read once and never stored on our servers. You can delete all your data at any time. Please agree to the basics to continue.`;

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakText(
        consentNarrationText,
        isHi ? 'hi-IN' : 'en-IN',
        () => setIsPlayingAudio(false)
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreeBasics) {
      setValidationError(
        isHi
          ? 'कृपया जारी रखने के लिए बुनियादी शर्तों से सहमति दें।'
          : 'Please agree to the basic data handling terms to proceed.'
      );
      return;
    }

    setValidationError('');
    stopSpeaking();
    onSaveConsent({
      agreeBasics,
      allowCamera,
      allowAiDocs,
      allowVoice,
      timestamp: new Date().toISOString()
    });
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90">
        {/* Screen Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="w-3.5 h-3.5" />
              {isHi ? 'चरण 1: सहमति एवं गोपनीयता' : 'Step 1: Consent & Privacy'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isHi ? 'आपकी गोपनीयता और सहमति' : 'Your Privacy & Informed Consent'}
            </h1>
          </div>

          {/* Read Aloud Button */}
          <button
            type="button"
            onClick={handleToggleAudio}
            aria-label={isPlayingAudio ? 'ऑडियो रोकें' : 'सहमति सुनें'}
            className={`min-h-[44px] min-w-[44px] px-3.5 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-xs sm:text-sm transition-all shadow-sm ${
              isPlayingAudio
                ? 'bg-amber-100 text-amber-900 border border-amber-300 ring-2 ring-amber-400 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4 text-amber-800" />
                <span>{isHi ? 'रोकें' : 'Stop'}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>{isHi ? 'सुनें' : 'Listen'}</span>
              </>
            )}
          </button>
        </div>

        {/* INTERACTIVE ENHANCEMENT: Quick Demo Mode & Calculator Showcase */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onOpenSampleProfiles}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 hover:border-amber-400 text-left transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black uppercase text-amber-900 tracking-wide block">
                  {isHi ? '⚡ एक-क्लिक नमूना प्रोफ़ाइल' : '⚡ 1-Click Demo Profile'}
                </span>
                <span className="text-[11px] text-amber-800 font-medium">
                  {isHi ? 'सुनीता देवी, रामेश्वर सिंह या अमित' : 'Test Sunita, Rameshwar or Amit'}
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-700 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onOpenCalculator}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 hover:border-blue-400 text-left transition-all flex items-center justify-between group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black uppercase text-blue-900 tracking-wide block">
                  {isHi ? '📊 योजना एवं लाभ कैलकुलेटर' : '📊 Benefit Calculator'}
                </span>
                <span className="text-[11px] text-blue-800 font-medium">
                  {isHi ? 'मापदंड बदलें व राशि जांचें' : 'Simulate eligibility & payouts'}
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-700 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Supported Schemes Live Badges */}
        <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            {isHi ? 'समर्थित सरकारी कल्याणकारी योजनाएं (3 Schemes Supported):' : 'Supported Government Welfare Schemes:'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {isHi ? 'विधवा पेंशन' : 'Widow Pension'}
                </div>
                <div className="text-[10px] text-pink-700 font-bold">
                  ₹12,000 / {isHi ? 'वर्ष' : 'yr'}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Tractor className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {isHi ? 'पीएम-किसान' : 'PM-KISAN'}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold">
                  ₹6,000 / {isHi ? 'वर्ष' : 'yr'}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {isHi ? 'छात्रवृत्ति (NSP)' : 'Scholarship'}
                </div>
                <div className="text-[10px] text-blue-700 font-bold">
                  {isHi ? 'शुल्क प्रतिपूर्ति' : 'Fee Refund + Stipend'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plain Language Explanations */}
        <div className="space-y-4 text-sm text-slate-700 bg-slate-50/80 rounded-2xl p-5 border border-slate-200">
          <div>
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              {isHi ? 'हम क्या एकत्र करते हैं?' : 'What is collected?'}
            </h2>
            <p className="leading-relaxed">
              {isHi
                ? 'केवल आपके राशन कार्ड पर दर्ज नाम, राज्य, ज़िला, आयु, वैवाहिक स्थिति और दस्तावेज़ की फ़ोटो। हम कभी भी आपका आधार नंबर, फ़ोन नंबर या बैंक खाता संख्या नहीं मांगते।'
                : 'Only your name as on the ration card, state, district, age, marital status, and document photos. We NEVER ask for your Aadhaar number, phone number, or bank account number.'}
            </p>
          </div>

          <div>
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              {isHi ? 'हम यह जानकारी क्यों मांगते हैं?' : 'Why is this collected?'}
            </h2>
            <p className="leading-relaxed">
              {isHi
                ? 'यह जांचने के लिए कि क्या आप सरकारी विधवा पेंशन योजना के लिए पात्र हो सकते हैं, और क्या आपके दोनों दस्तावेज़ों (राशन कार्ड और बैंक पासबुक) में नाम मेल खाता है।'
                : 'Solely to check if you may qualify for the government widow pension scheme, and to ensure names match across your ration card and passbook.'}
            </p>
          </div>

          <div>
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              {isHi ? 'आपके अनुरोध पर तुरंत मिटाया जाता है' : 'Deleted on request'}
            </h2>
            <p className="leading-relaxed">
              {isHi
                ? 'आपका डेटा केवल आपके ही फ़ोन/ब्राउज़र की IndexedDB में रहता है। आप ऊपर दिए गए "डेटा मिटाएं" बटन से किसी भी समय एक क्लिक में सारा डेटा मिटा सकते हैं।'
                : 'All case data stays inside your own device IndexedDB. You can erase everything at any time with the "Wipe Data" button.'}
            </p>
          </div>
        </div>

        {/* Granular Permission Checkboxes */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              {isHi ? 'व्यक्तिगत सुविधाएं (वैकल्पिक)' : 'Feature Permissions (Optional)'}
            </legend>

            <div className="space-y-3">
              {/* Camera / Uploads */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50/80 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={allowCamera}
                  onChange={(e) => setAllowCamera(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <div className="flex-1 text-sm">
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    {isHi ? 'कैमरा और दस्तावेज़ अपलोड' : 'Camera and document uploads'}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {isHi ? 'राशन कार्ड और बैंक पासबुक की फ़ोटो खींचने या चुनने के लिए' : 'To take or upload photos of ration card & bank passbook'}
                  </p>
                </div>
              </label>

              {/* AI Document Reading */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50/80 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={allowAiDocs}
                  onChange={(e) => setAllowAiDocs(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <div className="flex-1 text-sm">
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-600" />
                    {isHi ? 'दस्तावेज़ पढ़ने के लिए AI का उपयोग' : 'Use AI to read document names'}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {isHi ? 'दस्तावेज़ से केवल नाम पढ़ने के लिए सुरक्षित AI विज़न मॉडल का उपयोग (कोई ID नंबर नहीं पढ़ा जाता)' : 'Uses Gemini vision strictly in-memory to detect name. No ID numbers extracted.'}
                  </p>
                </div>
              </label>

              {/* Voice Input */}
              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50/80 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={allowVoice}
                  onChange={(e) => setAllowVoice(e.target.checked)}
                  className="w-5 h-5 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <div className="flex-1 text-sm">
                  <div className="font-semibold text-slate-900 flex items-center gap-2">
                    <Mic className="w-4 h-4 text-emerald-600" />
                    {isHi ? 'आवाज़ द्वारा इनपुट (माइक्रोफ़ोन)' : 'Voice input (Microphone)'}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {isHi ? 'फ़ॉर्म में लिखकर या बोलकर हिंदी में जवाब देने की सुविधा' : 'Option to speak answers in Hindi in addition to typing'}
                  </p>
                </div>
              </label>
            </div>
          </fieldset>

          {/* Mandatory Core Agreement Checkbox */}
          <div className="pt-2">
            <label className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
              agreeBasics ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400' : 'bg-amber-50/50 border-amber-300'
            }`}>
              <input
                type="checkbox"
                checked={agreeBasics}
                onChange={(e) => {
                  setAgreeBasics(e.target.checked);
                  if (e.target.checked) setValidationError('');
                }}
                className="w-5 h-5 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                required
              />
              <div className="flex-1 text-sm">
                <span className="font-bold text-slate-900">
                  {isHi
                    ? 'अनिवार्य: मैं समझता/समझती हूँ कि मेरा डेटा केवल मेरे उपकरण पर रहता है और मैं पात्रता जांच के लिए सहमत हूँ।'
                    : 'Mandatory: I agree to the basic data handling and understand case records stay on my device.'}
                </span>
                <span className="text-red-500 font-bold ml-1">*</span>
              </div>
            </label>
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{validationError}</span>
            </div>
          )}

          {/* Continue Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!agreeBasics}
              className={`w-full min-h-[48px] py-3.5 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                agreeBasics
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 cursor-pointer hover:shadow-lg'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>{isHi ? 'सहमति दें और आगे बढ़ें' : 'Agree and Continue'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
