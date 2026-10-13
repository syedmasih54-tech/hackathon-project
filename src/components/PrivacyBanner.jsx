import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyBanner({ lang = 'hi' }) {
  const isHi = lang === 'hi';

  return (
    <aside aria-label="Privacy notice" className="bg-red-50/70 border border-red-200/80 rounded-2xl p-3.5 px-5 flex items-center gap-3.5 text-xs md:text-sm text-red-950 shadow-sm">
      <div className="p-2 bg-red-100 rounded-xl text-brandRed flex-shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <p className="leading-relaxed">
        <strong className="font-bold text-brandRed">
          {isHi ? 'गोपनीयता सुरक्षा:' : 'Privacy Protection:'}
        </strong>{' '}
        {isHi
          ? 'आपके दस्तावेज़ केवल एक बार पढ़े जाते हैं और हमारे सर्वर पर कभी संग्रहीत नहीं होते। सभी रिकॉर्ड केवल आपके डिवाइस पर सुरक्षित हैं।'
          : 'Your documents are read once and not stored on our servers. All case records stay strictly on your device.'}
      </p>
    </aside>
  );
}
