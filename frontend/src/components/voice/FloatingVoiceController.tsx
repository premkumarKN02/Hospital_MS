import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Command,
  CheckCircle2,
  ArrowRight,
  Languages,
  Compass,
  Radio,
  ExternalLink,
  ChevronUp
} from 'lucide-react';
import { PageRoute } from '../../types';

interface FloatingVoiceControllerProps {
  onNavigate: (route: PageRoute | string) => void;
  onOpenAiCopilot?: () => void;
}

export const FloatingVoiceController: React.FC<FloatingVoiceControllerProps> = ({
  onNavigate,
  onOpenAiCopilot
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<'en-US' | 'ta-IN'>('en-US');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Tap microphone to speak your command.');
  const [lastExecuted, setLastExecuted] = useState<string | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage(language === 'ta-IN' ? 'கேட்கிறது... கட்டளையை கூறவும்' : 'Listening... Speak your command');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          setTranscript(final);
          setInterimTranscript('');
          processVoiceCommand(final);
        } else {
          setInterimTranscript(interim);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setInterimTranscript('');
        if (event.error !== 'no-speech') {
          setStatusMessage('Microphone access paused. Tap to retry.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [language]);

  // Text-To-Speech Speaker
  const speakFeedback = (text: string, lang = language) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS error:', e);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      setStatusMessage('Web Speech API not supported in this browser.');
      return;
    }

    try {
      recognitionRef.current.lang = language;
      setTranscript('');
      setInterimTranscript('');
      recognitionRef.current.start();
    } catch (e) {
      try {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current.start(), 200);
      } catch (err) {}
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  // Comprehensive Clinical & Hospital Voice Router (English & Tamil)
  const processVoiceCommand = (rawText: string) => {
    const text = rawText.toLowerCase().trim();
    if (!text) return;

    let destination: PageRoute | null = null;
    let feedbackEn = '';
    let feedbackTa = '';

    // 1. Executive Dashboard
    if (text.includes('dashboard') || text.includes('home') || text.includes('டேஷ்போர்டு') || text.includes('முகப்பு') || text.includes('ஹோம்')) {
      destination = 'admin-dashboard';
      feedbackEn = 'Navigating to Executive Command Center';
      feedbackTa = 'கட்டளை மையத்திற்கு செல்கிறது';
    }
    // 2. OPD Consultation Desk
    else if (text.includes('opd') || text.includes('doctor desk') || text.includes('consultation') || text.includes('clinic') || text.includes('மருத்துவர்') || text.includes('ஓபிடி') || text.includes('டாக்டர்')) {
      destination = 'hms-opd';
      feedbackEn = 'Opening OPD Doctor Consultation Desk';
      feedbackTa = 'ஓபிடி மருத்துவர் பகுதி திறக்கப்படுகிறது';
    }
    // 3. IPD Bed Matrix
    else if (text.includes('ipd') || text.includes('bed') || text.includes('ward') || text.includes('census') || text.includes('படுக்கை') || text.includes('ஐபிடி') || text.includes('வார்டு')) {
      destination = 'hms-ipd';
      feedbackEn = 'Opening Inpatient Bed Census Matrix';
      feedbackTa = 'உள்நோயாளி படுக்கை விபரம் திறக்கப்படுகிறது';
    }
    // 4. OT & Surgery
    else if (text.includes('ot') || text.includes('surgery') || text.includes('operation') || text.includes('theatre') || text.includes('அறுவை சிகிச்சை') || text.includes('ஆபரேஷன்')) {
      destination = 'hms-ot';
      feedbackEn = 'Opening Operating Theatre & Surgery Suites';
      feedbackTa = 'அறுவை சிகிச்சைப் பகுதி திறக்கப்படுகிறது';
    }
    // 5. LIS Pathology
    else if (text.includes('lab') || text.includes('pathology') || text.includes('lis') || text.includes('blood test') || text.includes('லேப்') || text.includes('பரிசோதனை')) {
      destination = 'hms-lis';
      feedbackEn = 'Opening Pathology Laboratory Information System';
      feedbackTa = 'ஆய்வகப் பகுதி திறக்கப்படுகிறது';
    }
    // 6. RIS Radiology
    else if (text.includes('radiology') || text.includes('x-ray') || text.includes('ct') || text.includes('mri') || text.includes('ris') || text.includes('ஸ்கேன்') || text.includes('எக்ஸ்ரே')) {
      destination = 'hms-ris';
      feedbackEn = 'Opening Radiology & PACS Imaging Desk';
      feedbackTa = 'கதிரியக்கப் பகுதி திறக்கப்படுகிறது';
    }
    // 7. Blood Bank
    else if (text.includes('blood bank') || text.includes('blood') || text.includes('donor') || text.includes('இரத்த வங்கி') || text.includes('இரத்தம்')) {
      destination = 'hms-bloodbank';
      feedbackEn = 'Opening Blood Bank Component Inventory';
      feedbackTa = 'இரத்த வங்கி திறக்கப்படுகிறது';
    }
    // 8. Emergency & Trauma
    else if (text.includes('emergency') || text.includes('er') || text.includes('trauma') || text.includes('triage') || text.includes('அவசர') || text.includes('ஆம்புலன்ஸ்')) {
      destination = 'hms-emergency';
      feedbackEn = 'Opening Emergency & Trauma Resuscitation';
      feedbackTa = 'அவசர சிகிச்சை பிரிவு திறக்கப்படுகிறது';
    }
    // 9. Pharmacy & Drug Inventory
    else if (text.includes('pharmacy') || text.includes('drug') || text.includes('medicine') || text.includes('stock') || text.includes('மருந்தகம்') || text.includes('மருந்து')) {
      destination = 'erp-pharmacy';
      feedbackEn = 'Opening Pharmacy Formulary & Dispense Desk';
      feedbackTa = 'மருந்தகம் திறக்கப்படுகிறது';
    }
    // 10. Billing & POS
    else if (text.includes('bill') || text.includes('pos') || text.includes('invoice') || text.includes('payment') || text.includes('gst') || text.includes('பில்லிங்') || text.includes('ரசீது')) {
      destination = 'erp-billing';
      feedbackEn = 'Opening GST Counter Billing & POS';
      feedbackTa = 'பில்லிங் கவுண்டர் திறக்கப்படுகிறது';
    }
    // 11. TPA Insurance
    else if (text.includes('tpa') || text.includes('insurance') || text.includes('cashless') || text.includes('claim') || text.includes('காப்பீடு') || text.includes('இன்சூரன்ஸ்')) {
      destination = 'erp-tpa-claims';
      feedbackEn = 'Opening TPA Cashless Insurance Desk';
      feedbackTa = 'காப்பீட்டு பகுதி திறக்கப்படுகிறது';
    }
    // 12. Procurement & PO
    else if (text.includes('procurement') || text.includes('purchase order') || text.includes('po') || text.includes('vendor') || text.includes('கொள்முதல்')) {
      destination = 'erp-procurement';
      feedbackEn = 'Opening Procurement & Purchase Order Management';
      feedbackTa = 'கொள்முதல் பகுதி திறக்கப்படுகிறது';
    }
    // 13. Biomedical Assets
    else if (text.includes('biomedical') || text.includes('equipment') || text.includes('maintenance') || text.includes('கருவிகள்')) {
      destination = 'erp-biomedical';
      feedbackEn = 'Opening Biomedical Asset Management';
      feedbackTa = 'மருத்துவ உபகரணப் பகுதி திறக்கப்படுகிறது';
    }
    // 14. HRMS Roster & Shifts
    else if (text.includes('roster') || text.includes('shift') || text.includes('duty') || text.includes('attendance') || text.includes('ரோஸ்டர்') || text.includes('பணி')) {
      destination = 'hrms-roster';
      feedbackEn = 'Opening Workforce Duty Roster';
      feedbackTa = 'பணி அட்டவணை திறக்கப்படுகிறது';
    }
    // 15. Patients Master Index
    else if (text.includes('patient') || text.includes('uhid') || text.includes('record') || text.includes('நோயாளி') || text.includes('நோயாளிகள்')) {
      destination = 'patient-list';
      feedbackEn = 'Opening Master Patient Index';
      feedbackTa = 'நோயாளி விபரங்கள் திறக்கப்படுகிறது';
    }
    // 16. Appointment Console
    else if (text.includes('appointment') || text.includes('booking') || text.includes('அப்பாயிண்ட்மென்ட்') || text.includes('முன்பதிவு')) {
      destination = 'appointment-list';
      feedbackEn = 'Opening Appointment Booking Console';
      feedbackTa = 'முன்பதிவு விபரம் திறக்கப்படுகிறது';
    }
    // 17. Doctor Registry
    else if (text.includes('doctors') || text.includes('physician') || text.includes('மருத்துவர்கள்')) {
      destination = 'doctor-list';
      feedbackEn = 'Opening Consultant Physicians Registry';
      feedbackTa = 'மருத்துவர்கள் பட்டியல் திறக்கப்படுகிறது';
    }
    // 18. Incident Reporting
    else if (text.includes('incident') || text.includes('safety') || text.includes('capa') || text.includes('பாதுகாப்பு')) {
      destination = 'admin-incidents';
      feedbackEn = 'Opening Safety Incidents & CAPA Sentinel';
      feedbackTa = 'பாதுகாப்பு பதிவேடு திறக்கப்படுகிறது';
    }
    // 19. Compliance & NABH
    else if (text.includes('compliance') || text.includes('nabh') || text.includes('license') || text.includes('விதிமுறை')) {
      destination = 'admin-compliance';
      feedbackEn = 'Opening NABH Accreditation & Compliance';
      feedbackTa = 'தரக்கட்டுப்பாடு பகுதி திறக்கப்படுகிறது';
    }
    // 20. General query -> Ask AI Copilot
    else {
      setStatusMessage(`Query recognized: "${rawText}". Passing to AI Medical Copilot...`);
      setLastExecuted(`Consulting AI Copilot: "${rawText}"`);
      speakFeedback('Query forwarded to AI Medical Copilot');
      if (onOpenAiCopilot) {
        setTimeout(onOpenAiCopilot, 800);
      }
      return;
    }

    if (destination) {
      const feedbackText = language === 'ta-IN' ? feedbackTa : feedbackEn;
      setStatusMessage(feedbackText);
      setLastExecuted(feedbackText);
      speakFeedback(feedbackText);
      onNavigate(destination);
    }
  };

  const handleChipClick = (cmd: string) => {
    setTranscript(cmd);
    processVoiceCommand(cmd);
  };

  return (
    <>
      {/* ── 1. Floating Circular Action Button (Bottom-Right Corner) ── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Voice Assistant & Controller"
          title="Voice Assistant & Controller (English / தமிழ்)"
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_8px_25px_rgba(37,99,235,0.35)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.55)] hover:scale-105 active:scale-95 cursor-pointer relative group ${
            isOpen
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 ring-4 ring-blue-500/30'
              : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white'
          }`}
        >
          {/* Glowing Ripple Pulse Ring when listening */}
          {isListening && (
            <span className="absolute -inset-1 rounded-full bg-blue-500 opacity-60 animate-ping pointer-events-none" />
          )}

          {isOpen ? (
            <X className="w-6 h-6 stroke-[2.2] transition-transform group-hover:rotate-90" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Mic className="w-6 h-6 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900" />
            </div>
          )}
        </button>
      </div>

      {/* ── 2. Floating Interactive Voice Controller Card (Right Above FAB) ── */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[350px] sm:w-[400px] bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.22)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Mic className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Hospital Voice Controller</h3>
                  <p className="text-[11px] text-blue-100 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-300 animate-pulse" />
                    Web Speech API • Dual Language
                  </p>
                </div>
              </div>

              {/* Language Switcher & Speaker Toggle */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setLanguage(language === 'en-US' ? 'ta-IN' : 'en-US')}
                  title="Toggle Language (English / Tamil)"
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/30 border border-white/30 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Languages className="w-3 h-3" />
                  <span>{language === 'ta-IN' ? 'தமிழ்' : 'English'}</span>
                </button>

                <button
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                  title={ttsEnabled ? 'Mute Speech Output' : 'Enable Speech Output'}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
                >
                  {ttsEnabled ? <Volume2 className="w-3.5 h-3.5 text-white" /> : <VolumeX className="w-3.5 h-3.5 text-white/60" />}
                </button>
              </div>
            </div>
          </div>

          {/* Central Live Speaking Studio */}
          <div className="p-5 flex flex-col items-center text-center space-y-4">
            {/* Live Audio Waves and Big Mic Button */}
            <div className="relative my-2">
              {isListening && (
                <div className="absolute -inset-3 rounded-full bg-blue-500/20 dark:bg-blue-400/20 animate-pulse pointer-events-none" />
              )}

              <button
                onClick={isListening ? stopListening : startListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/40 ring-4 ring-rose-200 dark:ring-rose-900/60 scale-105'
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/30'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-9 h-9 animate-bounce" />
                ) : (
                  <Mic className="w-9 h-9" />
                )}
              </button>
            </div>

            {/* Audio Wave Visualizer when listening */}
            {isListening && (
              <div className="flex items-center gap-1 h-5">
                {[0.4, 0.9, 0.6, 1.0, 0.5, 0.8, 0.3].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h * 18}px` }}
                    className="w-1 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Live Status & Transcript Display */}
            <div className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-3.5 space-y-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {isListening ? (
                  <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    {language === 'ta-IN' ? 'பேசுங்கள்...' : 'Listening... Speak now'}
                  </span>
                ) : (
                  statusMessage
                )}
              </p>

              {(transcript || interimTranscript) && (
                <div className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 break-words">
                  "{transcript || interimTranscript}"
                </div>
              )}

              {lastExecuted && (
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/70">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{lastExecuted}</span>
                </div>
              )}
            </div>

            {/* Quick 1-Tap Voice Command Chips */}
            <div className="w-full text-left space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                {language === 'ta-IN' ? 'விரைவு குரல் கட்டளைகள்' : 'Quick Voice Commands'}
              </span>

              <div className="flex flex-wrap gap-1.5">
                {(language === 'ta-IN' ? [
                  { label: 'ஓபிடி மருத்துவர்', cmd: 'ஓபிடி மருத்துவர் திற' },
                  { label: 'படுக்கை நிலவரம்', cmd: 'படுக்கை விபரம் திற' },
                  { label: 'அறுவை சிகிச்சை', cmd: 'அறுவை சிகிச்சை' },
                  { label: 'மருந்தகம்', cmd: 'மருந்தகம் திற' },
                  { label: 'பில்லிங் கவுண்டர்', cmd: 'பில்லிங் கவுண்டர்' },
                  { label: 'நோயாளி விபரம்', cmd: 'நோயாளி விபரம்' },
                  { label: 'அவசர சிகிச்சை', cmd: 'அவசர சிகிச்சை' }
                ] : [
                  { label: 'Open OPD Desk', cmd: 'Open OPD' },
                  { label: 'Inpatient Beds', cmd: 'Inpatient beds' },
                  { label: 'OT Surgery', cmd: 'Open surgery' },
                  { label: 'Pathology Lab', cmd: 'Open lab' },
                  { label: 'Pharmacy ERP', cmd: 'Open pharmacy' },
                  { label: 'GST Billing', cmd: 'Open billing' },
                  { label: 'Patient MPI', cmd: 'Patient records' },
                  { label: 'Duty Roster', cmd: 'Staff roster' }
                ]).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChipClick(item.cmd)}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/70 dark:border-slate-700 text-[11px] font-medium transition-all cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Seamless handoff to AI Medical Copilot */}
            {onOpenAiCopilot && (
              <div className="w-full pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAiCopilot();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Open Deep AI Medical Copilot Drawer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
