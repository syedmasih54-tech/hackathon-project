import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { createSpeechRecognizer } from '../utils/speech.js';

export default function VoiceButton({ onTranscript, lang = 'hi', label = 'बोलकर भरें' }) {
  const [isListening, setIsListening] = useState(false);
  const [recognizer, setRecognizer] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const speechLang = lang === 'hi' ? 'hi-IN' : 'en-IN';

  const toggleListening = () => {
    setErrorMsg('');
    if (isListening && recognizer) {
      recognizer.stop();
      setIsListening(false);
      return;
    }

    const rec = createSpeechRecognizer({
      lang: speechLang,
      onStart: () => setIsListening(true),
      onEnd: () => setIsListening(false),
      onResult: (transcript) => {
        setIsListening(false);
        if (onTranscript && transcript) {
          onTranscript(transcript);
        }
      },
      onError: (err) => {
        setIsListening(false);
        if (err === 'not_supported') {
          setErrorMsg(lang === 'hi' ? 'माइक्रोफ़ोन इस ब्राउज़र में समर्थित नहीं है' : 'Voice input not supported in this browser');
        } else if (err === 'not-allowed') {
          setErrorMsg(lang === 'hi' ? 'कृपया माइक्रोफ़ोन की अनुमति दें' : 'Please allow microphone permission');
        } else {
          setErrorMsg(lang === 'hi' ? 'आवाज़ पहचानी नहीं गई, कृपया दोबारा बोलें' : 'Voice not recognized, please speak clearly');
        }
      }
    });

    if (!rec.isSupported) {
      setErrorMsg(lang === 'hi' ? 'माइक्रोफ़ोन समर्थित नहीं है, कृपया लिखकर भरें' : 'Voice not supported, please type');
      return;
    }

    setRecognizer(rec);
    rec.start();
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={toggleListening}
        title={label}
        aria-label={`${label} (${isListening ? 'Listening' : 'Click to speak'})`}
        className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all shadow-sm ${
          isListening
            ? 'bg-red-50 border-red-300 text-red-600 animate-pulse ring-2 ring-red-400'
            : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800 hover:text-emerald-900'
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 text-red-500 animate-bounce" />
            <span className="hidden sm:inline font-bold">
              {lang === 'hi' ? 'सुन रहे हैं...' : 'Listening...'}
            </span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">{label}</span>
          </>
        )}
      </button>

      {errorMsg && (
        <div className="absolute top-full left-0 mt-1 z-20 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg p-2 text-xs shadow-md whitespace-nowrap">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
