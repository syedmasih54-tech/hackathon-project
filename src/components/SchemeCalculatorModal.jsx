import React, { useState } from 'react';
import { Calculator, X, Heart, Tractor, GraduationCap, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { SCHEMES } from '../utils/rulesLoader.js';

export default function SchemeCalculatorModal({
  isOpen,
  onClose,
  onSelectScheme,
  lang = 'hi'
}) {
  if (!isOpen) return null;
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState('widow-pension');
  const [age, setAge] = useState(48);
  const [income, setIncome] = useState(150000);
  const [hasLand, setHasLand] = useState(true);
  const [isWidowed, setIsWidowed] = useState(true);
  const [isStudent, setIsStudent] = useState(true);

  // Scheme specific calculations
  const calculateWidowEligibility = () => {
    const ageOk = age >= 40;
    const widowOk = isWidowed;
    const eligible = ageOk && widowOk;
    return {
      eligible,
      monthlyAmount: 1000,
      annualAmount: 12000,
      reasons: [
        { label: isHi ? 'आयु 40 वर्ष या अधिक' : 'Age 40 or above', passed: ageOk },
        { label: isHi ? 'वैवाहिक स्थिति: विधवा' : 'Marital Status: Widowed', passed: widowOk },
        { label: isHi ? 'बीपीएल / अंत्योदय श्रेणी' : 'BPL / Antyodaya Category', passed: true }
      ]
    };
  };

  const calculateFarmerEligibility = () => {
    const ageOk = age >= 18;
    const landOk = hasLand;
    const eligible = ageOk && landOk;
    return {
      eligible,
      monthlyAmount: 500,
      annualAmount: 6000, // ₹2,000 in 3 installments
      reasons: [
        { label: isHi ? 'आयु 18 वर्ष या अधिक' : 'Age 18 or above', passed: ageOk },
        { label: isHi ? 'कृषि योग्य भूमि का स्वामित्व' : 'Cultivable Landholding', passed: landOk },
        { label: isHi ? 'गैर-आयकर दाता बहिष्करण' : 'Non-Taxpayer Exclusion', passed: true }
      ]
    };
  };

  const calculateScholarshipEligibility = () => {
    const incomeOk = income <= 250000;
    const studentOk = isStudent;
    const eligible = incomeOk && studentOk;
    return {
      eligible,
      monthlyAmount: 2000,
      annualAmount: 24000,
      reasons: [
        { label: isHi ? 'नियमित कॉलेज/संस्थान नामांकन' : 'Regular Institution Enrollment', passed: studentOk },
        { label: isHi ? 'वार्षिक आय ≤ ₹2.50 लाख' : 'Annual Income ≤ ₹2.50 Lakh', passed: incomeOk },
        { label: isHi ? 'पिछली परीक्षा में ≥ 50% अंक' : 'Previous Exam Marks ≥ 50%', passed: true }
      ]
    };
  };

  let currentCalc;
  if (activeTab === 'pm-kisan') {
    currentCalc = calculateFarmerEligibility();
  } else if (activeTab === 'post-matric-scholarship') {
    currentCalc = calculateScholarshipEligibility();
  } else {
    currentCalc = calculateWidowEligibility();
  }

  const handleStartScheme = () => {
    onSelectScheme(activeTab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-brandRed font-bold flex items-center justify-center shadow-sm">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {isHi ? 'इंटरैक्टिव योजना एवं लाभ कैलकुलेटर' : 'Interactive Scheme & Benefit Calculator'}
            </h2>
            <p className="text-xs text-slate-500">
              {isHi
                ? 'मापदंड बदलें और वास्तविक समय में संभावित वित्तीय सहायता देखें'
                : 'Adjust inputs to simulate real-time scheme eligibility & payouts'}
            </p>
          </div>
        </div>

        {/* Scheme Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('widow-pension')}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'widow-pension'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-pink-500" />
            <span>{isHi ? 'विधवा पेंशन' : 'Widow'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pm-kisan')}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'pm-kisan'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tractor className="w-3.5 h-3.5 text-brandRed" />
            <span>{isHi ? 'पीएम-किसान' : 'PM-KISAN'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('post-matric-scholarship')}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'post-matric-scholarship'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            <span>{isHi ? 'छात्रवृत्ति' : 'Scholarship'}</span>
          </button>
        </div>

        {/* Interactive Controls */}
        <div className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
          {/* Age Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
              <span>{isHi ? 'आयु (वर्ष)' : 'Age (Years)'}</span>
              <span className="px-2 py-0.5 rounded bg-red-100 text-brandRed font-bold font-mono text-sm">
                {age} {isHi ? 'वर्ष' : 'yrs'}
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full accent-brandRed cursor-pointer"
            />
          </div>

          {/* Scheme Specific Interactive Controls */}
          {activeTab === 'widow-pension' && (
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={isWidowed}
                  onChange={(e) => setIsWidowed(e.target.checked)}
                  className="w-4 h-4 rounded text-brandRed focus:ring-brandRed"
                />
                <span>{isHi ? 'वैवाहिक स्थिति: विधवा महिला' : 'Marital status: Widow'}</span>
              </label>
            </div>
          )}

          {activeTab === 'pm-kisan' && (
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={hasLand}
                  onChange={(e) => setHasLand(e.target.checked)}
                  className="w-4 h-4 rounded text-brandRed focus:ring-brandRed"
                />
                <span>{isHi ? 'राजस्व रिकॉर्ड में कृषि योग्य भूमि दर्ज है' : 'Holds cultivable land in revenue record'}</span>
              </label>
            </div>
          )}

          {activeTab === 'post-matric-scholarship' && (
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                  <span>{isHi ? 'पारिवारिक वार्षिक आय' : 'Annual Family Income'}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-xs">
                    ₹{income.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="400000"
                  step="10000"
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={isStudent}
                  onChange={(e) => setIsStudent(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>{isHi ? 'कक्षा 11+ / कॉलेज में नियमित अध्ययनरत' : 'Enrolled in post-matric / college course'}</span>
              </label>
            </div>
          )}
        </div>

        {/* Live Simulation Card */}
        <div className={`p-5 rounded-2xl border text-center transition-all ${
          currentCalc.eligible
            ? 'bg-gradient-to-br from-brandRed to-deepRed text-white shadow-lg'
            : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}>
          <div className="text-xs uppercase font-bold tracking-wider opacity-90 mb-1">
            {currentCalc.eligible
              ? (isHi ? '🎉 आप संभावित रूप से पात्र हैं' : '🎉 You May Be Eligible')
              : (isHi ? '⚠️ कुछ शर्तें पूरी नहीं हैं' : '⚠️ Criteria Not Met')}
          </div>

          <div className="text-3xl sm:text-4xl font-black mt-1">
            ₹{currentCalc.annualAmount.toLocaleString('en-IN')}
            <span className="text-sm font-normal opacity-80"> / {isHi ? 'वर्ष' : 'year'}</span>
          </div>

          <div className="text-xs mt-1 opacity-90">
            {activeTab === 'pm-kisan'
              ? (isHi ? '(₹2,000 की 3 त्रैमासिक किस्तों में सीधे बैंक खाते में)' : '(₹2,000 in 3 installments directly via DBT)')
              : activeTab === 'widow-pension'
              ? (isHi ? '(लगभग ₹1,000 प्रति माह राज्य नियमों के अनुसार)' : '(Approx ₹1,000/month as per state norms)')
              : (isHi ? '(ट्यूशन शुल्क प्रतिपूर्ति + रख-रखाव भत्ता)' : '(Tuition fee reimbursement + maintenance allowance)')}
          </div>

          {/* Quick Checklist Indicators */}
          <div className="mt-4 pt-3 border-t border-white/20 grid grid-cols-1 gap-1.5 text-left text-xs">
            {currentCalc.reasons.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                {r.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-red-200 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                )}
                <span className={r.passed ? 'font-medium' : 'text-amber-900 font-semibold line-through'}>
                  {r.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs"
          >
            {isHi ? 'बंद करें' : 'Close'}
          </button>

          <button
            type="button"
            onClick={handleStartScheme}
            className="px-5 py-2.5 rounded-xl bg-brandRed hover:bg-deepRed text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-brandRed/25"
          >
            <span>{isHi ? 'इस योजना के लिए आवेदन भरें' : 'Apply for this Scheme'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}



