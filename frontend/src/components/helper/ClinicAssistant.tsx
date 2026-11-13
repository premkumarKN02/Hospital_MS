import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Globe,
  Compass
} from 'lucide-react';
import { PageRoute } from '../../types';
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  generateMultilingualAnswer
} from './assistantKnowledge';
import { sendUniversalWhatsApp } from '../../utils/whatsappUtils';

interface Message {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  spokenText?: string;
  commandExecuted?: string;
  actionButton?: {
    label: string;
    route?: PageRoute;
    externalUrl?: string;
    specialAction?: 'scroll-top' | 'scroll-bottom' | 'call' | 'whatsapp';
  };
  suggestedFollowUps?: string[];
}

interface ClinicAssistantProps {
  onNavigate: (page: PageRoute) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ClinicAssistant: React.FC<ClinicAssistantProps> = ({ onNavigate, isOpen, onClose }) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('en');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  // Track viewport width to switch between mobile overlay and desktop panel
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 640);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keep isDesktop in sync when user resizes window
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 640);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const getWelcomeMessage = (lang: SupportedLanguage): Message => {
    const welcomeTexts: Record<SupportedLanguage, { text: string; chips: string[] }> = {
      en: {
        text: `Hello! I am your Sindhu Clinic Voice & Navigation Assistant. You can speak or type in English, Tamil (தமிழ்), Hindi, and more. Try saying "Book an appointment", "What are clinic timings?", or "Show doctor profile" to control the website!`,
        chips: [
          'Book an appointment',
          'Clinic consultation timings?',
          'Who is the consulting doctor?',
          'Show medical services'
        ]
      },
      ta: {
        text: `வணக்கம்! நான் சிந்து கிளினிக் குரல் மற்றும் உதவி வழிகாட்டி. நீங்கள் தமிழிலோ அல்லது ஆங்கிலத்திலோ பேசலாம் அல்லது தட்டச்சு செய்யலாம். "முன்பதிவு செய்", "நேரம் என்ன?", "டாக்டர் விவரம்" அல்லது "சேவைகள் காட்டு" என்று கூறி இணையதளத்தை இயக்கலாம்!`,
        chips: [
          'முன்பதிவு செய்',
          'கிளினிக் நேரம் என்ன?',
          'டாக்டர் யார்?',
          'சேவைகள் காட்டு'
        ]
      },
      hi: {
        text: `नमस्ते! मैं सिंधु क्लीनिक वॉयस और नेविगेशन सहायक हूँ। आप हिंदी, तमिल या अंग्रेजी में बोल या लिख सकते हैं। "अपॉइंटमेंट बुक करो", "क्लीनिक का समय क्या है?" कहकर वेबसाइट को नियंत्रित कर सकते हैं!`,
        chips: [
          'अपॉइंटमेंट बुक करो',
          'क्लीनिक का समय क्या है?',
          'डॉक्टर कौन हैं?',
          'सेवाएं दिखाओ'
        ]
      },
      te: {
        text: `నమస్కారం! నేను సింధు క్లినిక్ వాయిస్ అసిస్టెంట్. "అపాయింట్‌మెంట్ బుక్ చేయండి", "సమయాలు ఏమిటి?", "డాక్టర్ ప్రొఫైల్ చూపించు" అని మాట్లాడవచ్చు!`,
        chips: ['అపాయింట్‌మెంట్ బుక్ చేయండి', 'సమయాలు ఏమిటి?', 'డాక్టర్ ఎవరు?']
      },
      ml: {
        text: `നമസ്കാരം! ഞാൻ സിന്ധു ക്ലിനിക്ക് വോയ്സ് അസിസ്റ്റന്റാണ്. "അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക", "സമയം എത്രയാണ്?", "ഡോക്ടറുടെ വിവരങ്ങൾ" എന്ന് പറയാം!`,
        chips: ['അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക', 'സമയം എത്രയാണ്?', 'ഡോക്ടർ ആരാണ്?']
      },
      kn: {
        text: `ನಮಸ್ಕಾರ! ನಾನು ಸಿಂಧು ಕ್ಲಿನಿಕ್ ವಾಯ್ಸ್ ಅಸಿಸ್ಟೆಂಟ್. "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ", "ಸಮಯ ಏನು?", "ವೈದ್ಯರ ಪ್ರೊಫೈಲ್ ತೋರಿಸಿ" ಎಂದು ಹೇಳಬಹುದು!`,
        chips: ['ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ', 'ಸಮಯ ಏನು?', 'ವೈದ್ಯರು ಯಾರು?']
      }
    };

    const current = welcomeTexts[lang] || welcomeTexts.en;
    return {
      id: `welcome-${lang}-${Date.now()}`,
      sender: 'assistant',
      text: current.text,
      spokenText: current.text,
      timestamp: 'Just now',
      suggestedFollowUps: current.chips
    };
  };

  const [messages, setMessages] = useState<Message[]>([getWelcomeMessage('en')]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSend(transcript);
        }
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Update speech recognition language when selected language changes
  useEffect(() => {
    if (recognitionRef.current) {
      const config = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang);
      recognitionRef.current.lang = config ? config.localeCode : 'en-IN';
    }
  }, [selectedLang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Text to Speech
  const speakText = (text: string, lang: SupportedLanguage) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const config = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    utterance.lang = config ? config.localeCode : 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        const config = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang);
        recognitionRef.current.lang = config ? config.localeCode : 'en-IN';
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error starting speech recognition:', err);
      }
    }
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const responseData = generateMultilingualAnswer(query, selectedLang);

      // Execute website control commands
      if (responseData.actionButton?.route) {
        onNavigate(responseData.actionButton.route);
      } else if (responseData.actionButton?.specialAction === 'scroll-top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (responseData.actionButton?.specialAction === 'call') {
        window.location.href = responseData.actionButton.externalUrl || '';
      } else if (responseData.actionButton?.specialAction === 'whatsapp') {
        const text = responseData.spokenText || responseData.text || 'Inquiry from Patient Assistant';
        sendUniversalWhatsApp({
          phone: '917871558651',
          message: text
        }).catch(console.warn);
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: responseData.text,
        spokenText: responseData.spokenText || responseData.text,
        timestamp: 'Just now',
        commandExecuted: responseData.commandExecuted,
        actionButton: responseData.actionButton,
        suggestedFollowUps: responseData.suggestedFollowUps
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);

      if (autoSpeak && responseData.spokenText) {
        speakText(responseData.spokenText, selectedLang);
      }
    }, 550);
  };

  const handleActionButtonClick = (action: NonNullable<Message['actionButton']>) => {
    if (action.route) {
      onNavigate(action.route);
      onClose();
    } else if (action.externalUrl) {
      window.open(action.externalUrl, '_blank');
    } else if (action.specialAction === 'scroll-top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setSelectedLang(newLang);
    const welcome = getWelcomeMessage(newLang);
    setMessages((prev) => [...prev, welcome]);
    if (autoSpeak && welcome.spokenText) speakText(welcome.spokenText, newLang);
  };

  const handleReset = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setMessages([getWelcomeMessage(selectedLang)]);
  };

  if (!isOpen) return null;

  const currentLangConfig = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  return (
    /*
     * KEY FIX: Use fixed positioning anchored to top+bottom+right so the panel
     * never overflows the viewport and never scrolls to bottom of page.
     * On mobile: 4px from each edge. On sm+: right-aligned 440px wide panel.
     */
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sindhu Clinic Assistant"
      className="assistant-widget font-sans"
      style={{
        position: 'fixed',
        /* Mobile: take full width minus 8px margins, anchored top+bottom */
        top: '56px',          /* clear the header */
        bottom: '72px',       /* clear mobile sticky bar */
        left: '4px',
        right: '4px',
        /* Desktop: pin to bottom-right, fixed height */
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        /* Glass background */
        background: 'linear-gradient(145deg, rgba(248,252,255,0.98) 0%, rgba(235,248,255,0.97) 50%, rgba(230,252,248,0.98) 100%)',
        boxShadow: '0 0 0 1px rgba(99,179,237,0.35), 0 32px 80px -10px rgba(15,40,80,0.38), 0 8px 24px rgba(15,40,80,0.18), inset 0 1px 0 rgba(255,255,255,1)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(147,197,253,0.50)',
        animation: 'fadeInUp 0.28s cubic-bezier(0.22,1,0.36,1) both',
      }}
    >
      {/* ── Decorative background orbs (portfolio-style, visible through glass) ── */}
      <div aria-hidden="true" style={{ position:'absolute', inset:0, overflow:'hidden', borderRadius:'1.5rem', zIndex:0, pointerEvents:'none' }}>
        {/* Teal top-left blob */}
        <div className="animate-blob" style={{
          position:'absolute', top:'-40px', left:'-30px', width:'180px', height:'180px',
          background:'radial-gradient(circle, rgba(20,184,166,0.22) 0%, rgba(56,189,248,0.12) 50%, transparent 75%)',
          filter:'blur(30px)'
        }} />
        {/* Blue top-right orb */}
        <div className="animate-float-delayed" style={{
          position:'absolute', top:'-20px', right:'-10px', width:'140px', height:'140px',
          background:'radial-gradient(circle, rgba(59,130,246,0.20) 0%, transparent 70%)',
          filter:'blur(28px)'
        }} />
        {/* Indigo bottom-left */}
        <div className="animate-blob-reverse" style={{
          position:'absolute', bottom:'80px', left:'-20px', width:'160px', height:'160px',
          background:'radial-gradient(circle, rgba(99,102,241,0.16) 0%, transparent 70%)',
          filter:'blur(32px)'
        }} />
        {/* Purple bottom-right */}
        <div className="animate-float-reverse" style={{
          position:'absolute', bottom:'-20px', right:'-10px', width:'200px', height:'200px',
          background:'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          filter:'blur(35px)'
        }} />
        {/* Center subtle grid */}
        <div style={{
          position:'absolute', inset:0, opacity:0.25,
          backgroundImage:'repeating-linear-gradient(0deg, rgba(99,179,237,0.06) 0, rgba(99,179,237,0.06) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, rgba(99,179,237,0.06) 0, rgba(99,179,237,0.06) 1px, transparent 1px, transparent 40px)'
        }} />
      </div>

      {/* ── Header ── */}
      <div className="relative z-10" style={{
        background:'linear-gradient(135deg, #0f2850 0%, #1e3a8a 45%, #0d9488 100%)',
        padding:'12px 14px',
        display:'flex', flexDirection:'column', gap:'8px',
        borderBottom:'1px solid rgba(255,255,255,0.12)',
        flexShrink:0,
      }}>
        {/* Top row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            {/* Animated bot avatar */}
            <div style={{
              width:'36px', height:'36px', borderRadius:'10px',
              background:'rgba(255,255,255,0.12)', backdropFilter:'blur(10px)',
              border:'1px solid rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center',
              position:'relative', flexShrink:0
            }}>
              <Bot className="w-5 h-5 text-teal-300" />
              {/* Live pulsing dot */}
              <span style={{
                position:'absolute', top:'-3px', right:'-3px',
                width:'10px', height:'10px', borderRadius:'50%',
                background:'#34d399', border:'2px solid #1e3a8a',
              }} className="animate-pulse" />
            </div>
            <div>
              <h3 style={{ fontWeight:800, fontSize:'13px', color:'white', margin:0, display:'flex', alignItems:'center', gap:'6px' }}>
                Sindhu Clinic AI Assistant
              </h3>
              <p style={{ fontSize:'10px', color:'rgba(153,246,228,0.85)', margin:0 }}>
                Multilingual Voice · Web Control
              </p>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
            {/* Auto-speak toggle */}
            <button
              onClick={() => {
                if (isSpeaking && 'speechSynthesis' in window) { window.speechSynthesis.cancel(); setIsSpeaking(false); }
                setAutoSpeak(!autoSpeak);
              }}
              title={autoSpeak ? 'Disable Voice Playback' : 'Enable Voice Playback'}
              style={{
                padding:'6px', borderRadius:'8px', border:'none', cursor:'pointer',
                background: autoSpeak ? 'rgba(13,148,136,0.5)' : 'transparent',
                color: autoSpeak ? '#99f6e4' : 'rgba(148,163,184,0.8)',
                transition:'all 0.2s'
              }}
            >
              {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            {/* Reset */}
            <button onClick={handleReset} title="Reset conversation"
              style={{ padding:'6px', borderRadius:'8px', border:'none', cursor:'pointer', background:'transparent', color:'rgba(148,163,184,0.8)', transition:'all 0.2s' }}>
              <RotateCcw className="w-4 h-4" />
            </button>
            {/* Close */}
            <button
              onClick={() => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); onClose(); }}
              aria-label="Close Assistant"
              style={{ padding:'6px', borderRadius:'8px', border:'none', cursor:'pointer', background:'rgba(255,255,255,0.10)', color:'white', transition:'all 0.2s' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Language selector bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'8px', borderTop:'1px solid rgba(255,255,255,0.12)' }}>
          <span style={{ display:'flex', alignItems:'center', gap:'4px', color:'rgba(148,163,184,0.8)', fontSize:'10px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>
            <Globe className="w-3 h-3" style={{ color:'#5eead4' }} />
            Lang:
          </span>
          <div style={{ display:'flex', alignItems:'center', gap:'4px', overflowX:'auto', padding:'2px 0' }}>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                style={{
                  padding:'2px 8px', borderRadius:'6px', fontSize:'10px', fontWeight:700,
                  border:'none', cursor:'pointer', whiteSpace:'nowrap',
                  background: selectedLang === lang.code ? '#0d9488' : 'rgba(255,255,255,0.10)',
                  color: selectedLang === lang.code ? 'white' : 'rgba(203,213,225,0.85)',
                  boxShadow: selectedLang === lang.code ? '0 0 0 1px rgba(255,255,255,0.2)' : 'none',
                  transition:'all 0.2s'
                }}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Listening banner ── */}
      {isListening && (
        <div style={{
          background:'linear-gradient(90deg, #0d9488, #1e3a8a)',
          color:'white', padding:'8px 16px',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          fontSize:'12px', flexShrink:0, position:'relative', zIndex:10
        }} className="animate-pulse">
          <div style={{ display:'flex', alignItems:'center', gap:'8px', fontWeight:700 }}>
            <span style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#f87171', flexShrink:0 }} className="animate-ping" />
            Listening in {currentLangConfig.nativeName}... Speak now
          </div>
          <button onClick={toggleListening} style={{ fontSize:'11px', fontWeight:600, color:'#99f6e4', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>
            Stop
          </button>
        </div>
      )}

      {/* ── Chat messages body ── */}
      <div className="relative z-10" style={{
        flex:1, overflowY:'auto', padding:'14px', display:'flex', flexDirection:'column', gap:'12px',
        background:'rgba(248,252,255,0.55)'
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display:'flex', gap:'8px', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.sender === 'assistant' && (
              <div style={{
                width:'28px', height:'28px', borderRadius:'9px',
                background:'linear-gradient(135deg, #1e3a8a, #0d9488)',
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'2px'
              }}>
                <Bot className="w-4 h-4" style={{ color:'#5eead4' }} />
              </div>
            )}

            <div style={{
              maxWidth:'84%', borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              padding:'11px 14px', fontSize:'12px', lineHeight:'1.6',
              ...(msg.sender === 'user' ? {
                background:'linear-gradient(135deg, #1e3a8a, #0d9488)',
                color:'white',
                boxShadow:'0 4px 16px -2px rgba(30,64,175,0.35)',
              } : {
                background:'rgba(255,255,255,0.92)',
                color:'#1e293b',
                border:'1px solid rgba(147,197,253,0.40)',
                boxShadow:'0 4px 20px -4px rgba(30,64,175,0.14), inset 0 1px 0 rgba(255,255,255,0.9)',
                backdropFilter:'blur(12px)',
              })
            }}>
              {/* Speaker row for assistant messages */}
              {msg.sender === 'assistant' && msg.spokenText && (
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(99,179,237,0.20)', paddingBottom:'6px', marginBottom:'6px', fontSize:'10px' }}>
                  <span style={{ display:'flex', alignItems:'center', gap:'4px', fontWeight:700, color:'#0d9488' }}>
                    <Compass className="w-3 h-3" />
                    Sindhu AI ({currentLangConfig.name})
                  </span>
                  <button onClick={() => speakText(msg.spokenText!, selectedLang)}
                    style={{ display:'flex', alignItems:'center', gap:'3px', color:'#6b7280', background:'none', border:'none', cursor:'pointer', fontSize:'10px' }}>
                    <Volume2 className="w-3 h-3" style={{ color:'#0d9488' }} />
                    Listen
                  </button>
                </div>
              )}

              {/* Command executed chip */}
              {msg.commandExecuted && (
                <div style={{
                  marginBottom:'8px', padding:'5px 10px', borderRadius:'8px',
                  background:'rgba(13,148,136,0.10)', border:'1px solid rgba(13,148,136,0.30)',
                  color:'#0f766e', fontSize:'11px', fontWeight:700, display:'flex', alignItems:'center', gap:'5px'
                }}>
                  <Sparkles className="w-3.5 h-3.5" style={{ color:'#0d9488' }} />
                  Control: {msg.commandExecuted}
                </div>
              )}

              <p style={{ margin:0, whiteSpace:'pre-wrap' }}>{msg.text}</p>

              {/* Action button */}
              {msg.actionButton && (
                <div style={{ marginTop:'10px', paddingTop:'8px', borderTop:'1px solid rgba(99,179,237,0.20)' }}>
                  <button
                    onClick={() => handleActionButtonClick(msg.actionButton!)}
                    style={{
                      width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
                      padding:'8px 12px', borderRadius:'10px', border:'1px solid rgba(30,64,175,0.25)',
                      background:'linear-gradient(135deg, rgba(30,64,175,0.08), rgba(13,148,136,0.06))',
                      color:'#1e3a8a', fontWeight:700, fontSize:'12px', cursor:'pointer', transition:'all 0.2s'
                    }}
                  >
                    <span>{msg.actionButton.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" style={{ color:'#0d9488' }} />
                  </button>
                </div>
              )}

              {/* Follow-up chips */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div style={{ marginTop:'10px', paddingTop:'8px', borderTop:'1px solid rgba(99,179,237,0.20)', display:'flex', flexDirection:'column', gap:'5px' }}>
                  <span style={{ fontSize:'10px', fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                    Quick Commands:
                  </span>
                  {msg.suggestedFollowUps.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(chip)}
                      style={{
                        textAlign:'left', fontSize:'11px', padding:'6px 10px', borderRadius:'8px',
                        background:'rgba(241,245,249,0.80)', border:'1px solid rgba(147,197,253,0.35)',
                        color:'#334155', cursor:'pointer', transition:'all 0.2s', fontWeight:500,
                        display:'flex', alignItems:'center', justifyContent:'space-between'
                      }}
                    >
                      <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{chip}</span>
                      <ChevronRight className="w-3 h-3" style={{ color:'#94a3b8', flexShrink:0 }} />
                    </button>
                  ))}
                </div>
              )}

              <span style={{ display:'block', fontSize:'9px', marginTop:'4px', textAlign:'right', color: msg.sender === 'user' ? 'rgba(255,255,255,0.55)' : '#94a3b8' }}>
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div style={{
                width:'28px', height:'28px', borderRadius:'9px',
                background:'linear-gradient(135deg, #0d9488, #14b8a6)',
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'2px'
              }}>
                <User className="w-4 h-4" style={{ color:'white' }} />
              </div>
            )}
          </div>
        ))}

        {/* Typing animation */}
        {isTyping && (
          <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
            <div style={{
              width:'28px', height:'28px', borderRadius:'9px',
              background:'linear-gradient(135deg, #1e3a8a, #0d9488)',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0
            }}>
              <Bot className="w-4 h-4" style={{ color:'#5eead4' }} />
            </div>
            <div style={{
              background:'rgba(255,255,255,0.90)', border:'1px solid rgba(147,197,253,0.40)',
              borderRadius:'18px 18px 18px 4px', padding:'10px 14px', display:'flex', gap:'5px', alignItems:'center'
            }}>
              {[0, 0.2, 0.4].map((delay, i) => (
                <span key={i} className="animate-bounce" style={{
                  width:'7px', height:'7px', borderRadius:'50%',
                  background:'linear-gradient(135deg, #1e3a8a, #0d9488)',
                  animationDelay:`${delay}s`
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Voice hint bar ── */}
      <div className="relative z-10" style={{
        padding:'6px 12px', fontSize:'10px', color:'#1e3a8a',
        background:'rgba(239,246,255,0.85)', borderTop:'1px solid rgba(147,197,253,0.35)',
        display:'flex', alignItems:'center', gap:'5px', flexShrink:0
      }}>
        <Mic className="w-3 h-3" style={{ color:'#0d9488', flexShrink:0 }} />
        <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontWeight:500 }}>
          {selectedLang === 'ta'
            ? 'குரல் கட்டளை: "முன்பதிவு செய்", "டாக்டர் காட்டு", "நேரம் என்ன?"'
            : 'Voice Control: "Book appointment" · "Show doctor" · "Clinic timings"'}
        </span>
      </div>

      {/* ── Input form ── */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="relative z-10"
        style={{
          padding:'10px 12px', background:'rgba(255,255,255,0.95)',
          borderTop:'1px solid rgba(147,197,253,0.35)', display:'flex', alignItems:'center', gap:'8px', flexShrink:0
        }}
      >
        {/* Microphone button with ring animation */}
        <div style={{ position:'relative', flexShrink:0 }}>
          {/* Soft orb backdrop (always visible) */}
          <div style={{
            position:'absolute', inset:0, borderRadius:'10px',
            background:'radial-gradient(circle, rgba(20,184,166,0.25) 0%, transparent 75%)',
            transform:'scale(2)', filter:'blur(6px)',
            opacity: isListening ? 0 : 1, transition:'opacity 0.4s'
          }} />
          {/* Pulsing rings when listening */}
          {isListening && (
            <>
              <span className="mic-ring-1" style={{ position:'absolute', inset:0, borderRadius:'10px', background:'rgba(239,68,68,0.45)' }} />
              <span className="mic-ring-2" style={{ position:'absolute', inset:0, borderRadius:'10px', background:'rgba(239,68,68,0.30)' }} />
              <span className="mic-ring-3" style={{ position:'absolute', inset:0, borderRadius:'10px', background:'rgba(239,68,68,0.18)' }} />
            </>
          )}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? 'Stop Listening' : `Speak in ${currentLangConfig.nativeName}`}
            style={{
              position:'relative', padding:'9px', borderRadius:'10px',
              border:'none', cursor:'pointer', transition:'all 0.3s',
              background: isListening
                ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                : 'linear-gradient(135deg, rgba(13,148,136,0.12), rgba(20,184,166,0.08))',
              color: isListening ? 'white' : '#0d9488',
              boxShadow: isListening ? '0 4px 16px rgba(239,68,68,0.50)' : '0 2px 8px rgba(13,148,136,0.20)',
              transform: isListening ? 'scale(1.12)' : 'scale(1)',
              outline:'1px solid',
              outlineColor: isListening ? 'rgba(239,68,68,0.40)' : 'rgba(20,184,166,0.30)',
            }}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        {/* Text input */}
        <input
          type="text"
          placeholder={
            selectedLang === 'ta'
              ? 'கேட்க அல்லது கட்டுப்படுத்த பேசவும் / தட்டச்சு செய்யவும்...'
              : `Ask or voice control in ${currentLangConfig.name}...`
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            flex:1, padding:'8px 14px', borderRadius:'10px', fontSize:'12px',
            border:'1px solid rgba(147,197,253,0.45)',
            background:'rgba(248,252,255,0.90)',
            color:'#1e293b', outline:'none',
            boxShadow:'inset 0 1px 4px rgba(30,64,175,0.06)'
          }}
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          aria-label="Send message"
          style={{
            padding:'9px', borderRadius:'10px', border:'none', cursor:'pointer',
            background:'linear-gradient(135deg, #1e3a8a, #0d9488)',
            color:'white', transition:'all 0.2s', flexShrink:0,
            boxShadow:'0 4px 14px rgba(30,64,175,0.35)',
            opacity: (!inputText.trim() || isTyping) ? 0.45 : 1,
          }}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
