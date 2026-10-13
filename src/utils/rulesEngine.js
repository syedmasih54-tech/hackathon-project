/**
 * rulesEngine.js
 * Multi-scheme deterministic rules engine.
 * Supports:
 * - Widow Pension (IGNWPS)
 * - PM-KISAN (Farmers Support)
 * - Post-Matric Scholarship (Students Support)
 */

export function evaluateRules(rulesConfig, userData = {}, nameMatchResult = null) {
  const rules = rulesConfig?.rules || [];
  const matchedRules = [];
  const missingRules = [];

  const schemeId = rulesConfig?.scheme_id || 'IGNWPS-WIDOW-PENSION';

  // Evaluate each rule deterministically based on operator
  for (const rule of rules) {
    let passed = false;
    let actualValue = userData[rule.field];

    switch (rule.field) {
      case 'age':
        actualValue = Number(actualValue) || 0;
        passed = actualValue >= Number(rule.placeholder_value);
        break;

      case 'marital_status':
        actualValue = (actualValue || '').toLowerCase();
        passed = actualValue === String(rule.placeholder_value).toLowerCase();
        break;

      case 'ration_card_type':
        actualValue = (actualValue || '').toUpperCase();
        if (Array.isArray(rule.placeholder_value)) {
          passed = rule.placeholder_value.includes(actualValue);
        } else {
          passed = actualValue === String(rule.placeholder_value).toUpperCase();
        }
        break;

      case 'has_bank_account':
        actualValue = Boolean(actualValue === true || actualValue === 'yes');
        passed = actualValue === Boolean(rule.placeholder_value);
        break;

      // Farmer specific fields
      case 'owns_cultivable_land':
        actualValue = Boolean(actualValue === true || actualValue === 'yes');
        passed = actualValue === Boolean(rule.placeholder_value);
        break;

      case 'is_taxpayer_excluded':
        actualValue = Boolean(actualValue === true || actualValue === 'yes');
        passed = actualValue === Boolean(rule.placeholder_value);
        break;

      // Student scholarship specific fields
      case 'is_enrolled_student':
        actualValue = Boolean(actualValue === true || actualValue === 'yes');
        passed = actualValue === Boolean(rule.placeholder_value);
        break;

      case 'family_income':
        actualValue = Number(actualValue) || 0;
        passed = actualValue > 0 && actualValue <= Number(rule.placeholder_value);
        break;

      case 'previous_marks_percentage':
        actualValue = Number(actualValue) || 0;
        passed = actualValue >= Number(rule.placeholder_value);
        break;

      default:
        passed = false;
        break;
    }

    const evaluatedRule = {
      ...rule,
      passed,
      actualValue
    };

    if (passed) {
      matchedRules.push(evaluatedRule);
    } else {
      missingRules.push(evaluatedRule);
    }
  }

  const isNameMatched = nameMatchResult ? Boolean(nameMatchResult.match) : false;

  // Build Scheme-Specific Readiness Checklist (5 core pillars)
  let checklist = [];

  if (schemeId.includes('FARMER') || schemeId.includes('PM-KISAN')) {
    checklist = [
      {
        id: 'check_farmer_land',
        label_hi: 'कृषि योग्य भूमि का स्वामित्व (राजस्व रिकॉर्ड)',
        label_en: 'Cultivable Landholding Ownership (Revenue Record)',
        satisfied: Boolean(userData.owns_cultivable_land === true || userData.owns_cultivable_land === 'yes'),
        next_step_hi: 'भूमि स्वामित्व साबित करने के लिए भूलेख पोर्टल से खसरा/खतौनी की नकल प्राप्त करें और अपने लेखपाल/पटवारी से सत्यापन कराएं।',
        next_step_en: 'Obtain Khasra/Khatoni land record copy from Bhulekh portal and get it certified by Patwari/Lekhpal.'
      },
      {
        id: 'check_farmer_age',
        label_hi: 'आयु आवश्यकता (18 वर्ष या अधिक)',
        label_en: 'Age Criteria (18+ years)',
        satisfied: Number(userData.age) >= 18,
        next_step_hi: 'किसान की आयु 18 वर्ष या अधिक होनी चाहिए। आधार कार्ड या मतदाता पहचान पत्र तैयार रखें।',
        next_step_en: 'Farmer must be at least 18 years old. Keep age verification document ready.'
      },
      {
        id: 'check_farmer_exclusion',
        label_hi: 'गैर-आयकर दाता प्रमाण (पात्रता घोषणा)',
        label_en: 'Non-Taxpayer Declaration (Exclusion Free)',
        satisfied: Boolean(userData.is_taxpayer_excluded === false || userData.is_taxpayer_excluded === 'no' || !userData.is_taxpayer_excluded),
        next_step_hi: 'सुनिश्चित करें कि परिवार का कोई सदस्य आयकर दाता या संवैधानिक पद पर नहीं है। स्व-घोषणा पत्र संलग्न करें।',
        next_step_en: 'Ensure no family member pays income tax or holds constitutional posts. Attach self-declaration.'
      },
      {
        id: 'check_farmer_bank',
        label_hi: 'सक्रिय बैंक खाता एवं DBT NPCI मैपिंग',
        label_en: 'Active Bank Account with Aadhaar NPCI Seeding',
        satisfied: Boolean(userData.has_bank_account === true || userData.has_bank_account === 'yes'),
        next_step_hi: 'पीएम-किसान की ₹2000 किस्तें सीधे बैंक में प्राप्त करने के लिए बैंक शाखा जाकर आधार-NPCI डीबीटी मैपिंग सक्रिय कराएं।',
        next_step_en: 'Visit your bank branch to activate Aadhaar NPCI DBT mapping for PM-KISAN installment credits.'
      },
      {
        id: 'check_names',
        label_hi: 'भूमि रिकॉर्ड और बैंक पासबुक में नाम मिलान',
        label_en: 'Name Consistency Across Land Record & Passbook',
        satisfied: isNameMatched,
        next_step_hi: 'खतौनी और बैंक पासबुक में नाम एक समान होना चाहिए। अंतर होने पर तहसील या बैंक में संशोधन आवेदन दें।',
        next_step_en: 'Names must match across land record and bank passbook. Submit correction at Tehsil or bank branch.'
      }
    ];
  } else if (schemeId.includes('SCHOLARSHIP')) {
    checklist = [
      {
        id: 'check_student_enrollment',
        label_hi: 'मान्यता प्राप्त संस्थान में नियमित नामांकन',
        label_en: 'Regular Enrollment in Recognized Institution',
        satisfied: Boolean(userData.is_enrolled_student === true || userData.is_enrolled_student === 'yes'),
        next_step_hi: 'स्कूल या कॉलेज से वर्तमान सत्र का बोनाफाइड छात्र प्रमाण पत्र (Bonafide Certificate) और शुल्क रसीद प्राप्त करें।',
        next_step_en: 'Obtain bonafide student certificate and current semester fee receipt from your institution.'
      },
      {
        id: 'check_student_income',
        label_hi: 'पारिवारिक वार्षिक आय सीमा (₹2.50 लाख तक)',
        label_en: 'Family Annual Income Limit (Up to ₹2.50 Lakh)',
        satisfied: Number(userData.family_income) > 0 && Number(userData.family_income) <= 250000,
        next_step_hi: 'सक्षम राजस्व अधिकारी (तहसीलदार/SDM) द्वारा जारी वैध आय प्रमाण पत्र प्राप्त करें। आय ₹2.50 लाख से कम होनी चाहिए।',
        next_step_en: 'Obtain valid income certificate issued by Tehsildar/SDM proving income under ₹2.50 Lakh.'
      },
      {
        id: 'check_student_marks',
        label_hi: 'पिछली परीक्षा में न्यूनतम 50% अंक',
        label_en: 'Minimum 50% Marks in Qualifying Exam',
        satisfied: Number(userData.previous_marks_percentage) >= 50,
        next_step_hi: 'पिछली उत्तीर्ण कक्षा/बोर्ड परीक्षा की अंकतालिका की सत्यापित प्रति संलग्न करें (न्यूनतम 50% अंक आवश्यक)।',
        next_step_en: 'Attach self-attested marksheet copy of previous qualifying examination (minimum 50% required).'
      },
      {
        id: 'check_student_bank',
        label_hi: 'छात्र के स्वयं के नाम से बैंक खाता (DBT सक्षम)',
        label_en: 'Student Own Bank Account (DBT Enabled)',
        satisfied: Boolean(userData.has_bank_account === true || userData.has_bank_account === 'yes'),
        next_step_hi: 'छात्रवृत्ति माता-पिता के खाते में नहीं आती। छात्र के अपने नाम से जन-धन या बचत खाता खुलवाएं और आधार लिंक कराएं।',
        next_step_en: 'Scholarship requires account in student own name. Open savings account and complete Aadhaar seeding.'
      },
      {
        id: 'check_names',
        label_hi: 'अंकतालिका और बैंक पासबुक में नाम मिलान',
        label_en: 'Name Consistency Across Marksheet & Passbook',
        satisfied: isNameMatched,
        next_step_hi: 'अंकतालिका और बैंक पासबुक में छात्र का नाम बिल्कुल एक समान होना चाहिए ताकि छात्रवृत्ति अस्वीकृत न हो।',
        next_step_en: 'Student name must match identically across marksheet and bank passbook to prevent rejection.'
      }
    ];
  } else {
    // Default: Widow Pension Checklist
    const userAge = Number(userData.age) || 0;
    const userMarital = (userData.marital_status || '').toLowerCase();
    const userRation = (userData.ration_card_type || '').toUpperCase();
    const userBank = Boolean(userData.has_bank_account === true || userData.has_bank_account === 'yes');

    checklist = [
      {
        id: 'check_age',
        label_hi: 'आयु आवश्यकता (40 वर्ष या अधिक)',
        label_en: 'Age Criteria (40+ years)',
        satisfied: userAge >= 40,
        next_step_hi: 'आवेदक की आयु न्यूनतम 40 वर्ष होनी चाहिए। आयु प्रमाण के लिए परिवार रजिस्टर या आधार कार्ड की प्रति तैयार रखें।',
        next_step_en: 'Applicant must meet minimum age criteria (40+ years). Keep age proof document ready.'
      },
      {
        id: 'check_widow',
        label_hi: 'वैवाहिक स्थिति: विधवा',
        label_en: 'Marital Status: Widowed',
        satisfied: userMarital === 'widowed',
        next_step_hi: 'यह योजना केवल विधवाओं के लिए है। पति का मृत्यु प्रमाण पत्र (Death Certificate) पंचायत या नगर पालिका से प्राप्त करें।',
        next_step_en: 'This scheme is for widows. Obtain spouse death certificate from local authority / Panchayat.'
      },
      {
        id: 'check_bpl',
        label_hi: 'बीपीएल / अंत्योदय राशन कार्ड प्रमाण',
        label_en: 'BPL / Antyodaya Category Proof',
        satisfied: ['BPL', 'AAY'].includes(userRation),
        next_step_hi: 'बीपीएल या अंत्योदय राशन कार्ड की छायाप्रति आवश्यक है। ग्राम प्रधान अथवा ब्लॉक कार्यालय से बीपीएल सूची में सत्यापन करवाएं।',
        next_step_en: 'BPL or Antyodaya proof required. Verify BPL enrollment with Block development office or Panchayat.'
      },
      {
        id: 'check_bank',
        label_hi: 'सक्रिय बैंक खाता (DBT सक्षम)',
        label_en: 'Active Bank Account (DBT Enabled)',
        satisfied: userBank,
        next_step_hi: 'नजदीकी बैंक या डाकघर में शून्य शेष जन-धन बैंक खाता खुलवाएं और आधार एनपीसीआई (NPCI) मैपिंग करवाएं।',
        next_step_en: 'Open a zero-balance Jan Dhan bank account and ensure Aadhaar-NPCI direct benefit seeding.'
      },
      {
        id: 'check_names',
        label_hi: 'राशन कार्ड एवं बैंक पासबुक में नाम मिलान',
        label_en: 'Name Consistency Across Documents',
        satisfied: isNameMatched,
        next_step_hi: 'राशन कार्ड और बैंक पासबुक में नाम एक समान होना चाहिए। यदि नाम में अंतर है, तो बैंक या जनसेवा केंद्र (CSC) में नाम सुधार आवेदन करें।',
        next_step_en: 'Names must match across documents. If differing, submit a correction form at your bank or CSC.'
      }
    ];
  }

  const satisfiedCount = checklist.filter(c => c.satisfied).length;
  const readinessPercentage = Math.round((satisfiedCount / checklist.length) * 100);
  const coreEligible = matchedRules.length === rules.length && rules.length > 0;

  return {
    schemeId,
    isVerified: Boolean(rulesConfig?.verified),
    verificationWarning_hi: rulesConfig?.verification_warning_hi || 'चेतावनी: ये नियम अभी तक आधिकारिक पोर्टल से सत्यापित नहीं हैं',
    verificationWarning_en: rulesConfig?.verification_warning_en || 'Warning: Rules not yet verified against official portal',
    sourceUrl: rulesConfig?.source_url || 'https://myscheme.gov.in',
    lastVerified: rulesConfig?.last_verified || '2026-10-01',
    version: rulesConfig?.version || '1.0.0-draft',
    schemeName_hi: rulesConfig?.scheme_name_hi || 'कल्याणकारी योजना',
    schemeName_en: rulesConfig?.scheme_name_en || 'Welfare Scheme',

    statusText_hi: coreEligible ? 'आप पात्र हो सकते हैं' : 'वर्तमान में कुछ शर्तें अधूरी हैं',
    statusText_en: coreEligible ? 'You may be eligible' : 'Some criteria are currently unmet',
    isPotentiallyEligible: coreEligible,

    matchedRules,
    missingRules,
    checklist,
    readinessPercentage
  };
}
