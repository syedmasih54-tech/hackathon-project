import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PrivacyBanner({ lang = 'hi' }) {
  const isHi = lang === 'hi';

  return (
    <aside aria-label="Privacy notice" className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-3 px-4 flex items-center gap-3 text-xs md:text-sm text-emerald-900 shadow-sm">
      <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700 flex-shrink-0">
        <ShieldCheck className="w-4 h-4" />
      </div>
      <p className="leading-relaxed">
        <strong className="font-semibold">
          {isHi ? 'गोपनीयता सुरक्षा:' : 'Privacy Protection:'}
        </strong>{' '}
        {isHi
          ? 'आपके दस्तावेज़ केवल एक बार पढ़े जाते हैं और हमारे सर्वर पर कभी संग्रहीत नहीं होते। सभी रिकॉर्ड केवल आपके डिवाइस पर सुरक्षित हैं।'
          : 'Your documents are read once and not stored on our servers. All case records stay strictly on your device.'}
      </p>
    </aside>
  );
}
