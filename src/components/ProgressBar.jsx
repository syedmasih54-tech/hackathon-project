import React from 'react';
import { Check } from 'lucide-react';

export const FLOW_STEPS = [
  { id: 'consent', num: 1, title_hi: 'सहमति', title_en: 'Consent' },
  { id: 'intake', num: 2, title_hi: 'जानकारी', title_en: 'Intake' },
  { id: 'eligibility', num: 3, title_hi: 'पात्रता', title_en: 'Eligibility' },
  { id: 'documents', num: 4, title_hi: 'दस्तावेज़', title_en: 'Docs Doctor' },
  { id: 'readiness', num: 5, title_hi: 'तैयारी स्कोर', title_en: 'Readiness' },
  { id: 'status', num: 6, title_hi: 'स्थिति', title_en: 'Status' },
  { id: 'timeline', num: 7, title_hi: 'टाइमलाइन', title_en: 'Timeline' },
  { id: 'complaint', num: 8, title_hi: 'शिकायत', title_en: 'Complaint' }
];

export default function ProgressBar({ currentStepId, onStepClick, lang = 'hi' }) {
  const isHi = lang === 'hi';
  const currentStepIndex = FLOW_STEPS.findIndex(s => s.id === currentStepId);

  // If outside known flow steps (e.g. dashboard), return null
  if (currentStepIndex === -1) return null;

  const currentStep = FLOW_STEPS[currentStepIndex];
  const progressPercent = Math.round(((currentStepIndex + 1) / FLOW_STEPS.length) * 100);

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2.5 shadow-sm sticky top-[110px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Header: Step X of 8 */}
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
          <span className="text-brandRed bg-red-50 border border-red-200 px-3 py-1 rounded-full font-bold">
            {isHi ? `चरण ${currentStep.num} / ${FLOW_STEPS.length}: ` : `Step ${currentStep.num} of ${FLOW_STEPS.length}: `}
            <span>{isHi ? currentStep.title_hi : currentStep.title_en}</span>
          </span>
          <span className="text-slate-600 font-mono font-bold">
            {progressPercent}%
          </span>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brandRed to-deepRed transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Stepper Quick Navigation */}
        <div className="hidden sm:flex items-center justify-between mt-2.5 pt-1 overflow-x-auto">
          {FLOW_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onStepClick(step.id)}
                className={`flex items-center gap-1.5 text-xs font-medium min-h-[36px] px-2.5 py-1 rounded-xl transition-all ${
                  isCurrent
                    ? 'text-brandRed font-bold bg-red-50 ring-1 ring-red-300 shadow-sm'
                    : isCompleted
                    ? 'text-slate-700 hover:text-brandRed hover:bg-red-50/50 cursor-pointer'
                    : 'text-slate-400 opacity-60'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent
                      ? 'bg-brandRed text-white shadow-sm'
                      : isCompleted
                      ? 'bg-red-100 text-brandRed font-black'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : step.num}
                </span>
                <span>{isHi ? step.title_hi : step.title_en}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
