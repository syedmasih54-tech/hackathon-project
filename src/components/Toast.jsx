import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm animate-in slide-in-from-bottom duration-300">
      <div className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 ${
        isSuccess
          ? 'bg-slate-900 text-white border-slate-700'
          : isError
          ? 'bg-red-600 text-white border-red-500'
          : 'bg-brandRed text-white border-deepRed shadow-lg'
      }`}>
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-red-200 flex-shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-red-200 flex-shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-red-200 flex-shrink-0" />}

        <div className="flex-1 text-xs sm:text-sm font-semibold">
          {toast.message}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


