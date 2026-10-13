/**
 * rulesLoader.js
 * Multi-scheme rules loader supporting:
 * 1. Widow Pension (IGNWPS)
 * 2. PM-KISAN (Farmer Income Support)
 * 3. Post-Matric Scholarship (NSP)
 * 
 * Supports dynamic runtime fetch with offline fallback schemas for each scheme.
 */

export const SCHEMES = [
  {
    id: 'widow-pension',
    name_hi: 'इंदिरा गांधी राष्ट्रीय विधवा पेंशन योजना (IGNWPS)',
    name_en: 'Indira Gandhi National Widow Pension Scheme (IGNWPS)',
    icon: 'Heart',
    category: 'pension',
    tag_hi: 'विधवा पेंशन',
    tag_en: 'Widow Pension',
    docSlot1Label_hi: 'राशन कार्ड (Ration Card)',
    docSlot1Label_en: 'Ration Card',
    docSlot2Label_hi: 'बैंक पासबुक (Bank Passbook)',
    docSlot2Label_en: 'Bank Passbook',
    rulesUrl: '/data/rules/widow-pension.json'
  },
  {
    id: 'pm-kisan',
    name_hi: 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)',
    name_en: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    icon: 'Tractor',
    category: 'farmers',
    tag_hi: 'किसान सम्मान',
    tag_en: 'Farmers Support',
    docSlot1Label_hi: 'खसरा/खतौनी - भूमि रिकॉर्ड (Land Ownership Record)',
    docSlot1Label_en: 'Land Ownership Record (Khasra/Khatoni)',
    docSlot2Label_hi: 'बैंक पासबुक (Bank Passbook)',
    docSlot2Label_en: 'Bank Passbook',
    rulesUrl: '/data/rules/pm-kisan.json'
  },
  {
    id: 'post-matric-scholarship',
    name_hi: 'पोस्ट-मैट्रिक छात्रवृत्ति योजना (NSP Scholarship)',
    name_en: 'Post-Matric Scholarship Scheme (NSP)',
    icon: 'GraduationCap',
    category: 'scholarship',
    tag_hi: 'छात्रवृत्ति',
    tag_en: 'Student Scholarship',
    docSlot1Label_hi: 'अंकतालिका / कॉलेज आईडी (Marksheet / College ID)',
    docSlot1Label_en: 'Marksheet / College ID Card',
    docSlot2Label_hi: 'छात्र का बैंक पासबुक (Student Bank Passbook)',
    docSlot2Label_en: 'Student Bank Passbook',
    rulesUrl: '/data/rules/post-matric-scholarship.json'
  }
];

