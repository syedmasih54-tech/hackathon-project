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
    ? `बेनिफ़िट ब्रिज में आपका स्वागत है। हम केवल आपका नाम, आयु, राशन कार्ड प्रकार और बैंक खाता होने की जानकारी एकत्र करते हैं, ताकि कल्याण योजना पात्रता की जांच हो सके। हम कभी भी आपका आधार नंबर, फ़ोन नंबर या बैंक खाता नंबर नहीं मांगते। आपके दस्तावेज़ केवल एक बार पढ़े जाते हैं और हमारे सर्वर पर कभी सुरक्षित नहीं होते। आप जब चाहें अपना सारा डेटा मिटा सकते हैं। आगे बढ़ने के लिए कृपया बुनियादी सहमति स्वीकार करें।`
    : `Welcome to BenefitBridge. We collect only your name, age, ration card type, and bank account status to assess welfare eligibility. We never ask for your Aadhaar number, phone number, or full bank account number. Your documents are read once and never stored on our servers. You can delete all your data at any time. Please agree to the basics to continue.`;

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
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
        {/* Screen Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-brandRed text-xs font-bold uppercase tracking-wider mb-2.5">
              <Shield className="w-3.5 h-3.5" />
              {isHi ? 'चरण 1: सहमति एवं गोपनीयता' : 'Step 1: Consent & Privacy'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isHi ? 'आपकी गोपनीयता और सूचित सहमति' : 'Your Privacy & Informed Consent'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isHi
                ? 'नागरिक अधिकारों की सुरक्षा के साथ पारदर्शी कल्याणकारी सहायता'
                : 'Transparent welfare assistance with client-side privacy preservation'}
            </p>
          </div>

          {/* Read Aloud Button */}
          <button
            type="button"
            onClick={handleToggleAudio}
            aria-label={isPlayingAudio ? 'ऑडियो रोकें' : 'सहमति सुनें'}
            className={`min-h-[44px] px-4 py-2.5 rounded-2xl flex items-center gap-2.5 font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer ${
              isPlayingAudio
                ? 'bg-amber-100 text-amber-900 border border-amber-300 ring-2 ring-amber-400 animate-pulse'
                : 'bg-brandRed hover:bg-deepRed text-white shadow-brandRed/25'
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
                <span>{isHi ? 'सहमति सुनें' : 'Listen'}</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Tools Header Bar (Demo & Calculator) */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={onOpenSampleProfiles}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 hover:border-amber-400 text-left transition-all flex items-center justify-between group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black uppercase text-amber-900 tracking-wide block">
                  {isHi ? '⚡ एक-क्लिक नमूना प्रोफ़ाइल' : '⚡ 1-Click Demo Profile'}
                </span>
                <span className="text-xs text-amber-800 font-medium">
                  {isHi ? 'सुनीता देवी, रामेश्वर या अमित का परीक्षण करें' : 'Test Sunita, Rameshwar or Amit'}
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-700 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onOpenCalculator}
            className="p-4 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 hover:border-red-400 text-left transition-all flex items-center justify-between group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-brandRed text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black uppercase text-red-950 tracking-wide block">
                  {isHi ? '📊 योजना एवं लाभ कैलकुलेटर' : '📊 Benefit Calculator'}
                </span>
                <span className="text-xs text-red-800 font-medium">
                  {isHi ? 'मापदंड बदलें व लाभ राशि जांचें' : 'Simulate criteria & calculate payouts'}
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-brandRed group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 2-Column Desktop Layout: Explanations on Left, Permissions & Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Schemes & Explanations (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Supported Schemes Live Badges */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                {isHi ? 'समर्थित सरकारी योजनाएं (3 Schemes Supported):' : 'Supported Government Welfare Schemes:'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-brandRed flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {isHi ? 'विधवा पेंशन' : 'Widow Pension'}
                    </div>
                    <div className="text-[10px] text-brandRed font-bold">
                      ₹12,000 / {isHi ? 'वर्ष' : 'yr'}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-brandRed flex items-center justify-center flex-shrink-0">
                    <Tractor className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {isHi ? 'पीएम-किसान' : 'PM-KISAN'}
                    </div>
                    <div className="text-[10px] text-brandRed font-bold">
                      ₹6,000 / {isHi ? 'वर्ष' : 'yr'}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {isHi ? 'छात्रवृत्ति (NSP)' : 'Scholarship'}
                    </div>
                    <div className="text-[10px] text-blue-700 font-bold">
                      {isHi ? 'शुल्क प्रतिपूर्ति' : 'Fee Refund'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Plain Language Explanations */}
            <div className="space-y-4 text-sm text-slate-700 bg-slate-50/80 rounded-2xl p-6 border border-slate-200">
              <div>
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-brandRed inline-block"></span>
                  {isHi ? 'हम क्या एकत्र करते हैं?' : 'What is collected?'}
                </h2>
                <p className="leading-relaxed text-slate-600">
                  {isHi
                    ? 'केवल आपके राशन कार्ड पर दर्ज नाम, राज्य, ज़िला, आयु, वैवाहिक स्थिति और दस्तावेज़ की फ़ोटो। हम कभी भी आपका आधार नंबर, फ़ोन नंबर या बैंक खाता संख्या नहीं मांगते।'
                    : 'Only your name as on the ration card, state, district, age, marital status, and document photos. We NEVER ask for your Aadhaar number, phone number, or bank account number.'}
                </p>
              </div>

              <div>
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-brandRed inline-block"></span>
                  {isHi ? 'हम यह जानकारी क्यों मांगते हैं?' : 'Why is this collected?'}
                </h2>
                <p className="leading-relaxed text-slate-600">
                  {isHi
                    ? 'यह जांचने के लिए कि क्या आप सरकारी योजनाओं के लिए पात्र हो सकते हैं, और क्या आपके दस्तावेज़ों में नाम मेल खाता है।'
                    : 'Solely to check if you may qualify for government welfare schemes, and to ensure names match across your paperwork.'}
                </p>
              </div>

              <div>
                <h2 className="font-bold text-slate-900 text-base flex items-center gap-2 mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-brandRed inline-block"></span>
                  {isHi ? 'आपके अनुरोध पर तुरंत मिटाया जाता है' : 'Deleted on request'}
                </h2>
                <p className="leading-relaxed text-slate-600">
                  {isHi
                    ? 'आपका डेटा केवल आपके ही डिवाइस की IndexedDB में रहता है। आप ऊपर दिए गए "डेटा मिटाएं" बटन से किसी भी समय एक क्लिक में सारा डेटा मिटा सकते हैं।'
                    : 'All case data stays inside your own device IndexedDB. You can erase everything at any time with the "Wipe Data" button.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Permissions Form (lg:col-span-6) */}
          <div className="lg:col-span-6">
            <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <fieldset>
                <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  {isHi ? 'व्यक्तिगत सुविधाएं (वैकल्पिक अनुमति)' : 'Feature Permissions (Optional)'}
                </legend>

                <div className="space-y-3">
                  {/* Camera / Uploads */}
                  <label className="flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200 hover:border-red-200 hover:bg-red-50/20 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={allowCamera}
                      onChange={(e) => setAllowCamera(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded text-brandRed focus:ring-brandRed border-slate-300"
                    />
                    <div className="flex-1 text-sm">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-brandRed" />
                        {isHi ? 'कैमरा और दस्तावेज़ अपलोड' : 'Camera and document uploads'}
                      </div>
                      <p className="text-slate-500 text-xs mt-1">
                        {isHi ? 'राशन कार्ड और बैंक पासबुक की फ़ोटो खींचने या चुनने के लिए' : 'To capture or upload photos of ration card & bank passbook'}
                      </p>
                    </div>
                  </label>

                  {/* AI Document Reading */}
                  <label className="flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200 hover:border-red-200 hover:bg-red-50/20 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={allowAiDocs}
                      onChange={(e) => setAllowAiDocs(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded text-brandRed focus:ring-brandRed border-slate-300"
                    />
                    <div className="flex-1 text-sm">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-brandRed" />
                        {isHi ? 'दस्तावेज़ पढ़ने के लिए AI का उपयोग' : 'Use AI to read document names'}
                      </div>
                      <p className="text-slate-500 text-xs mt-1">
                        {isHi ? 'दस्तावेज़ से केवल नाम पढ़ने के लिए सुरक्षित AI विज़न मॉडल का उपयोग (कोई ID नंबर नहीं पढ़ा जाता)' : 'Uses Gemini vision strictly in-memory to detect name. No ID numbers extracted.'}
                      </p>
                    </div>
                  </label>

                  {/* Voice Input */}
                  <label className="flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200 hover:border-red-200 hover:bg-red-50/20 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={allowVoice}
                      onChange={(e) => setAllowVoice(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded text-brandRed focus:ring-brandRed border-slate-300"
                    />
                    <div className="flex-1 text-sm">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <Mic className="w-4 h-4 text-brandRed" />
                        {isHi ? 'आवाज़ द्वारा इनपुट (माइक्रोफ़ोन)' : 'Voice input (Microphone)'}
                      </div>
                      <p className="text-slate-500 text-xs mt-1">
                        {isHi ? 'फ़ॉर्म में बोलकर हिंदी या अंग्रेज़ी में जवाब देने की सुविधा' : 'Option to speak answers in Hindi in addition to typing'}
                      </p>
                    </div>
                  </label>
                </div>
              </fieldset>

              {/* Mandatory Core Agreement Checkbox */}
              <div className="pt-2">
                <label className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                  agreeBasics ? 'bg-red-50/70 border-brandRed/40 ring-1 ring-brandRed' : 'bg-amber-50/50 border-amber-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={agreeBasics}
                    onChange={(e) => {
                      setAgreeBasics(e.target.checked);
                      if (e.target.checked) setValidationError('');
                    }}
                    className="w-5 h-5 mt-0.5 rounded text-brandRed focus:ring-brandRed border-slate-300"
                    required
                  />
                  <div className="flex-1 text-sm">
                    <span className="font-bold text-slate-900">
                      {isHi
                        ? 'अनिवार्य: मैं समझता/समझती हूँ कि मेरा डेटा केवल मेरे उपकरण पर रहता है और मैं पात्रता जांच के लिए सहमत हूँ।'
                        : 'Mandatory: I agree to the basic data handling and understand case records stay on my device.'}
                    </span>
                    <span className="text-brandRed font-bold ml-1">*</span>
                  </div>
                </label>
              </div>

              {/* Validation Error Message */}
              {validationError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-brandRed text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{validationError}</span>
                </div>
              )}

              {/* Continue Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!agreeBasics}
                  className={`w-full min-h-[52px] py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all shadow-md ${
                    agreeBasics
                      ? 'bg-brandRed hover:bg-deepRed text-white shadow-brandRed/25 cursor-pointer hover:shadow-lg hover:scale-[1.01] active:scale-95'
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
      </div>
    </div>
  );
}
