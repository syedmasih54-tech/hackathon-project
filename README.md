# BenefitBridge (बेनिफ़िट ब्रिज)
> *Every benefit, to the person it was meant for.* / *हर हक, सही व्यक्ति तक।*

BenefitBridge is an open-source, mobile-first, voice-enabled welfare eligibility and document verification Progressive Web App (PWA) built with **React + Vite + Tailwind CSS**.

---

## 🛡️ Core Privacy & Architectural Principles
1. **Device-First Storage**: All citizen data, intake responses, timeline entries, acknowledgement photos, and consent preferences are stored strictly in client-side **IndexedDB**.
2. **Zero Server Logging of Documents**: Uploaded documents are read in-memory by Gemini Vision to extract beneficiary names and are never saved to disk, databases, or logs.
3. **No Sensitive PII Collected**: BenefitBridge **never** asks for Aadhaar numbers, mobile phone numbers, or full bank account numbers.
4. **Code-Based Name Verification**: Document names are normalized and matched algorithmically in deterministic code (ignoring honorifics, matching initials, handling Devanagari transliteration, and phonetics). AI is **never** used to decide eligibility or make name-matching verdicts.
5. **Safe Messaging**: If names differ, BenefitBridge reports *"Possible name difference found"* — never *"fraud"*.
6. **One-Click Data Deletion**: A persistent *"Delete my case"* control wipes the entire IndexedDB database upon confirmation.

---

## 🌾 Supported Welfare Schemes (3 Schemes)
1. **Widow Pension (इंदिरा गांधी राष्ट्रीय विधवा पेंशन योजना - IGNWPS)**:
   - Evaluates minimum age (40+), widow marital status, BPL / Antyodaya category, and DBT bank account.
   - Document verification: Ration Card + Bank Passbook.
2. **Farmers Support (प्रधानमंत्री किसान सम्मान निधि - PM-KISAN)**:
   - Evaluates cultivable agricultural landholding ownership, age (18+), non-taxpayer exclusion criteria, and active DBT bank account.
   - Document verification: Land Ownership Record (Khasra / Khatoni) + Bank Passbook.
3. **Student Scholarship (पोस्ट-मैट्रिक छात्रवृत्ति योजना - NSP)**:
   - Evaluates regular enrollment in recognized post-matric institution, family annual income (<= ₹2.50 Lakh), previous exam marks (>= 50%), and student's own bank account.
   - Document verification: Marksheet / College ID + Student Bank Passbook.
2. **Intake Form (आवेदन जानकारी)**: Real inputs with linked State and District dropdowns, validated age (18–110), gender, marital status (including widowed), ration card type (BPL / AAY / Other / None), bank account status, and ration card name. Includes Web Speech API voice input per field with typed fallback.
3. **Eligibility Result (पात्रता जांच)**: Deterministic evaluation loaded from `/data/rules/widow-pension.json`. Unverified placeholder values are highlighted with a prominent warning. Clearly displays *"You may be eligible"* (never *"Approved"*), matched vs. missing conditions, and a *"Why?"* panel linking to [nsap.nic.in](https://nsap.nic.in).
4. **Document Doctor (दस्तावेज़ डॉक्टर)**: Dual upload slots for Ration Card and Bank Passbook (camera or file). Browser-side canvas analysis checks for blur, darkness, and low resolution with retake suggestions. Serverless Gemini Vision extracts only `{"name": "...", "confidence": 0-1}`. Beneficiary names are confirmed/edited in editable input boxes.
5. **Readiness Card (तैयारी कार्ड)**: Rule-derived 0–100% completion gauge across 5 core pillars with green ticks, red marks, and actionable next steps for missing items.
6. **Evidence Timeline (साक्ष्य टाइमलाइन)**: Vertical chronological log for tracking application dates, masked reference numbers (`UP20********4321`), office visit notes, rejection reasons, and locally stored receipt photos in IndexedDB.
7. **Complaint Draft (शिकायत मसौदा)**: Activated for delayed applications (>45 days). Sends strictly structured facts to Gemini to generate a polite, factual Hindi complaint (<= 120 words). Enables a link to [pgportal.gov.in](https://pgportal.gov.in) upon user review and approval, and generates a 21-day follow-up reminder `.ics` calendar file.
8. **Sample Dashboard (नमूना डैशबोर्ड)**: Administrative transparency mockup clearly flagged with `⚠️ SAMPLE DATA — NOT FROM REAL CASES`. Real user data is never mixed into this view.

---

## 🚀 Quickstart & Development

### 1. Requirements
- Node.js 18+

### 2. Installation
```bash
cd benefit-bridge
npm install
```

### 3. Configure Gemini API Key (Optional for Local AI OCR)
Create a `.env` file in the root:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```
*(Note: If `GEMINI_API_KEY` is omitted, the app gracefully falls back to deterministic local templates and manual text editing).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. The Vite dev server automatically provides local serverless handlers on `/api/ocr` and `/api/complaint` with sliding-window rate limiting.

### 5. Run Automated Tests
```bash
npm test
```
Executes the Vitest test suite covering:
- Deterministic rules evaluation
- Name matching with initials (`"Sunita Devi"` vs `"Sunita D."`)
- Devanagari transliteration (`"सुनीता देवी"` vs `"Sunita Devi"`)
- Distinct names (`"Sunita Devi"` vs `"Geeta Sharma"`)
- Honorific removal (`"Smt. Sunita Devi"` vs `"Sunita Devi"`)

---

## ☁️ Deployment

### Vercel
BenefitBridge includes serverless endpoints configured in `/api/`:
- `api/ocr.js`
- `api/complaint.js`

Add `GEMINI_API_KEY` under **Project Settings > Environment Variables** on Vercel.

### Netlify
Includes Netlify serverless functions in `/netlify/functions/`:
- `netlify/functions/ocr.js`
- `netlify/functions/complaint.js`

Set `GEMINI_API_KEY` under **Site configuration > Environment variables** on Netlify.
