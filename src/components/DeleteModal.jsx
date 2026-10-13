import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm, lang = 'hi' }) {
  if (!isOpen) return null;
  const isHi = lang === 'hi';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={isHi ? 'बंद करें' : 'Close modal'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h2 id="delete-modal-title" className="text-lg font-bold text-slate-900">
            {isHi ? 'क्या आप अपना केस डेटा मिटाना चाहते हैं?' : 'Delete all my case data?'}
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            {isHi
              ? 'यह क्रिया आपके फ़ोन/ब्राउज़र की IndexedDB से सभी फ़ोटो, आवेदन विवरण, टाइमलाइन और सहमति रिकॉर्ड हमेशा के लिए मिटा देगी। इसे पूर्ववत नहीं किया जा सकता।'
              : 'This action will permanently wipe all uploaded photos, case entries, timeline logs, and consent records from your device IndexedDB. This cannot be undone.'}
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-1/2 min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-slate-400"
          >
            {isHi ? 'रद्द करें' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-1/2 min-h-[44px] px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm flex items-center justify-center gap-2 focus:ring-2 focus:ring-red-500"
          >
            <Trash2 className="w-4 h-4" />
            {isHi ? 'हाँ, मिटाएं' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
