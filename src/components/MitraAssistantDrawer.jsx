import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  PhoneCall,
  Search,
  BookOpen,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import SpeakButton from './SpeakButton.jsx';

export default function MitraAssistantDrawer({
  isOpen,
  onClose,
  lang = 'hi'
}) {
  if (!isOpen) return null;
  const isHi = lang === 'hi';

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(0);

  const helplines = [
    {
      name_hi: 'वृद्धा/विधवा पेंशन राष्ट्रीय हेल्पलाइन (Elderline)',
      name_en: 'National Pension Helpline (Elderline)',
      number: '14567',
      timing: '8 AM - 8 PM'
    },
    {
      name_hi: 'पीएम-किसान सम्मान निधि हेल्पलाइन',
      name_en: 'PM-KISAN Farmers Support Helpline',
      number: '155261',
      timing: 'Toll-Free 24x7'
    },
    {
      name_hi: 'महिला हेल्पलाइन (Women Helpline)',
      name_en: 'Women Helpline',
      number: '181',
      timing: 'Toll-Free 24x7'
    },
    {
      name_hi: 'राष्ट्रीय छात्रवृत्ति हेल्पलाइन (NSP Helpdesk)',
      name_en: 'National Scholarship Portal Helpdesk',
      number: '0120-6619540',
      timing: '9 AM - 5:30 PM'
    },
    {
      name_hi: 'मुख्यमंत्री जन-सुनवाई हेल्पलाइन (CM Helpline)',
      name_en: 'Chief Minister Grievance Helpline',
      number: '1076',
      timing: '24x7 Toll-Free'
    }
  ];

  const faqs = [
    {
      q_hi: 'बैंक खाते में DBT / NPCI सीडिंग कैसे कराएं?',
      q_en: 'How to do NPCI / DBT bank seeding?',
      a_hi: 'पेंशन या किसान सम्मान निधि पाने के लिए केवल बैंक खाता होना पर्याप्त नहीं है, बल्कि वह आधार से NPCI पर मैप होना चाहिए। अपनी बैंक शाखा में जाएं और "Aadhaar NPCI Mapping Form" भरकर जमा करें। 48 घंटों में आपका खाता DBT के लिए सक्रिय हो जाता है।',
      a_en: 'For direct benefit transfer, your savings account must be seeded with NPCI. Visit your bank branch and submit the Aadhaar-NPCI mandate form. It is mapped within 48 hours.',
      tag: 'Bank'
    },
    {
      q_hi: 'राशन कार्ड और बैंक पासबुक के नाम में अंतर होने पर क्या करें?',
      q_en: 'What if names differ between ration card and passbook?',
      a_hi: 'BenefitBridge का नाम-मिलान इंजन उपनाम, आदरसूचक शब्द (श्रीमती/कुमारी) और संक्षिप्त अक्षरों (जैसे S. Devi बनाम Sunita Devi) को स्वचालित पहचानता है। यदि नाम में भारी अंतर है, तो अपने नज़दीकी CSC केंद्र या ग्राम विकास अधिकारी से एक स्व-घोषणा पत्र (Affidavit) बनवाकर संलग्न करें।',
      a_en: 'BenefitBridge automatically handles initials, transliteration, and honorifics. If names differ fundamentally, obtain a standard notary affidavit from your local CSC / Tehsil.',
      tag: 'Docs'
    },
    {
      q_hi: 'भूलेख / खतौनी (PM-KISAN) ऑनलाइन कैसे देखें?',
      q_en: 'How to check Land Record (Khatauni) online?',
      a_hi: 'उत्तर प्रदेश के लिए upbhulekh.gov.in या बिहार के लिए biharbhumi.bihar.gov.in पर जाएं। अपने ज़िला, तहसील और ग्राम का चयन करें और खसरा नंबर डालकर अपनी खतौनी का निःशुल्क डिजिटल प्रिंट प्राप्त करें।',
      a_en: 'Visit your state revenue portal (e.g. upbhulekh.gov.in). Select your district, tehsil, and village, and enter your Khasra number to view/download official land records.',
      tag: 'Farmers'
    },
    {
      q_hi: 'आवेदन जमा किए 45 दिन से अधिक हो गए, क्या करें?',
      q_en: 'Application pending for over 45 days, what to do?',
      a_hi: 'सरकारी नागरिक अधिकार पत्र के अनुसार 45 दिनों में पेंशन या सत्यापन निस्तारण होना अनिवार्य है। आप BenefitBridge के "शिकायत निवारण" टैब से स्वचालित औपचारिक पत्र तैयार कर सीधे pgportal.gov.in या 1076 पर शिकायत दर्ज कर सकते हैं।',
      a_en: 'By citizen charter norms, applications must be cleared within 45 days. Use our Grievance screen to generate a structured complaint letter and file it on pgportal.gov.in.',
      tag: 'Grievance'
    }
  ];

  const filteredFaqs = faqs.filter(f => {
    const q = isHi ? f.q_hi : f.q_en;
    const a = isHi ? f.a_hi : f.a_en;
    return q.toLowerCase().includes(searchQuery.toLowerCase()) || a.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white max-w-md w-full h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-brandRed text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-red-200" />
            </div>
            <div>
              <h2 className="font-extrabold text-base">
                {isHi ? 'बेनिफ़िट मित्र (नागरिक सहायता)' : 'Benefit Mitra (Citizen Helpdesk)'}
              </h2>
              <p className="text-xs text-red-100">
                {isHi ? 'हेल्पलाइन नंबर और अक्सर पूछे जाने वाले सवाल' : 'Helplines & Official Solutions'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl hover:bg-white/10 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={isHi ? 'समस्या या सवाल खोजें (उदा. NPCI, खतौनी)...' : 'Search issues (e.g. NPCI, land record)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brandRed"
            />
          </div>
        </div>

        {/* Content Tabs / Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Official Helplines */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-brandRed" />
              <span>{isHi ? 'आधिकारिक सरकारी टोल-फ्री हेल्पलाइन' : 'Official Government Helplines'}</span>
            </h3>

            <div className="space-y-2">
              {helplines.map((hl, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                >
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">
                      {isHi ? hl.name_hi : hl.name_en}
                    </h4>
                    <span className="text-[10px] text-slate-500">{hl.timing}</span>
                  </div>
                  <a
                    href={`tel:${hl.number}`}
                    className="px-3 py-1.5 rounded-xl bg-brandRed hover:bg-deepRed text-white font-mono font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>{hl.number}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions & FAQs */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-brandRed" />
              <span>{isHi ? 'समाधान एवं प्रक्रियाएं (FAQs)' : 'Guides & FAQs'}</span>
            </h3>

            <div className="space-y-2">
              {filteredFaqs.map((faq, i) => {
                const isOpen = expandedFaq === i;
                const question = isHi ? faq.q_hi : faq.q_en;
                const answer = isHi ? faq.a_hi : faq.a_en;

                return (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : i)}
                      className="w-full p-3.5 text-left font-bold text-xs text-slate-900 flex items-center justify-between gap-2 hover:bg-slate-50"
                    >
                      <span>{question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-3.5 pt-0 border-t border-slate-100 bg-slate-50/60 text-xs text-slate-700 leading-relaxed">
                        <p>{answer}</p>
                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200">
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-brandRed font-bold text-[10px] font-bold">
                            {faq.tag}
                          </span>
                          <SpeakButton
                            text={answer}
                            lang={lang}
                            size="sm"
                            labelHi="उत्तर सुनें"
                            labelEn="Listen"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 text-center">
          {isHi
            ? '🔒 आपकी कोई भी निजी जानकारी एकत्र नहीं की जाती है।'
            : '🔒 Zero server logging. All data stored strictly on your device.'}
        </div>
      </div>
    </div>
  );
}




