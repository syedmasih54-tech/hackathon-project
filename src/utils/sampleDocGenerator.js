/**
 * sampleDocGenerator.js
 * Generates realistic placeholder official document canvas dataURLs for testing:
 * 1. Ration Card (UP / Bihar / National Food Security)
 * 2. Bank Passbook (SBI / PNB Savings Passbook)
 * 3. Land Record / Khasra-Khatauni (Revenue Dept)
 * 4. College Student ID Card / Marksheet
 */

export function generateSampleDocumentImage({
  type = 'ration',
  name = 'Sunita Devi',
  state = 'Uttar Pradesh',
  district = 'Varanasi',
  schemeId = 'widow-pension'
}) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 420;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  if (type === 'passbook') {
    // Bank Passbook Style
    // Background gradient: Navy / Blue
    const grad = ctx.createLinearGradient(0, 0, 640, 420);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 420);

    // Top Header Banner
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 0, 640, 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText('STATE BANK OF INDIA / भारतीय स्टेट बैंक', 30, 42);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.fillText('SAVINGS BANK ACCOUNT PASSBOOK / बचत बैंक पासबुक', 30, 60);

    // Border
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 620, 400);

    // Details Grid
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px system-ui, sans-serif';

    ctx.fillText('Account Holder Name:', 40, 120);
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText(name.toUpperCase(), 40, 150);

    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('Branch: ' + district.toUpperCase() + ' MAIN BRANCH', 40, 190);
    ctx.fillText('Account Status: ACTIVE (NPCI / DBT SEEDED: YES)', 40, 220);
    ctx.fillText('IFSC: SBIN0001234', 40, 250);
    ctx.fillText('Account Number: ************4321 [MASKED]', 40, 280);

    // Official Stamp seal
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(520, 310, 55, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText('SBI MAIN BRANCH', 470, 305);
    ctx.fillText('OFFICIALLY VERIFIED', 460, 320);

  } else if (type === 'land') {
    // PM-KISAN Land Record (Khatauni / Revenue Department)
    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(0, 0, 640, 420);

    // Header
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 0, 640, 65);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText('राजस्व परिषद - उद्धरण खतौनी (ROR)', 30, 40);

    // Border
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 620, 400);

    ctx.fillStyle = '#451a03';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText('खातेदार / भूमि स्वामी का नाम (Landholder Name):', 40, 120);

    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillStyle = '#9a3412';
    ctx.fillText(name.toUpperCase(), 40, 150);

    ctx.font = '14px system-ui, sans-serif';
    ctx.fillStyle = '#451a03';
    ctx.fillText('ज़िला: ' + district + ' | राज्य: ' + state, 40, 190);
    ctx.fillText('खसरा संख्या: 142/2 | कुल क्षेत्रफल: 1.25 हेक्टेयर (कृषि योग्य)', 40, 220);
    ctx.fillText('भूलेख सत्यापन: पूर्ण एवं सत्यापित (e-KYC Linked)', 40, 250);

    // Stamp
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(520, 310, 50, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#b45309';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText('तहसीलदार कार्यालय', 470, 315);

  } else if (type === 'student_id') {
    // Student College ID Card
    ctx.fillStyle = '#f0fdf4';
    ctx.fillRect(0, 0, 640, 420);

    ctx.fillStyle = '#166534';
    ctx.fillRect(0, 0, 640, 65);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText('GOVERNMENT DEGREE COLLEGE / राजकीय महाविद्यालय', 30, 40);

    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, 620, 400);

    ctx.fillStyle = '#064e3b';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText('Student Name / छात्र का नाम:', 40, 120);

    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillStyle = '#166534';
    ctx.fillText(name.toUpperCase(), 40, 150);

    ctx.font = '14px system-ui, sans-serif';
    ctx.fillStyle = '#064e3b';
    ctx.fillText('Course: B.Sc. / B.Com Regular Enrollment', 40, 190);
    ctx.fillText('Academic Year: 2026-2027 (Post-Matric)', 40, 220);
    ctx.fillText('Previous Exam Marks: 68.4% (Qualified for NSP)', 40, 250);

    // Seal
    ctx.strokeStyle = '#166534';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(520, 310, 50, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#166534';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText('PRINCIPAL SEAL', 475, 315);

  } else {
    // National Food Security / Ration Card Style
    ctx.fillStyle = '#fef2f2';
    ctx.fillRect(0, 0, 640, 420);

    // Top Green / Orange Banner
    ctx.fillStyle = '#047857';
    ctx.fillRect(0, 0, 640, 65);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText('खाद्य एवं रसद विभाग - राष्ट्रीय खाद्य सुरक्षा कार्ड (NFSA)', 30, 40);

    // Card border
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 620, 400);

    // Details Grid
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillText('मुख्या / लाभार्थी का नाम (Beneficiary Name):', 40, 120);

    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillStyle = '#047857';
    ctx.fillText(name.toUpperCase(), 40, 150);

    ctx.font = '14px system-ui, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('राशन कार्ड प्रकार: बी.पी.एल. / अंत्योदय (BPL Category)', 40, 190);
    ctx.fillText('राज्य / ज़िला: ' + state + ' / ' + district, 40, 220);
    ctx.fillText('कार्ड संख्या: ************9812 [MASKED]', 40, 250);
    ctx.fillText('स्थिति: सक्रिय एवं मान्य (Valid for DBT)', 40, 280);

    // Stamp
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(520, 310, 50, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillText('खाद्य आपूर्ति अधिकारी', 465, 305);
    ctx.fillText('VERIFIED BPL', 475, 320);
  }

  return canvas.toDataURL('image/jpeg', 0.92);
}

