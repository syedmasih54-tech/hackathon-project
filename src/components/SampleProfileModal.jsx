import React from 'react';
import { Sparkles, Heart, Tractor, GraduationCap, X, Check, ArrowRight } from 'lucide-react';
import { generateSampleDocumentImage } from '../utils/sampleDocGenerator.js';

export const SAMPLE_PROFILES = [
  {
    id: 'widow-sunita',
    schemeId: 'widow-pension',
    name: 'Sunita Devi',
    nameHi: 'सुनीता देवी',
    roleHi: 'विधवा पेंशन लाभार्थी (52 वर्ष, बीपीएल, वाराणसी)',
    roleEn: 'Widow Pension Beneficiary (52 yrs, BPL, Varanasi)',
    icon: Heart,
    color: 'from-pink-500 to-rose-600',
    data: {
      selectedScheme: 'widow-pension',
      state: 'UP',
      district: 'varanasi',
      age: '52',
      gender: 'female',
      marital_status: 'widowed',
      ration_card_type: 'BPL',
      has_bank_account: 'yes',
      ration_name: 'Sunita Devi',
      confirmedRationName: 'Sunita Devi',
      confirmedPassbookName: 'Sunita Devi',
      referenceNumber: 'UP2026WIDOW7841',
      applicationDate: '2026-08-10',
      applicationStatus: 'delayed'
    },
    doc1Type: 'ration',
    doc2Type: 'passbook'
  },
  {
    id: 'farmer-rameshwar',
    schemeId: 'pm-kisan',
    name: 'Rameshwar Singh',
    nameHi: 'रामेश्वर सिंह',
    roleHi: 'किसान सम्मान निधि लाभार्थी (48 वर्ष, गोरखपुर)',
    roleEn: 'PM-KISAN Farmer Beneficiary (48 yrs, Gorakhpur)',
    icon: Tractor,
    color: 'from-brandRed to-deepRed',
    data: {
      selectedScheme: 'pm-kisan',
      state: 'UP',
      district: 'gorakhpur',
      age: '48',
      gender: 'male',
      marital_status: 'married',
      ration_card_type: 'Other',
      has_bank_account: 'yes',
      owns_cultivable_land: 'yes',
      is_taxpayer_excluded: 'no',
      ration_name: 'Rameshwar Singh',
      confirmedRationName: 'Rameshwar Singh',
      confirmedPassbookName: 'Rameshwar Singh',
      referenceNumber: 'UP2026KISAN9832',
      applicationDate: '2026-08-01',
      applicationStatus: 'delayed'
    },
    doc1Type: 'land',
    doc2Type: 'passbook'
  },
  {
    id: 'student-amit',
    schemeId: 'post-matric-scholarship',
    name: 'Amit Kumar',
    nameHi: 'अमित कुमार',
    roleHi: 'पोस्ट-मैट्रिक छात्रवृत्ति (19 वर्ष, पटना, आय: ₹1.60 लाख)',
    roleEn: 'Post-Matric Scholarship (19 yrs, Patna, Inc: ₹1.60L)',
    icon: GraduationCap,
    color: 'from-blue-500 to-indigo-600',
    data: {
      selectedScheme: 'post-matric-scholarship',
      state: 'BR',
      district: 'patna',
      age: '19',
      gender: 'male',
      marital_status: 'single',
      ration_card_type: 'BPL',
      has_bank_account: 'yes',
      is_enrolled_student: 'yes',
      family_income: '160000',
      previous_marks_percentage: '74',
      ration_name: 'Amit Kumar',
      confirmedRationName: 'Amit Kumar',
      confirmedPassbookName: 'Amit Kumar',
      referenceNumber: 'BR2026SCHOLAR4109',
      applicationDate: '2026-08-15',
      applicationStatus: 'block_verification'
    },
    doc1Type: 'student_id',
    doc2Type: 'passbook'
  }
];

export default function SampleProfileModal({
  isOpen,
  onClose,
  onSelectProfile,
  lang = 'hi'
}) {
  if (!isOpen) return null;
  const isHi = lang === 'hi';

  const handleApplyProfile = (profile) => {
    // Generate realistic sample documents
    const doc1 = generateSampleDocumentImage({
      type: profile.doc1Type,
      name: profile.name,
      state: profile.data.state === 'UP' ? 'Uttar Pradesh' : 'Bihar',
      district: profile.data.district.toUpperCase(),
      schemeId: profile.schemeId
    });

    const doc2 = generateSampleDocumentImage({
      type: profile.doc2Type,
      name: profile.name,
      state: profile.data.state === 'UP' ? 'Uttar Pradesh' : 'Bihar',
      district: profile.data.district.toUpperCase(),
      schemeId: profile.schemeId
    });

    const fullData = {
      ...profile.data,
      rationImage: doc1,
      passbookImage: doc2,
      nameComparison: {
        isMatch: true,
        verdict: 'exact_match',
        message: 'दोनों दस्तावेज़ों में नाम पूर्णतः समान हैं (Exact Match)',
        score: 1.0
      }
    };

    onSelectProfile(fullData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {isHi ? '⚡ एक-क्लिक नमूना प्रोफ़ाइल भरें' : '⚡ One-Click Demo Profiles'}
            </h2>
            <p className="text-xs text-slate-500">
              {isHi
                ? 'परीक्षण हेतु तैयार नागरिक प्रोफ़ाइल और नमूना दस्तावेज़ तुरंत लोड करें'
                : 'Instant test profiles with auto-generated sample documents'}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {SAMPLE_PROFILES.map((prof) => {
            const Icon = prof.icon;
            return (
              <button
                key={prof.id}
                type="button"
                onClick={() => handleApplyProfile(prof)}
                className="w-full p-4 rounded-2xl border border-slate-200 hover:border-brandRed hover:bg-red-50/30 text-left transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${prof.color} text-white flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-brandRed">
                      {isHi ? prof.nameHi : prof.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      {isHi ? prof.roleHi : prof.roleEn}
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-brandRed text-slate-600 group-hover:text-white transition-colors flex-shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
          <p>
            {isHi
              ? '💡 प्रोफ़ाइल चुनने पर आवेदक विवरण, राशन कार्ड और बैंक पासबुक के नमूना दस्तावेज़ अपने-आप तैयार हो जाएंगे।'
              : '💡 Selecting a profile pre-loads citizen intake details and auto-generates realistic passbook/ration images for Document Doctor.'}
          </p>
        </div>
      </div>
    </div>
  );
}




