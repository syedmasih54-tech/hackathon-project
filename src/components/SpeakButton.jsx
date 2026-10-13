import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeaking, isSpeaking } from '../utils/speech.js';

export default function SpeakButton({
  text,
  lang = 'hi',
  labelHi = 'सुनें',
  labelEn = 'Listen',
  className = '',
  size = 'md'
}) {
  const [playing, setPlaying] = useState(false);
  const speechLang = lang === 'hi' ? 'hi-IN' : 'en-IN';

  useEffect(() => {
    return () => {
      // Clean up when unmounting
      if (playing) {
        stopSpeaking();
      }
    };
  }, [playing]);

  const toggleSpeak = () => {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
    } else {
      setPlaying(true);
      speakText(text, speechLang, () => setPlaying(false));
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      type="button"
      onClick={toggleSpeak}
      title={playing ? (lang === 'hi' ? 'रोकें' : 'Stop') : (lang === 'hi' ? labelHi : labelEn)}
      aria-label={playing ? 'Stop speech' : 'Listen aloud'}
      className={`min-h-[40px] inline-flex items-center gap-1.5 rounded-xl font-bold transition-all shadow-sm ${
        isSmall ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-xs sm:text-sm'
      } ${
        playing
          ? 'bg-amber-100 text-amber-900 border-2 border-amber-400 ring-2 ring-amber-300 animate-pulse'
          : 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800'
      } ${className}`}
    >
      {playing ? (
        <>
          <VolumeX className={isSmall ? 'w-3.5 h-3.5 text-amber-700' : 'w-4 h-4 text-amber-700'} />
          <span>{lang === 'hi' ? 'रोकें' : 'Stop'}</span>
          <span className="flex gap-0.5 ml-1">
            <span className="w-1 h-3 bg-amber-600 rounded-full animate-bounce [animation-delay:0ms]"></span>
            <span className="w-1 h-3 bg-amber-600 rounded-full animate-bounce [animation-delay:150ms]"></span>
            <span className="w-1 h-3 bg-amber-600 rounded-full animate-bounce [animation-delay:300ms]"></span>
          </span>
        </>
      ) : (
        <>
          <Volume2 className={isSmall ? 'w-3.5 h-3.5 text-emerald-700' : 'w-4 h-4 text-emerald-700'} />
          <span>{lang === 'hi' ? labelHi : labelEn}</span>
        </>
      )}
    </button>
  );
}

