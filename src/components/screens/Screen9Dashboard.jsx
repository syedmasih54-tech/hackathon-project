import React from 'react';
import { BarChart3, AlertTriangle, ArrowLeft, TrendingUp, Clock, FileWarning, ShieldAlert } from 'lucide-react';

export default function Screen9Dashboard({ onBack, lang = 'hi' }) {
  const isHi = lang === 'hi';

  const sampleDistricts = [
    { district: isHi ? 'वाराणसी (Varanasi)' : 'Varanasi', avgDays: 42, pendingCases: 1420, topBlocker: isHi ? 'नाम में अंतर' : 'Name mismatch' },
    { district: isHi ? 'पटना (Patna)' : 'Patna', avgDays: 54, pendingCases: 2180, topBlocker: isHi ? 'NPCI बैंक सीडिंग' : 'NPCI seeding' },
    { district: isHi ? 'लखनऊ (Lucknow)' : 'Lucknow', avgDays: 35, pendingCases: 980, topBlocker: isHi ? 'ब्लॉक सत्यापन' : 'Block verification' },
    { district: isHi ? 'गया (Gaya)' : 'Gaya', avgDays: 48, pendingCases: 1250, topBlocker: isHi ? 'दस्तावेज़ अस्पष्टता' : 'Unclear document' },
    { district: isHi ? 'जयपुर (Jaipur)' : 'Jaipur', avgDays: 39, pendingCases: 890, topBlocker: isHi ? 'मृत्यु प्रमाण पत्र' : 'Death certificate' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* MANDATORY PROMINENT SAMPLE DATA DISCLAIMER */}
      <div className="bg-amber-500 text-slate-950 p-4 sm:p-5 rounded-3xl shadow-lg border-2 border-amber-600 flex items-start gap-3">
        <div className="p-2 bg-amber-400 rounded-2xl flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-slate-950" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-black uppercase tracking-wide">
            {isHi ? '⚠️ नमूना डेटा - वास्तविक मामलों से नहीं' : '⚠️ SAMPLE DATA — NOT FROM REAL CASES'}
          </h1>
          <p className="text-xs sm:text-sm font-semibold mt-1 text-slate-900 leading-relaxed">
            {isHi
              ? 'यह डैशबोर्ड केवल उदाहरणात्मक शोध और सिमुलेशन के लिए है। किसी भी वास्तविक नागरिक का डेटा यहाँ प्रदर्शित या मिश्रित नहीं किया गया है।'
              : 'This dashboard contains illustrative simulation data for transparency demonstrations only. No real citizen data is stored or mixed into this view.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-brandRed" />
              {isHi ? 'प्रशासनिक पारदर्शिता शोध' : 'Administrative Transparency Research'}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isHi ? 'ज़िला-स्तरीय विलंब अंतर्दृष्टि (सिम्युलेटेड)' : 'District Delay Insights (Simulated Mockup)'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="min-h-[44px] px-4 py-2 rounded-2xl border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHi ? 'मुख्य आवेदन प्रवाह पर लौटें' : 'Return to Flow'}</span>
          </button>
        </div>

        {/* Aggregated Sample Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isHi ? 'औसत विलंब (नमूना)' : 'Average Delay (Sample)'}
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">43.6 {isHi ? 'दिन' : 'days'}</div>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-2">
              [PLACEHOLDER MOCKUP]
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isHi ? 'शीर्ष कारण (नमूना)' : 'Top Delay Reason (Sample)'}
            </span>
            <div className="text-base font-extrabold text-slate-900 mt-1">
              {isHi ? 'दस्तावेज़ों में नाम अंतर (38%)' : 'Name Mismatch (38%)'}
            </div>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-2">
              [PLACEHOLDER MOCKUP]
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isHi ? 'पोर्टल स्थिति (नमूना)' : 'CPGRAMS Resolution Rate'}
            </span>
            <div className="text-3xl font-black text-brandRed mt-1">71.4%</div>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-2">
              [PLACEHOLDER MOCKUP]
            </span>
          </div>
        </div>

        {/* Sample District Delay Table */}
        <div>
          <h3 className="font-extrabold text-slate-900 text-base mb-3 flex items-center justify-between">
            <span>{isHi ? 'ज़िलावार विलंब अवलोकन' : 'District Breakdown'}</span>
            <span className="text-xs font-normal text-slate-500 italic">
              {isHi ? '*सभी आंकड़े काल्पनिक शोध नमूने हैं' : '*All numbers are hypothetical research samples'}
            </span>
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px]">
                <tr>
                  <th className="p-3.5">{isHi ? 'ज़िला' : 'District'}</th>
                  <th className="p-3.5">{isHi ? 'औसत विलंब' : 'Avg Delay'}</th>
                  <th className="p-3.5">{isHi ? 'लंबित आवेदन' : 'Pending Cases'}</th>
                  <th className="p-3.5">{isHi ? 'मुख्य बाधा' : 'Primary Blocker'}</th>
                  <th className="p-3.5">{isHi ? 'लेबल' : 'Tag'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {sampleDistricts.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">{d.district}</td>
                    <td className="p-3.5">{d.avgDays} {isHi ? 'दिन' : 'days'}</td>
                    <td className="p-3.5 font-mono">{d.pendingCases}</td>
                    <td className="p-3.5">{d.topBlocker}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        SAMPLE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Return Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onBack}
            className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-brandRed hover:bg-deepRed text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-md shadow-brandRed/25"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHi ? 'आवेदन प्रवाह पर वापस जाएं' : 'Return to Active Workflow'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}


