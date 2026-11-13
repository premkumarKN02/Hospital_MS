import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Command, CheckCircle2 } from 'lucide-react';
import { PageRoute } from '../../types';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: PageRoute) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('Tap microphone to speak (English or Tamil supported)...');
  const [lastAction, setLastAction] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setFeedback('Listening... Please speak your command.');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setFeedback('Voice input error. Please try speaking again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartListening = (language: 'en-US' | 'ta-IN' = 'en-US') => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
      setTranscript('');
      setFeedback(`Listening (${language === 'ta-IN' ? 'Tamil' : 'English'})... Speak now.`);
      try {
        recognitionRef.current.start();
      } catch (e) {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current.start(), 200);
      }
    } else {
      setFeedback('Browser Web Speech API not supported.');
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const processCommand = (cmdText: string) => {
    const text = cmdText.toLowerCase().trim();
    if (!text) return;

    if (text.includes('patient') || text.includes('record') || text.includes('நோயாளி') || text.includes('ரெக்கார்ட்')) {
      onNavigate('patient-list');
      setLastAction('Navigating to Patient Master Index');
      speakResponse('Opening patient directory');
      setTimeout(onClose, 1500);
    } else if (text.includes('opd') || text.includes('consultation') || text.includes('desk') || text.includes('கன்சல்ட்') || text.includes('மருத்துவர்')) {
      onNavigate('hms-opd');
      setLastAction('Navigating to OPD Doctor Desk');
      speakResponse('Opening OPD doctor consultation desk');
      setTimeout(onClose, 1500);
    } else if (text.includes('bed') || text.includes('ward') || text.includes('census') || text.includes('பெட்') || text.includes('வார்டு')) {
      onNavigate('hms-ipd');
      setLastAction('Navigating to Live Bed Matrix');
      speakResponse('Opening IPD bed census matrix');
      setTimeout(onClose, 1500);
    } else if (text.includes('appointment') || text.includes('schedule') || text.includes('அப்பாயிண்ட்மென்ட்')) {
      onNavigate('appointment-list');
      setLastAction('Navigating to Appointment Console');
      speakResponse('Opening appointment console');
      setTimeout(onClose, 1500);
    } else if (text.includes('pharmacy') || text.includes('drug') || text.includes('stock') || text.includes('பார்மசி') || text.includes('மருந்து')) {
      onNavigate('erp-pharmacy');
      setLastAction('Navigating to Pharmacy Inventory ERP');
      speakResponse('Opening pharmacy inventory');
      setTimeout(onClose, 1500);
    } else if (text.includes('bill') || text.includes('invoice') || text.includes('gst') || text.includes('பில்லிங்')) {
      onNavigate('erp-billing');
      setLastAction('Navigating to GST Billing ERP');
      speakResponse('Opening GST billing counter');
      setTimeout(onClose, 1500);
    } else if (text.includes('lead') || text.includes('crm') || text.includes('pipeline') || text.includes('லீட்')) {
      onNavigate('crm-pipeline');
      setLastAction('Navigating to CRM Leads Pipeline');
      speakResponse('Opening patient CRM pipeline');
      setTimeout(onClose, 1500);
    } else if (text.includes('feedback') || text.includes('nps') || text.includes('review') || text.includes('கருத்து')) {
      onNavigate('crm-feedback');
      setLastAction('Navigating to Patient Feedback & NPS');
      speakResponse('Opening patient feedback analytics');
      setTimeout(onClose, 1500);
    } else if (text.includes('roster') || text.includes('shift') || text.includes('attendance') || text.includes('ரோஸ்டர்')) {
      onNavigate('hrms-roster');
      setLastAction('Navigating to HRMS Duty Roster');
      speakResponse('Opening staff shift roster');
      setTimeout(onClose, 1500);
    } else if (text.includes('leave') || text.includes('holiday') || text.includes('விடுப்பு')) {
      onNavigate('hrms-leaves');
      setLastAction('Navigating to Leave Management');
      speakResponse('Opening leave management');
      setTimeout(onClose, 1500);
    } else if (text.includes('dashboard') || text.includes('home') || text.includes('overview') || text.includes('முகப்பு')) {
      onNavigate('admin-dashboard');
      setLastAction('Navigating to Executive Dashboard');
      speakResponse('Opening executive dashboard');
      setTimeout(onClose, 1500);
    } else {
      setLastAction(`Command not recognized: "${cmdText}". Please choose a command below.`);
      speakResponse('Command not recognized. Please try again.');
    }
  };

  useEffect(() => {
    if (transcript && !isListening) {
      processCommand(transcript);
    }
  }, [isListening, transcript]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">
                AI Voice Navigation & Assistant
              </h2>
              <p className="text-xs text-emerald-100">Supports English & Tamil Voice Input</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-6">
          {/* Mic Visualizer */}
          <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
                <div className="absolute inset-2 rounded-full bg-teal-500/30 animate-pulse"></div>
              </>
            )}
            <button
              onClick={isListening ? handleStopListening : () => handleStartListening('en-US')}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 active:scale-95 ${
                isListening
                  ? 'bg-rose-500 text-white ring-4 ring-rose-200 dark:ring-rose-900/50 shadow-rose-500/40'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
              }`}
            >
              {isListening ? (
                <MicOff className="w-10 h-10 animate-bounce" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          {/* Status Message */}
          <div className="min-h-[56px] flex flex-col items-center justify-center">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{feedback}</p>
            {transcript && (
              <p className="mt-2 text-base font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-4 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                "{transcript}"
              </p>
            )}
            {lastAction && (
              <p className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lastAction}
              </p>
            )}
          </div>

          {/* Language Mode Toggle */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => handleStartListening('en-US')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            >
              English Voice
            </button>
            <button
              onClick={() => handleStartListening('ta-IN')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            >
              தமிழ் குரல் (Tamil Input)
            </button>
          </div>

          {/* Example Voice Commands */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-left">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              <Command className="w-3.5 h-3.5" />
              Example Voice Commands:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => processCommand('patient')}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-left transition-colors border border-slate-200 dark:border-slate-700"
              >
                "Show patients" / "நோயாளி"
              </button>
              <button
                onClick={() => processCommand('opd')}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-left transition-colors border border-slate-200 dark:border-slate-700"
              >
                "Open OPD desk"
              </button>
              <button
                onClick={() => processCommand('bed')}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-left transition-colors border border-slate-200 dark:border-slate-700"
              >
                "Check bed status" / "பெட்"
              </button>
              <button
                onClick={() => processCommand('pharmacy')}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-left transition-colors border border-slate-200 dark:border-slate-700"
              >
                "Pharmacy stock" / "பார்மசி"
              </button>
              <button
                onClick={() => processCommand('bill')}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-left transition-colors border border-slate-200 dark:border-slate-700"
              >
                "Open billing" / "பில்லிங்"
              </button>
              <button
                onClick={() => processCommand('roster')}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-left transition-colors border border-slate-200 dark:border-slate-700"
              >
                "Duty roster" / "ரோஸ்டர்"
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
