import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FileText,
  Printer
} from 'lucide-react';
import SpeakButton from '../SpeakButton.jsx';
import { evaluateRules } from '../../utils/rulesEngine.js';
import { fetchSchemeRules } from '../../utils/rulesLoader.js';

export default function Screen3Eligibility({
  userData,
  onNext,
  onBack,
  lang = 'hi'
}) {
  const isHi = lang === 'hi';
  const [rulesConfig, setRulesConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWhyPanel, setShowWhyPanel] = useState(true);

  // Load rules deterministically for selected scheme
  useEffect(() => {
    const schemeKey = userData?.selectedScheme || 'widow-pension';
    fetchSchemeRules(schemeKey).then(data => {
      setRulesConfig(data);
      setLoading(false);
    });
  }, [userData?.selectedScheme]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-brandRed border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-sm font-semibold text-slate-600">
          {isHi ? 'सरकारी नियम लोड हो रहे हैं...' : 'Loading official scheme rules...'}
        </p>
      </div>
    );
  }

  // Evaluate rules deterministically without AI
  const evaluation = evaluateRules(rulesConfig, userData);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-6">
        {/* Step Indicator & Header Actions */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-brandRed font-bold text-xs font-bold uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5" />
              {isHi ? 'चरण 3: पात्रता परिणाम' : 'Step 3: Eligibility Result'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isHi ? 'पात्रता मूल्यांकन' : 'Scheme Eligibility Assessment'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <SpeakButton
              text={isHi
                ? `${evaluation.statusText_hi}। कुल ${evaluation.matchedConditions.length} शर्तें पूरी हुई हैं और ${evaluation.missingConditions.length} शर्तें अधूरी हैं।`
                : `${evaluation.statusText_en}. ${evaluation.matchedConditions.length} conditions matched and ${evaluation.missingConditions.length} conditions missing.`}
              lang={lang}
              size="sm"
            />

            <button
              type="button"
              onClick={() => window.print()}
              title={isHi ? 'मूल्यांकन प्रिंट करें' : 'Print assessment'}
              className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isHi ? 'प्रिंट' : 'Print'}</span>
            </button>
          </div>
        </div>

        {/* PROMINENT UNVERIFIED RULES WARNING (Mandatory Requirement) */}
        {!evaluation.isVerified && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-800 flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-sm">
                <h2 className="font-extrabold text-amber-900 text-base flex items-center gap-2">
                  {isHi ? '⚠️ नियम अभी तक सत्यापित नहीं हैं' : '⚠️ Rules Not Yet Verified'}
                </h2>
                <p className="text-amber-800 mt-1 leading-relaxed">
                  {isHi
                    ? 'वर्तमान नियम मान अस्थायी प्लेसहोल्डर (Placeholders) हैं जिन्हें आधिकारिक NSAP पोर्टल से सत्यापित किया जाना शेष है।'
                    : 'The rule criteria currently contain placeholders awaiting official verification against the NSAP portal.'}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-mono font-semibold text-amber-900">
                  <span className="bg-amber-200/70 px-2 py-0.5 rounded">version: {evaluation.version}</span>
                  <span className="bg-amber-200/70 px-2 py-0.5 rounded">last_verified: {evaluation.lastVerified}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Primary Verdict Banner: NEVER "Approved"! Must say "You may be eligible" */}
        <div className={`p-5 sm:p-6 rounded-2xl border text-center ${
          evaluation.isPotentiallyEligible
            ? 'bg-gradient-to-b from-red-50 to-rose-100/60 border-red-300'
            : 'bg-gradient-to-b from-slate-50 to-slate-100 border-slate-300'
        }`}>
          <div className="inline-flex p-3 rounded-2xl mb-3 shadow-inner bg-white">
            {evaluation.isPotentiallyEligible ? (
              <CheckCircle2 className="w-8 h-8 text-brandRed" />
            ) : (
              <XCircle className="w-8 h-8 text-amber-600" />
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {isHi ? evaluation.statusText_hi : evaluation.statusText_en}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            {isHi ? evaluation.schemeName_hi : evaluation.schemeName_en}
          </p>
          <p className="text-xs text-slate-500 mt-2 italic">
            {isHi
              ? '* यह कंप्यूटर जनित संभावित पात्रता है, कोई सरकारी स्वीकृति नहीं।'
              : '* Preliminary algorithmic match based on self-reported facts, not a government sanction.'}
          </p>
        </div>

        {/* Matched Conditions */}
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-brandRed font-bold flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-brandRed" />
            {isHi ? `पूरी हुई शर्तें (${evaluation.matchedRules.length})` : `Conditions Matched (${evaluation.matchedRules.length})`}
          </h2>
          {evaluation.matchedRules.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
              {isHi ? 'कोई शर्त पूरी नहीं हुई।' : 'No conditions matched.'}
            </p>
          ) : (
            <div className="space-y-2.5">
              {evaluation.matchedRules.map(rule => (
                <div
                  key={rule.id}
                  className="p-3.5 rounded-2xl bg-red-50/40 border border-red-200 flex items-start justify-between gap-3 text-sm"
                >
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brandRed mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900">
                        {isHi ? rule.title_hi : rule.title_en}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {isHi ? rule.description_hi : rule.description_en}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-brandRed font-bold bg-red-100 px-2 py-0.5 rounded-md flex-shrink-0">
                    {rule.condition}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Missing Conditions */}
        {evaluation.missingRules.length > 0 && (
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-2 mb-3">
              <XCircle className="w-4 h-4 text-amber-600" />
              {isHi ? `अधूरी शर्तें (${evaluation.missingRules.length})` : `Conditions Missing (${evaluation.missingRules.length})`}
            </h2>
            <div className="space-y-2.5">
              {evaluation.missingRules.map(rule => (
                <div
                  key={rule.id}
                  className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start justify-between gap-3 text-sm"
                >
                  <div className="flex items-start gap-2.5">
                    <XCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900">
                        {isHi ? rule.title_hi : rule.title_en}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {isHi ? rule.description_hi : rule.description_en}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md flex-shrink-0">
                    {rule.condition}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* "Why?" Panel with Official NSAP Source Link (Mandatory Requirement) */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/70">
          <button
            type="button"
            onClick={() => setShowWhyPanel(!showWhyPanel)}
            className="w-full min-h-[44px] px-4 py-3 flex items-center justify-between text-left font-bold text-slate-900 hover:bg-slate-100/70"
          >
            <div className="flex items-center gap-2 text-sm">
              <HelpCircle className="w-4 h-4 text-brandRed" />
              <span>{isHi ? 'यह परिणाम कैसे तय हुआ? (Why?)' : 'How was this calculated? (Why?)'}</span>
            </div>
            <span className="text-xs text-brandRed underline font-semibold">
              {showWhyPanel ? (isHi ? 'छिपाएं' : 'Hide') : (isHi ? 'देखें' : 'View')}
            </span>
          </button>

          {showWhyPanel && (
            <div className="p-4 pt-1 border-t border-slate-200 text-xs sm:text-sm text-slate-700 space-y-3">
              <p className="leading-relaxed">
                {isHi
                  ? 'यह गणना किसी AI द्वारा नहीं, बल्कि एक पारदर्शी, स्थानीय कंप्यूटर नियम इंजन (Deterministic Rules Engine) द्वारा की गई है।'
                  : 'This evaluation is computed deterministically in code without AI. All rules are loaded from /data/rules/widow-pension.json.'}
              </p>

              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Source:</span>
                  <a
                    href={evaluation.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brandRed font-bold hover:underline flex items-center gap-1"
                  >
                    <span>{evaluation.sourceUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Last Verified:</span>
                  <span className="font-semibold text-slate-800">{evaluation.lastVerified}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Verification Status:</span>
                  <span className="font-semibold text-amber-700">Unverified [Placeholders]</span>
                </div>
              </div>
            </div>
          )}
        </div>

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
            onClick={onNext}
            className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-brandRed hover:bg-deepRed text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-md shadow-brandRed/25 cursor-pointer"
          >
            <span>{isHi ? 'दस्तावेज़ डॉक्टर (दस्तावेज़ जांच)' : 'Proceed to Document Doctor'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

