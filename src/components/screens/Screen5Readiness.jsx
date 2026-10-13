import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Info,
  Printer
} from 'lucide-react';
import SpeakButton from '../SpeakButton.jsx';
import { evaluateRules } from '../../utils/rulesEngine.js';
import { fetchSchemeRules } from '../../utils/rulesLoader.js';

export default function Screen5Readiness({
  caseData,
  onNext,
  onBack,
  lang = 'hi'
}) {
  const isHi = lang === 'hi';
  const [rulesConfig, setRulesConfig] = useState(null);
  const [resolvedOverrides, setResolvedOverrides] = useState({});

  useEffect(() => {
    const schemeKey = caseData?.selectedScheme || 'widow-pension';
    fetchSchemeRules(schemeKey).then(data => setRulesConfig(data));
  }, [caseData?.selectedScheme]);

  const evaluation = evaluateRules(
    rulesConfig,
    caseData,
    caseData?.nameComparison
  );

  const baseChecklist = evaluation.checklist;
  const totalItems = baseChecklist.length || 5;
  const satisfiedCount = baseChecklist.filter(c => c.satisfied || resolvedOverrides[c.id]).length;
  const percentage = Math.round((satisfiedCount / totalItems) * 100);

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-6">
        {/* Step Indicator & Header Actions */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              {isHi ? 'चरण 5: तैयारी कार्ड' : 'Step 5: Readiness Card'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isHi ? 'आवेदन तैयारी स्कोर' : 'Application Readiness Score'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isHi
                ? 'नियमों के आधार पर आपकी तैयारी का प्रतिशत और आवश्यक अगले कदम।'
                : 'Rule-derived completion percentage and specific next steps.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SpeakButton
              text={isHi
                ? `आपका तैयारी स्कोर ${percentage} प्रतिशत है। कुल ${satisfiedCount} शर्तें संतुष्ट हैं।`
                : `Your readiness score is ${percentage} percent. ${satisfiedCount} of ${totalItems} criteria are met.`}
              lang={lang}
              size="sm"
            />

            <button
              type="button"
              onClick={() => window.print()}
              title={isHi ? 'चेकलिस्ट प्रिंट करें' : 'Print checklist'}
              className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isHi ? 'प्रिंट' : 'Print'}</span>
            </button>
          </div>
        </div>

        {/* 100% Celebration Banner */}
        {percentage === 100 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg flex items-center gap-3 animate-in zoom-in-95 duration-300">
            <div className="p-2.5 rounded-xl bg-white/20 flex-shrink-0">
              <Sparkles className="w-6 h-6 text-yellow-300 animate-spin [animation-duration:6s]" />
            </div>
            <div className="text-xs sm:text-sm">
              <p className="font-black text-base">
                {isHi ? '🎉 बधाई! आपका आवेदन 100% तैयार है' : '🎉 Congratulations! 100% Ready'}
              </p>
              <p className="text-emerald-100 mt-0.5">
                {isHi
                  ? 'आपके सभी 5 मुख्य मापदंड पूरे हैं। अब आप अपने नज़दीकी CSC केंद्र अथवा तहसील में बेझिझक आवेदन जमा कर सकते हैं।'
                  : 'All 5 key criteria are satisfied. You are fully prepared to submit your case at your nearest CSC / Block office.'}
              </p>
            </div>
          </div>
        )}

        {/* Readiness Percentage Hero Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                {isHi ? 'कुल तैयारी' : 'Overall Readiness'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                  {percentage}%
                </span>
                <span className="text-slate-400 text-sm font-semibold">
                  / 100%
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-sm">
                {percentage === 100
                  ? (isHi ? 'बहुत बढ़िया! आपके सभी 5 मुख्य मापदंड पूरे हैं।' : 'Excellent! All 5 primary readiness criteria are satisfied.')
                  : (isHi ? `आपके 5 में से ${satisfiedCount} मापदंड तैयार हैं। नीचे दिए गए कदमों को पूरा करें या टिक करें।` : `${satisfiedCount} of 5 criteria met. Follow the action items below or simulate completion.`)}
              </p>
            </div>

            {/* Circular Graphic or Progress Meter */}
            <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-700"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-emerald-400 transition-all duration-700"
                  strokeWidth="10"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * percentage) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute font-extrabold text-lg text-emerald-300">
                {percentage}%
              </div>
            </div>
          </div>
        </div>

        {/* 5-Item Checklist with Interactive Toggles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">
              {isHi ? 'नियम चेकलिस्ट (5 मुख्य बिंदु)' : 'Rule Checklist (5 Core Pillars)'}
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              {satisfiedCount} / {totalItems} {isHi ? 'पूर्ण' : 'Completed'}
            </span>
          </div>

          <div className="space-y-3">
            {baseChecklist.map((item) => {
              const isSatisfied = item.satisfied || !!resolvedOverrides[item.id];

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSatisfied
                      ? 'bg-emerald-50/60 border-emerald-300'
                      : 'bg-red-50/60 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-0.5 flex-shrink-0">
                        {isSatisfied ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-sm">
                          {isHi ? item.label_hi : item.label_en}
                        </h3>
                        {isSatisfied ? (
                          <p className="text-xs text-emerald-800 mt-0.5 font-medium">
                            {isHi ? 'सत्यापित / तैयार है' : 'Verified & Satisfied'}
                            {resolvedOverrides[item.id] && ` (${isHi ? 'सिम्युलेटेड' : 'Simulated'})`}
                          </p>
                        ) : (
                          <div className="mt-2 p-3 bg-white rounded-xl border border-red-200 text-xs text-slate-700 space-y-1">
                            <p className="font-bold text-red-700 flex items-center gap-1">
                              <span>👉 {isHi ? 'आवश्यक अगला कदम:' : 'Exact Next Step:'}</span>
                            </p>
                            <p className="leading-relaxed">
                              {isHi ? item.next_step_hi : item.next_step_en}
                            </p>
                          </div>
                        )}

                        {/* Interactive What-If Toggle for items missing */}
                        {!item.satisfied && (
                          <label className="flex items-center gap-2 mt-2.5 pt-2 border-t border-slate-200/80 cursor-pointer text-xs font-semibold text-slate-700 hover:text-emerald-800">
                            <input
                              type="checkbox"
                              checked={!!resolvedOverrides[item.id]}
                              onChange={(e) => setResolvedOverrides(prev => ({
                                ...prev,
                                [item.id]: e.target.checked
                              }))}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                            />
                            <span>
                              {isHi
                                ? 'यह कदम मैंने पूरा कर लिया है (स्कोर में जोड़ें)'
                                : 'Mark as completed (simulate 100% score)'}
                            </span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
            className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-md shadow-emerald-200"
          >
            <span>{isHi ? 'आवेदन स्थिति देखें (Status Tracker)' : 'Proceed to Status Tracker'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
