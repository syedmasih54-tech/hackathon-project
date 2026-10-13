import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  User,
  ShieldCheck,
  MapPin,
  Calendar,
  Heart,
  Tractor,
  GraduationCap,
  Building,
  CreditCard,
  FileCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import VoiceButton from '../VoiceButton.jsx';
import SpeakButton from '../SpeakButton.jsx';
import { INDIAN_STATES_AND_DISTRICTS } from '../../data/locations.js';
import { SCHEMES } from '../../utils/rulesLoader.js';

export default function Screen2Intake({
  initialData,
  onSaveIntake,
  onNext,
  onBack,
  onOpenSampleProfiles,
  lang = 'hi',
  allowVoice = true
}) {
  const isHi = lang === 'hi';

  const [formData, setFormData] = useState({
    selectedScheme: initialData?.selectedScheme || 'widow-pension',
    state: initialData?.state || 'UP',
    district: initialData?.district || 'varanasi',
    age: initialData?.age || '',
    gender: initialData?.gender || 'female',
    ration_name: initialData?.ration_name || '',
    has_bank_account: initialData?.has_bank_account ?? 'yes',

    // Widow Pension specific
    marital_status: initialData?.marital_status || 'widowed',
    ration_card_type: initialData?.ration_card_type || 'BPL',

    // PM-KISAN Farmer specific
    owns_cultivable_land: initialData?.owns_cultivable_land ?? 'yes',
    is_taxpayer_excluded: initialData?.is_taxpayer_excluded ?? 'no',

    // Scholarship specific
    is_enrolled_student: initialData?.is_enrolled_student ?? 'yes',
    family_income: initialData?.family_income || '180000',
    previous_marks_percentage: initialData?.previous_marks_percentage || '68'
  });

  const [errors, setErrors] = useState({});

  const activeScheme = SCHEMES.find(s => s.id === formData.selectedScheme) || SCHEMES[0];
  const currentStateObj = INDIAN_STATES_AND_DISTRICTS.find(s => s.state_id === formData.state) || INDIAN_STATES_AND_DISTRICTS[0];

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const stObj = INDIAN_STATES_AND_DISTRICTS.find(s => s.state_id === newState);
    setFormData(prev => ({
      ...prev,
      state: newState,
      district: stObj?.districts?.[0]?.id || ''
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.ration_name || !formData.ration_name.trim()) {
      newErrors.ration_name = isHi
        ? 'कृपया दस्तावेज़ पर दर्ज पूरा नाम भरें।'
        : 'Please enter name as on your official document.';
    } else if (formData.ration_name.trim().length < 2) {
      newErrors.ration_name = isHi
        ? 'नाम कम से कम 2 अक्षरों का होना चाहिए।'
        : 'Name must be at least 2 characters.';
    }

    // Age validation
    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum)) {
      newErrors.age = isHi ? 'कृपया आयु भरें।' : 'Please enter age.';
    } else if (ageNum < 15 || ageNum > 110) {
      newErrors.age = isHi ? 'आयु 15 से 110 वर्ष के बीच होनी चाहिए।' : 'Age must be between 15 and 110.';
    }

    // District validation
    if (!formData.district) {
      newErrors.district = isHi ? 'कृपया ज़िला चुनें।' : 'Please select district.';
    }

    // Scholarship validation
    if (formData.selectedScheme === 'post-matric-scholarship') {
      const income = Number(formData.family_income);
      if (!formData.family_income || isNaN(income) || income <= 0) {
        newErrors.family_income = isHi ? 'कृपया वार्षिक आय भरें।' : 'Please enter valid annual income.';
      }

      const marks = Number(formData.previous_marks_percentage);
      if (!formData.previous_marks_percentage || isNaN(marks) || marks < 0 || marks > 100) {
        newErrors.previous_marks_percentage = isHi ? 'प्रतिशत 0 से 100 के बीच भरें।' : 'Percentage must be between 0 and 100.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSaveIntake(formData);
    onNext();
  };

  const handleVoiceName = (transcript) => {
    setFormData(prev => ({ ...prev, ration_name: transcript }));
    if (errors.ration_name) setErrors(prev => ({ ...prev, ration_name: '' }));
  };

  const handleVoiceAge = (transcript) => {
    const digits = transcript.match(/\d+/);
    if (digits) {
      setFormData(prev => ({ ...prev, age: digits[0] }));
    } else {
      setFormData(prev => ({ ...prev, age: transcript }));
    }
  };

  const handleVoiceIncome = (transcript) => {
    const digits = transcript.match(/\d+/);
    if (digits) {
      setFormData(prev => ({ ...prev, family_income: digits[0] }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-6">
        {/* Step Indicator & Header Actions */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <User className="w-3.5 h-3.5" />
              {isHi ? 'चरण 2: योजना एवं आवेदक की जानकारी' : 'Step 2: Scheme & Intake Form'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isHi ? 'योजना और विवरण चुनें' : 'Choose Scheme & Enter Details'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isHi
                ? 'योजना चुनें और आवश्यक जानकारी भरें। सभी डेटा केवल आपके फ़ोन पर सुरक्षित रहता है।'
                : 'Select welfare scheme and fill details. All data stays strictly on your device.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SpeakButton
              text={isHi
                ? 'चरण 2: कृपया अपनी योजना चुनें, अपना पूरा नाम, आयु, राज्य, ज़िला और बैंक खाता होने की जानकारी भरें।'
                : 'Step 2: Select your welfare scheme, enter your full name, age, state, district, and bank account status.'}
              lang={lang}
              size="sm"
            />

            {onOpenSampleProfiles && (
              <button
                type="button"
                onClick={onOpenSampleProfiles}
                className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{isHi ? 'नमूना डेटा भरें' : 'Fill Sample'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. SCHEME SELECTOR (3 Schemes) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
            {isHi ? 'लागू कल्याणकारी योजना चुनें (3 योजनाएं):' : 'Select Target Welfare Scheme (3 Available):'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Scheme 1: Widow Pension */}
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, selectedScheme: 'widow-pension' }))}
              className={`min-h-[56px] p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                formData.selectedScheme === 'widow-pension'
                  ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400 text-emerald-950 font-bold shadow-sm'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Heart className={`w-4 h-4 ${formData.selectedScheme === 'widow-pension' ? 'text-emerald-700' : 'text-slate-500'}`} />
                <span className="text-xs font-bold uppercase tracking-wide">
                  {isHi ? 'विधवा पेंशन' : 'Widow Pension'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal leading-tight">
                {isHi ? 'IGNWPS राष्ट्रीय योजना' : 'IGNWPS Scheme'}
              </p>
            </button>

            {/* Scheme 2: PM-KISAN (Farmers) */}
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, selectedScheme: 'pm-kisan' }))}
              className={`min-h-[56px] p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                formData.selectedScheme === 'pm-kisan'
                  ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400 text-emerald-950 font-bold shadow-sm'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Tractor className={`w-4 h-4 ${formData.selectedScheme === 'pm-kisan' ? 'text-emerald-700' : 'text-slate-500'}`} />
                <span className="text-xs font-bold uppercase tracking-wide">
                  {isHi ? 'किसान सम्मान' : 'PM-KISAN Farmers'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal leading-tight">
                {isHi ? 'कृषि भूमिधारक सहायता' : 'Farmer Income Support'}
              </p>
            </button>

            {/* Scheme 3: Scholarship (Students) */}
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, selectedScheme: 'post-matric-scholarship' }))}
              className={`min-h-[56px] p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                formData.selectedScheme === 'post-matric-scholarship'
                  ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400 text-emerald-950 font-bold shadow-sm'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className={`w-4 h-4 ${formData.selectedScheme === 'post-matric-scholarship' ? 'text-emerald-700' : 'text-slate-500'}`} />
                <span className="text-xs font-bold uppercase tracking-wide">
                  {isHi ? 'छात्रवृत्ति' : 'Scholarship'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal leading-tight">
                {isHi ? 'पोस्ट-मैट्रिक छात्र सहायता' : 'Post-Matric (NSP)'}
              </p>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 2. Document Name Input */}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label htmlFor="ration_name" className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>
                  {formData.selectedScheme === 'pm-kisan'
                    ? (isHi ? 'खतौनी/भूलेख पर दर्ज किसान का नाम' : 'Farmer Name Exactly as in Land Record')
                    : formData.selectedScheme === 'post-matric-scholarship'
                    ? (isHi ? 'अंकतालिका/पहचान पत्र पर दर्ज छात्र का नाम' : 'Student Name Exactly as on Marksheet / ID')
                    : (isHi ? 'राशन कार्ड पर दर्ज पूरा नाम' : 'Name Exactly as on Ration Card')}
                </span>
                <span className="text-red-500">*</span>
              </label>
              {allowVoice && (
                <VoiceButton
                  onTranscript={handleVoiceName}
                  lang={lang}
                  label={isHi ? 'नाम बोलें' : 'Speak Name'}
                />
              )}
            </div>
            <input
              id="ration_name"
              type="text"
              value={formData.ration_name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, ration_name: e.target.value }));
                if (errors.ration_name) setErrors(prev => ({ ...prev, ration_name: '' }));
              }}
              placeholder={isHi ? 'उदा. सुनीता देवी / राम प्रसाद / रोहित कुमार' : 'e.g. Sunita Devi'}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white ${
                errors.ration_name ? 'border-red-400 ring-2 ring-red-200' : 'border-slate-300 focus:border-emerald-500'
              }`}
            />
            {errors.ration_name && (
              <p className="text-red-600 text-xs font-semibold mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {errors.ration_name}
              </p>
            )}
          </div>

          {/* 3. State & District Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="state_select" className="block text-sm font-bold text-slate-900 mb-1.5">
                {isHi ? 'राज्य (State)' : 'State'} <span className="text-red-500">*</span>
              </label>
              <select
                id="state_select"
                value={formData.state}
                onChange={handleStateChange}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 font-medium focus:border-emerald-500"
              >
                {INDIAN_STATES_AND_DISTRICTS.map(st => (
                  <option key={st.state_id} value={st.state_id}>
                    {isHi ? st.state_hi : st.state_en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="district_select" className="block text-sm font-bold text-slate-900 mb-1.5">
                {isHi ? 'ज़िला (District)' : 'District'} <span className="text-red-500">*</span>
              </label>
              <select
                id="district_select"
                value={formData.district}
                onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 font-medium focus:border-emerald-500"
              >
                {currentStateObj.districts.map(dist => (
                  <option key={dist.id} value={dist.id}>
                    {isHi ? dist.name_hi : dist.name_en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Age & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <label htmlFor="age_input" className="text-sm font-bold text-slate-900">
                  {isHi ? 'आयु (वर्ष में)' : 'Age (in years)'} <span className="text-red-500">*</span>
                </label>
                {allowVoice && (
                  <VoiceButton
                    onTranscript={handleVoiceAge}
                    lang={lang}
                    label={isHi ? 'आयु बोलें' : 'Speak Age'}
                  />
                )}
              </div>
              <input
                id="age_input"
                type="number"
                min="15"
                max="110"
                value={formData.age}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, age: e.target.value }));
                  if (errors.age) setErrors(prev => ({ ...prev, age: '' }));
                }}
                placeholder={formData.selectedScheme === 'post-matric-scholarship' ? 'उदा. 19' : 'उदा. 48'}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white ${
                  errors.age ? 'border-red-400 ring-2 ring-red-200' : 'border-slate-300 focus:border-emerald-500'
                }`}
              />
              {errors.age && (
                <p className="text-red-600 text-xs font-semibold mt-1">
                  ⚠️ {errors.age}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="gender_select" className="block text-sm font-bold text-slate-900 mb-1.5">
                {isHi ? 'लिंग (Gender)' : 'Gender'} <span className="text-red-500">*</span>
              </label>
              <select
                id="gender_select"
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 font-medium focus:border-emerald-500"
              >
                <option value="female">{isHi ? 'महिला (Female)' : 'Female'}</option>
                <option value="male">{isHi ? 'पुरुष (Male)' : 'Male'}</option>
                <option value="other">{isHi ? 'अन्य (Other)' : 'Other'}</option>
              </select>
            </div>
          </div>

          {/* 5. SCHEME-SPECIFIC FIELDS */}

          {/* --- A. WIDOW PENSION SPECIFIC --- */}
          {formData.selectedScheme === 'widow-pension' && (
            <div className="space-y-4 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 animate-in fade-in duration-150">
              <div>
                <label htmlFor="marital_select" className="block text-sm font-bold text-slate-900 mb-1.5">
                  {isHi ? 'वैवाहिक स्थिति (Marital Status)' : 'Marital Status'} <span className="text-red-500">*</span>
                </label>
                <select
                  id="marital_select"
                  value={formData.marital_status}
                  onChange={(e) => setFormData(prev => ({ ...prev, marital_status: e.target.value }))}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 font-medium"
                >
                  <option value="widowed">{isHi ? 'विधवा (Widowed)' : 'Widowed'}</option>
                  <option value="married">{isHi ? 'विवाहित (Married)' : 'Married'}</option>
                  <option value="unmarried">{isHi ? 'अविवाहित (Unmarried)' : 'Unmarried'}</option>
                  <option value="divorced_deserted">{isHi ? 'तलाकशुदा / परित्यक्ता' : 'Divorced / Deserted'}</option>
                </select>
              </div>

              <div>
                <label htmlFor="ration_type_select" className="block text-sm font-bold text-slate-900 mb-1.5">
                  {isHi ? 'राशन कार्ड प्रकार (Ration Card Type)' : 'Ration Card Type'} <span className="text-red-500">*</span>
                </label>
                <select
                  id="ration_type_select"
                  value={formData.ration_card_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, ration_card_type: e.target.value }))}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 font-medium"
                >
                  <option value="BPL">{isHi ? 'बीपीएल (BPL - गरीबी रेखा से नीचे)' : 'BPL'}</option>
                  <option value="AAY">{isHi ? 'अंत्योदय (AAY - सबसे निर्धन)' : 'AAY'}</option>
                  <option value="OTHER">{isHi ? 'सामान्य / एपीएल' : 'Other'}</option>
                  <option value="NONE">{isHi ? 'कोई राशन कार्ड नहीं है' : 'None'}</option>
                </select>
              </div>
            </div>
          )}

          {/* --- B. PM-KISAN FARMER SPECIFIC --- */}
          {formData.selectedScheme === 'pm-kisan' && (
            <div className="space-y-4 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 animate-in fade-in duration-150">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">
                  {isHi ? 'क्या आपके/परिवार के नाम कृषि योग्य भूमि दर्ज है?' : 'Do you own cultivable agricultural land?'} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`min-h-[44px] p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    formData.owns_cultivable_land === 'yes' ? 'bg-emerald-100 border-emerald-400 font-bold text-emerald-900 ring-1 ring-emerald-400' : 'bg-white border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="owns_cultivable_land"
                      value="yes"
                      checked={formData.owns_cultivable_land === 'yes'}
                      onChange={() => setFormData(prev => ({ ...prev, owns_cultivable_land: 'yes' }))}
                      className="w-4 h-4 text-emerald-600"
                    />
                    <span>{isHi ? 'हाँ, भूमि स्वामित्व है' : 'Yes, Landowner'}</span>
                  </label>

                  <label className={`min-h-[44px] p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    formData.owns_cultivable_land === 'no' ? 'bg-amber-100 border-amber-400 font-bold text-amber-900 ring-1 ring-amber-400' : 'bg-white border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="owns_cultivable_land"
                      value="no"
                      checked={formData.owns_cultivable_land === 'no'}
                      onChange={() => setFormData(prev => ({ ...prev, owns_cultivable_land: 'no' }))}
                      className="w-4 h-4 text-emerald-600"
                    />
                    <span>{isHi ? 'नहीं है' : 'No Land'}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">
                  {isHi ? 'क्या परिवार में कोई आयकर दाता या सरकारी पद पर है?' : 'Is any family member an income taxpayer or govt servant?'} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`min-h-[44px] p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    formData.is_taxpayer_excluded === 'no' ? 'bg-emerald-100 border-emerald-400 font-bold text-emerald-900 ring-1 ring-emerald-400' : 'bg-white border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="is_taxpayer_excluded"
                      value="no"
                      checked={formData.is_taxpayer_excluded === 'no'}
                      onChange={() => setFormData(prev => ({ ...prev, is_taxpayer_excluded: 'no' }))}
                      className="w-4 h-4 text-emerald-600"
                    />
                    <span>{isHi ? 'नहीं (पात्र किसान)' : 'No (Eligible)'}</span>
                  </label>

                  <label className={`min-h-[44px] p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    formData.is_taxpayer_excluded === 'yes' ? 'bg-amber-100 border-amber-400 font-bold text-amber-900 ring-1 ring-amber-400' : 'bg-white border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="is_taxpayer_excluded"
                      value="yes"
                      checked={formData.is_taxpayer_excluded === 'yes'}
                      onChange={() => setFormData(prev => ({ ...prev, is_taxpayer_excluded: 'yes' }))}
                      className="w-4 h-4 text-emerald-600"
                    />
                    <span>{isHi ? 'हाँ (आयकर दाता)' : 'Yes (Taxpayer)'}</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* --- C. SCHOLARSHIP STUDENT SPECIFIC --- */}
          {formData.selectedScheme === 'post-matric-scholarship' && (
            <div className="space-y-4 p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200 animate-in fade-in duration-150">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">
                  {isHi ? 'क्या आप मान्यता प्राप्त स्कूल/कॉलेज में नियमित छात्र हैं?' : 'Are you a regularly enrolled post-matric student?'} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`min-h-[44px] p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    formData.is_enrolled_student === 'yes' ? 'bg-emerald-100 border-emerald-400 font-bold text-emerald-900 ring-1 ring-emerald-400' : 'bg-white border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="is_enrolled_student"
                      value="yes"
                      checked={formData.is_enrolled_student === 'yes'}
                      onChange={() => setFormData(prev => ({ ...prev, is_enrolled_student: 'yes' }))}
                      className="w-4 h-4 text-emerald-600"
                    />
                    <span>{isHi ? 'हाँ, नियमित छात्र' : 'Yes, Enrolled'}</span>
                  </label>

                  <label className={`min-h-[44px] p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    formData.is_enrolled_student === 'no' ? 'bg-amber-100 border-amber-400 font-bold text-amber-900 ring-1 ring-amber-400' : 'bg-white border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="is_enrolled_student"
                      value="no"
                      checked={formData.is_enrolled_student === 'no'}
                      onChange={() => setFormData(prev => ({ ...prev, is_enrolled_student: 'no' }))}
                      className="w-4 h-4 text-emerald-600"
                    />
                    <span>{isHi ? 'नहीं' : 'No'}</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <label htmlFor="income_input" className="text-xs font-bold text-slate-900">
                      {isHi ? 'वार्षिक पारिवारिक आय (₹ में)' : 'Family Annual Income (₹)'} *
                    </label>
                    {allowVoice && (
                      <VoiceButton
                        onTranscript={handleVoiceIncome}
                        lang={lang}
                        label={isHi ? 'आय बोलें' : 'Voice'}
                      />
                    )}
                  </div>
                  <input
                    id="income_input"
                    type="number"
                    value={formData.family_income}
                    onChange={(e) => setFormData(prev => ({ ...prev, family_income: e.target.value }))}
                    placeholder="उदा. 180000"
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  />
                  {errors.family_income && (
                    <p className="text-red-600 text-xs mt-1">⚠️ {errors.family_income}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="marks_input" className="block text-xs font-bold text-slate-900 mb-1.5">
                    {isHi ? 'पिछली परीक्षा में प्राप्तांक (%)' : 'Previous Exam Score (%)'} *
                  </label>
                  <input
                    id="marks_input"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.previous_marks_percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, previous_marks_percentage: e.target.value }))}
                    placeholder="उदा. 65"
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  />
                  {errors.previous_marks_percentage && (
                    <p className="text-red-600 text-xs mt-1">⚠️ {errors.previous_marks_percentage}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 6. Active Bank Account (Common to all schemes) */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1.5">
              {formData.selectedScheme === 'post-matric-scholarship'
                ? (isHi ? 'क्या छात्र के स्वयं के नाम पर बैंक खाता है?' : 'Does the student have a bank account in own name?')
                : (isHi ? 'क्या आपका स्वयं का बैंक खाता है?' : 'Do you have your own active bank account?')} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`min-h-[44px] p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                formData.has_bank_account === 'yes' ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900 ring-1 ring-emerald-400' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <input
                  type="radio"
                  name="has_bank_account"
                  value="yes"
                  checked={formData.has_bank_account === 'yes'}
                  onChange={() => setFormData(prev => ({ ...prev, has_bank_account: 'yes' }))}
                  className="w-4 h-4 text-emerald-600"
                />
                <span>{isHi ? 'हाँ, बैंक खाता है' : 'Yes, have account'}</span>
              </label>

              <label className={`min-h-[44px] p-3 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                formData.has_bank_account === 'no' ? 'bg-amber-50 border-amber-400 font-bold text-amber-900 ring-1 ring-amber-400' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <input
                  type="radio"
                  name="has_bank_account"
                  value="no"
                  checked={formData.has_bank_account === 'no'}
                  onChange={() => setFormData(prev => ({ ...prev, has_bank_account: 'no' }))}
                  className="w-4 h-4 text-emerald-600"
                />
                <span>{isHi ? 'नहीं है' : 'No account'}</span>
              </label>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {isHi ? 'हम बैंक खाता संख्या या पासवर्ड कभी नहीं मांगते।' : 'We never ask for account numbers or PINs.'}
            </p>
          </div>

          {/* LIVE INTERACTIVE CRITERIA MATCH PREVIEW */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div className="font-bold text-slate-700 mb-2 flex items-center justify-between">
              <span>{isHi ? '⚡ वास्तविक-समय पात्रता पूर्वावलोकन:' : '⚡ Real-Time Criteria Check:'}</span>
              <span className="text-[10px] text-slate-500 font-normal">
                {isHi ? '(फ़ॉर्म भरते ही जांचता है)' : '(Simulated live)'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Age criteria */}
              <div className="flex items-center gap-1.5">
                {Number(formData.age) >= (formData.selectedScheme === 'widow-pension' ? 40 : 18) ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                )}
                <span className={Number(formData.age) >= (formData.selectedScheme === 'widow-pension' ? 40 : 18) ? 'text-emerald-900 font-semibold' : 'text-slate-600'}>
                  {isHi
                    ? `आयु: ${formData.age || '0'} वर्ष (${formData.selectedScheme === 'widow-pension' ? 'न्यूनतम 40' : 'न्यूनतम 18'})`
                    : `Age: ${formData.age || '0'} (Min ${formData.selectedScheme === 'widow-pension' ? '40' : '18'})`}
                </span>
              </div>

              {/* Bank account criteria */}
              <div className="flex items-center gap-1.5">
                {formData.has_bank_account === 'yes' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                )}
                <span className={formData.has_bank_account === 'yes' ? 'text-emerald-900 font-semibold' : 'text-slate-600'}>
                  {isHi ? 'DBT बैंक खाता: उपलब्ध' : 'DBT Bank Account: Ready'}
                </span>
              </div>

              {/* Scheme specific condition */}
              {formData.selectedScheme === 'widow-pension' && (
                <div className="flex items-center gap-1.5">
                  {formData.marital_status === 'widowed' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  )}
                  <span className={formData.marital_status === 'widowed' ? 'text-emerald-900 font-semibold' : 'text-slate-600'}>
                    {isHi ? 'वैवाहिक स्थिति: विधवा' : 'Marital status: Widowed'}
                  </span>
                </div>
              )}

              {formData.selectedScheme === 'pm-kisan' && (
                <div className="flex items-center gap-1.5">
                  {formData.owns_cultivable_land === 'yes' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  )}
                  <span className={formData.owns_cultivable_land === 'yes' ? 'text-emerald-900 font-semibold' : 'text-slate-600'}>
                    {isHi ? 'कृषि भूमि: उपलब्ध' : 'Agricultural Land: Yes'}
                  </span>
                </div>
              )}

              {formData.selectedScheme === 'post-matric-scholarship' && (
                <div className="flex items-center gap-1.5">
                  {Number(formData.family_income) <= 250000 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  )}
                  <span className={Number(formData.family_income) <= 250000 ? 'text-emerald-900 font-semibold' : 'text-slate-600'}>
                    {isHi ? 'वार्षिक आय: ₹2.50 लाख के अंदर' : 'Income: ≤ ₹2.50 Lakh'}
                  </span>
                </div>
              )}

              {/* Name check */}
              <div className="flex items-center gap-1.5">
                {formData.ration_name && formData.ration_name.trim().length >= 2 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                )}
                <span className={formData.ration_name && formData.ration_name.trim().length >= 2 ? 'text-emerald-900 font-semibold' : 'text-slate-600'}>
                  {formData.ration_name ? formData.ration_name : (isHi ? 'नाम दर्ज करें' : 'Enter name')}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onBack}
              className="min-h-[48px] px-5 py-2.5 rounded-2xl border border-slate-300 hover:bg-slate-100 font-bold text-sm text-slate-700 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isHi ? 'पीछे' : 'Back'}</span>
            </button>

            <button
              type="submit"
              className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-md shadow-emerald-200"
            >
              <span>{isHi ? 'पात्रता जांचें' : 'Check Eligibility'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