export const DEFAULT_RULES_BY_SCHEME = {
  'widow-pension': {
    scheme_id: "IGNWPS-WIDOW-PENSION",
    scheme_name_hi: "इंदिरा गांधी राष्ट्रीय विधवा पेंशन योजना (IGNWPS)",
    scheme_name_en: "Indira Gandhi National Widow Pension Scheme (IGNWPS)",
    verified: false,
    verification_warning_hi: "चेतावनी: ये नियम अभी तक आधिकारिक NSAP साइट से सत्यापित नहीं हैं।",
    verification_warning_en: "Warning: These rules are not yet verified against the official NSAP portal.",
    source_url: "https://nsap.nic.in",
    version: "1.0.0-draft-unverified",
    last_verified: "2026-10-01",
    rules: [
      {
        id: "rule_age",
        field: "age",
        operator: "gte",
        condition: "age >= [PLACEHOLDER_MIN_AGE: 40]",
        placeholder_value: 40,
        placeholder_note: "[PLACEHOLDER - Official NSAP verification pending]",
        source_url: "https://nsap.nic.in/guidelines.do",
        version: "1.0-draft",
        last_verified: "2026-10-01",
        title_hi: "न्यूनतम आयु 40 वर्ष",
        title_en: "Minimum Age 40 Years",
        description_hi: "आवेदक की आयु 40 वर्ष या उससे अधिक होनी चाहिए [सत्यापन लंबित]",
        description_en: "Applicant must be 40 years or older [placeholder pending verification]"
      },
      {
        id: "rule_marital_status",
        field: "marital_status",
        operator: "eq",
        condition: "marital_status == [PLACEHOLDER_STATUS: 'widowed']",
        placeholder_value: "widowed",
        placeholder_note: "[PLACEHOLDER - Official NSAP verification pending]",
        source_url: "https://nsap.nic.in/guidelines.do",
        version: "1.0-draft",
        last_verified: "2026-10-01",
        title_hi: "वैवाहिक स्थिति: विधवा",
        title_en: "Marital Status: Widowed",
        description_hi: "योजना के अंतर्गत पात्र होने के लिए आवेदक का विधवा होना आवश्यक है [सत्यापन लंबित]",
        description_en: "Applicant must be a widow to qualify under this scheme [placeholder pending verification]"
      },
      {
        id: "rule_bpl",
        field: "ration_card_type",
        operator: "in",
        condition: "ration_card_type in [[PLACEHOLDER_BPL], [PLACEHOLDER_AAY]]",
        placeholder_value: ["BPL", "AAY"],
        placeholder_note: "[PLACEHOLDER - Official NSAP verification pending]",
        source_url: "https://nsap.nic.in/guidelines.do",
        version: "1.0-draft",
        last_verified: "2026-10-01",
        title_hi: "बीपीएल / अंत्योदय राशन कार्ड",
        title_en: "BPL / Antyodaya Ration Card",
        description_hi: "आवेदक का परिवार बीपीएल या अंत्योदय सूची में होना चाहिए [सत्यापन लंबित]",
        description_en: "Applicant family must be in BPL or Antyodaya category [placeholder pending verification]"
      },
      {
        id: "rule_bank_account",
        field: "has_bank_account",
        operator: "eq",
        condition: "has_bank_account == [PLACEHOLDER_BOOLEAN: true]",
        placeholder_value: true,
        placeholder_note: "[PLACEHOLDER - Official NSAP verification pending]",
        source_url: "https://nsap.nic.in/guidelines.do",
        version: "1.0-draft",
        last_verified: "2026-10-01",
        title_hi: "सक्रिय बैंक खाता",
        title_en: "Active Bank Account",
        description_hi: "प्रत्यक्ष लाभ अंतरण (DBT) द्वारा पेंशन प्राप्त करने के लिए बैंक खाता अनिवार्य है",
        description_en: "An active bank account is mandatory for receiving Direct Benefit Transfer (DBT)"
      }
    ]
  },
  'pm-kisan': {
    scheme_id: "PM-KISAN-FARMER",
    scheme_name_hi: "प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)",
    scheme_name_en: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    verified: false,
    verification_warning_hi: "चेतावनी: ये नियम अभी तक आधिकारिक PM-KISAN पोर्टल से सत्यापित नहीं हैं।",
    verification_warning_en: "Warning: These rules are not yet verified against the official PM-KISAN portal.",
    source_url: "https://pmkisan.gov.in",
    version: "1.0.0-draft-unverified",
    last_verified: "2026-10-01",
    rules: [
      {
        id: "rule_farmer_land",
        field: "owns_cultivable_land",
        operator: "eq",
        condition: "owns_cultivable_land == [PLACEHOLDER_BOOLEAN: true]",
        placeholder_value: true,
        placeholder_note: "[PLACEHOLDER - Official PM-KISAN verification pending]",
        source_url: "https://pmkisan.gov.in/Documents.aspx",
        version: "1.0-draft",
        last_verified: "2026-10-01",
        title_hi: "कृषि योग्य भूमि का स्वामित्व",
        title_en: "Cultivable Landholding Ownership",
        description_hi: "किसान परिवार के नाम पर राजस्व रिकॉर्ड में कृषि योग्य भूमि दर्ज होनी चाहिए [सत्यापन लंबित]",
        description_en: "Farmer family must hold cultivable agricultural land in revenue records [placeholder pending verification]"
      },
      {
        id: "rule_farmer_age",
        field: "age",
        operator: "gte",
        condition: "age >= [PLACEHOLDER_MIN_AGE: 18]",
        placeholder_value: 18,
        placeholder_note: "[PLACEHOLDER - Official PM-KISAN verification pending]",
        source_url: "https://pmkisan.gov.in/Documents.aspx",
        version: "1.0-draft",
        last_verified: "2026-10-01",
        title_hi: "न्यूनतम आयु 18 वर्ष",
        title_en: "Minimum Age 18 Years",
        description_hi: "भूमिधारक किसान की आयु 18 वर्ष या उससे अधिक होनी चाहिए [सत्यापन लंबित]",
        description_en: "Farmer landholder must be 18 years or older [placeholder pending verification]"
      },
      {
        id: "rule_farmer_exclusion",
        field: "is_taxpayer_excluded",
        operator: "eq",
        condition: "is_taxpayer_excluded == [PLACEHOLDER_BOOLEAN: false]",
        placeholder_value: false,
        placeholder_note: "[PLACEHOLDER - Official PM-KISAN verification pending]",
        source_url: "https://pmkisan.gov.in/Documents.aspx",
        version: "1.0-draft",
        last_verified: "2026-10-01",
        title_hi: "बहिष्करण श्रेणी में नहीं (गैर-आयकर दाता)",
        title_en: "Exclusion Criteria (Non-Taxpayer)",
        description_hi: "किसान या परिवार का कोई सदस्य आयकर दाता अथवा संवैधानिक/सरकारी पद पर नहीं होना चाहिए [सत्यापन लंबित]",
        description_en: "Must not fall under exclusion criteria (e.g. income tax payer) [placeholder pending verification]"
      },
      {
        id: "rule_farmer_bank",
        field: "has_bank_account",
        operator: "eq",
        condition: "has_bank_account == [PLACEHOLDER_BOOLEAN: true]",
        placeholder_value: true,
        placeholder_note: "[PLACEHOLDER - Official PM-KISAN verification pending]",
        source_url: "https://pmkisan.gov.in/Documents.aspx",
        version: "1.0-draft",
        last_verified: "2026-10-01",
        title_hi: "सक्रिय बैंक खाता एवं DBT मैपिंग",
        title_en: "Active Bank Account & DBT Mapping",
        description_hi: "₹2000 की त्रैमासिक किस्तें प्राप्त करने के लिए आधार-सीडेड बैंक खाता अनिवार्य है [सत्यापन लंबित]",
        description_en: "Aadhaar-seeded active bank account is mandatory for receiving quarterly DBT installments [placeholder pending verification]"
      }
    ]
  },
  'post-matric-scholarship': {
    scheme_id: "POST-MATRIC-SCHOLARSHIP",
    scheme_name_hi: "पोस्ट-मैट्रिक छात्रवृत्ति योजना (NSP)",
    scheme_name_en: "Post-Matric Scholarship Scheme (NSP)",
    verified: false,
    verification_warning_hi: "चेतावनी: ये नियम अभी तक आधिकारिक राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) से सत्यापित नहीं हैं।",
    verification_warning_en: "Warning: These rules are not yet verified against the official National Scholarship Portal (NSP).",
    source_url: "https://scholarships.gov.in",
    version: "1.0.0-draft-unverified",
    last_verified: "2026-10-01",
    rules: [
      {
        id: "rule_student_enrollment",
        field: "is_enrolled_student",
        operator: "eq",
        condition: "is_enrolled_student == [PLACEHOLDER_BOOLEAN: true]",
        placeholder_value: true,
        placeholder_note: "[PLACEHOLDER - Official NSP verification pending]",
        source_url: "https://scholarships.gov.in/public/faq",
        version: "1.0-draft",
        last_verified: "2026-10-01",
        title_hi: "मान्यता प्राप्त संस्थान में नियमित नामांकन",
        title_en: "Regular Enrollment in Recognized Institution",
        description_hi: "छात्र/छात्रा का कक्षा 11, 12, आईटीआई, डिप्लोमा या स्नातक/परास्नातक में नियमित अध्ययनरत होना अनिवार्य है [सत्यापन लंबित]",
        description_en: "Applicant must be a regularly enrolled student in post-matric courses [placeholder pending verification]"
      },
      {
        id: "rule_student_income",
        field: "family_income",
        operator: "lte",
        condition: "family_income <= [PLACEHOLDER_MAX_INCOME: 250000]",
        placeholder_value: 250000,
        placeholder_note: "[PLACEHOLDER - Official NSP verification pending]",
        source_url: "https://scholarships.gov.in/public/faq",
        version: "1.0-draft",
        last_verified: "2026-10-01",
        title_hi: "पारिवारिक वार्षिक आय सीमा (₹2.50 लाख तक)",
        title_en: "Family Annual Income Limit (Up to ₹2.50 Lakh)",
        description_hi: "परिवार की सभी स्रोतों से कुल वार्षिक आय ₹2,50,000 या उससे कम होनी चाहिए [सत्यापन लंबित]",
        description_en: "Total family annual income must not exceed ₹2,50,000 [placeholder pending verification]"
      },
      {
        id: "rule_student_marks",
        field: "previous_marks_percentage",
        operator: "gte",
        condition: "previous_marks_percentage >= [PLACEHOLDER_MIN_MARKS: 50]",
        placeholder_value: 50,
        placeholder_note: "[PLACEHOLDER - Official NSP verification pending]",
        source_url: "https://scholarships.gov.in/public/faq",
        version: "1.0-draft",
        last_verified: "2026-10-01",
        title_hi: "पिछली परीक्षा में न्यूनतम 50% प्राप्तांक",
        title_en: "Minimum 50% Marks in Qualifying Exam",
        description_hi: "पिछली अंतिम कक्षा या बोर्ड परीक्षा में न्यूनतम 50% अंक प्राप्त होना आवश्यक है [सत्यापन लंबित]",
        description_en: "Must have secured minimum 50% marks in previous qualifying examination [placeholder pending verification]"
      },
      {
        id: "rule_student_bank",
        field: "has_bank_account",
        operator: "eq",
        condition: "has_bank_account == [PLACEHOLDER_BOOLEAN: true]",
        placeholder_value: true,
        placeholder_note: "[PLACEHOLDER - Official NSP verification pending]",
        source_url: "https://scholarships.gov.in/public/faq",
        version: "1.0-draft",
        last_verified: "2026-10-01",
        title_hi: "छात्र के स्वयं के नाम से बैंक खाता",
        title_en: "Active Bank Account in Student's Name",
        description_hi: "छात्रवृत्ति राशि के सीधे अंतरण (DBT) के लिए छात्र के अपने नाम से आधार-लिंक्ड बैंक खाता होना अनिवार्य है",
        description_en: "Student must possess an active, Aadhaar-linked savings bank account in their own name"
      }
    ]
  }
};

const cache = {};

export async function fetchSchemeRules(schemeId = 'widow-pension') {
  if (cache[schemeId]) return cache[schemeId];

  const schemeObj = SCHEMES.find(s => s.id === schemeId);
  const targetUrl = schemeObj?.rulesUrl || `/data/rules/${schemeId}.json`;

  try {
    const res = await fetch(targetUrl);
    if (res.ok) {
      cache[schemeId] = await res.json();
      return cache[schemeId];
    }
  } catch (e) {
    console.warn(`Fetch for ${schemeId} failed, using fallback schema`, e);
  }

  cache[schemeId] = DEFAULT_RULES_BY_SCHEME[schemeId] || DEFAULT_RULES_BY_SCHEME['widow-pension'];
  return cache[schemeId];
}

// Backward compatibility alias
export async function fetchWidowRules() {
  return fetchSchemeRules('widow-pension');
}
