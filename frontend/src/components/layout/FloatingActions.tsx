import React, { useState, useEffect } from 'react';
import { Phone, ArrowUp, Bot, Activity } from 'lucide-react';
import { CLINIC_CONFIG } from '../../config/clinicData';
import { sendUniversalWhatsApp } from '../../utils/whatsappUtils';

interface FloatingActionsProps {
  onOpenAssistant: () => void;
  isAssistantOpen: boolean;
  onOpenCalculators?: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onOpenAssistant,
  isAssistantOpen,
  onOpenCalculators
}) => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 280);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="fixed z-40 flex flex-col items-end gap-2 pointer-events-none transition-all duration-300"
      style={{
        bottom: isDesktop ? '20px' : '72px',
        right: isDesktop ? '18px' : '12px',
      }}
    >
      {/* Ambient glow cluster */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="animate-pulse-glow absolute bottom-0 right-0 w-44 h-44 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.16) 0%, transparent 70%)', transform: 'translate(20%, 20%)', filter: 'blur(24px)' }}
        />
        <div
          className="animate-float-delayed absolute bottom-0 right-0 w-36 h-36 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(30,64,175,0.14) 0%, transparent 70%)', transform: 'translate(10%, -40%)', filter: 'blur(20px)' }}
        />
      </div>

      {/* ── 1. Back To Top ── */}
      {showBackToTop && (
        <div className="relative pointer-events-auto">
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="p-2.5 rounded-full bg-white/95 backdrop-blur-md text-slate-700 shadow-[0_8px_20px_rgba(15,40,80,0.18)] border border-slate-200/90 hover:bg-slate-50 hover:text-[#0f2850] transition-all transform hover:-translate-y-1 active:scale-95 focus:outline-none flex items-center justify-center"
            title="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      )}

      {/* ── 1.5. Health Calculators Tool ── */}
      {onOpenCalculators && (
        <div className="relative pointer-events-auto">
          <button
            onClick={onOpenCalculators}
            aria-label="Open Health Calculators"
            className="p-2.5 rounded-full bg-slate-900/90 backdrop-blur-md text-teal-300 shadow-[0_8px_20px_rgba(15,40,80,0.22)] border border-teal-400/40 hover:bg-slate-800 hover:text-white transition-all transform hover:-translate-y-1 active:scale-95 focus:outline-none flex items-center justify-center group"
            title="Clinical Health Calculators (BMI, Diabetes, Blood Pressure)"
          >
            <Activity className="w-4 h-4 text-teal-300 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )}

      {/* ── 2. AI Assistant ── */}
      {!isAssistantOpen && (
        <div className="relative pointer-events-auto">
          <div
            className="absolute inset-0 rounded-full animate-pulse-glow"
            style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.35) 0%, rgba(30,64,175,0.22) 60%, transparent 100%)', transform: 'scale(2.2)', filter: 'blur(10px)' }}
          />
          <span className="absolute inset-0 rounded-full bg-teal-400/25 animate-ping pointer-events-none" style={{ animationDuration: '2.5s' }} />

          <button
            onClick={onOpenAssistant}
            aria-label="Open Sindhu Clinic AI Assistant"
            className="relative group flex items-center gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-white font-bold text-xs tracking-wide transition-all duration-300 transform hover:-translate-y-1 active:scale-95 border border-white/30 shadow-[0_10px_28px_-4px_rgba(15,40,80,0.45),0_2px_8px_rgba(15,40,80,0.2)]"
            style={{ background: 'linear-gradient(135deg, #07172c 0%, #0f2850 40%, #0d9488 100%)' }}
          >
            <div className="relative flex-shrink-0">
              <Bot className="w-4 h-4 text-teal-300 group-hover:rotate-12 transition-transform duration-300" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full" />
            </div>
            <div className="text-left hidden xs:block">
              <span className="block text-[11px] font-extrabold leading-tight tracking-tight">AI Assistant</span>
              <span className="block text-[9px] font-medium text-teal-200/90 leading-tight">Ask &amp; Navigate</span>
            </div>
            <span className="xs:hidden text-[11px] font-bold">Ask AI</span>
          </button>
        </div>
      )}

      {/* ── 3. WhatsApp Chat Widget ── */}
      <WhatsAppChatWidget isDesktop={isDesktop} />

      {/* ── 4. Call Reception ── */}
      <div className="relative pointer-events-auto">
        <div
          className="absolute inset-0 rounded-full animate-float-reverse"
          style={{ background: 'radial-gradient(circle, rgba(30,64,175,0.32) 0%, transparent 70%)', transform: 'scale(2.0)', filter: 'blur(8px)' }}
        />
        <a
          href={CLINIC_CONFIG.phoneCallValue}
          aria-label="Call Sindhu Clinic Reception"
          className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-white font-bold text-xs tracking-wide active:scale-95 border border-white/20 transition-all transform hover:-translate-y-1 shadow-[0_8px_22px_-4px_rgba(30,64,175,0.42)]"
          style={{ background: 'linear-gradient(135deg, #07172c 0%, #1e3a8a 60%, #1d4ed8 100%)' }}
        >
          <Phone className="w-4 h-4 text-teal-300" />
          <span className="hidden xs:inline">Call Clinic</span>
        </a>
      </div>
    </div>
  );
};

/* ============================================================
   WhatsApp In-Page Chat Widget
   Clicking the green button opens a popup styled like WhatsApp Web.
   The user types a message → Send opens wa.me pre-filled in a new tab.
   This is the industry standard — WhatsApp blocks true iframe embedding.
   ============================================================ */

const WhatsAppChatWidget: React.FC<{ isDesktop: boolean }> = ({ isDesktop }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  // Extract raw phone number from config URL
  const phoneNumber = CLINIC_CONFIG.whatsappUrl.replace('https://wa.me/', '').split('?')[0];

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const handleSend = async () => {
    const text = message.trim() || 'Hello! I would like to inquire about a consultation at Sindhu Clinic.';
    try {
      await sendUniversalWhatsApp({
        phone: phoneNumber,
        message: text
      });
    } catch (err) {
      console.warn('Direct floating WhatsApp dispatch error:', err);
    }
    setSent(true);
    setTimeout(() => {
      setIsOpen(false);
      setMessage('');
      setSent(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // WhatsApp logo SVG path (reused)
  const waLogoPath = "M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.472 2.027 7.776L0 32l8.522-2.236A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.258 22.292c-.344.967-1.998 1.845-2.74 1.963-.698.111-1.58.158-2.548-.16a23.3 23.3 0 0 1-2.307-.855c-4.063-1.754-6.713-5.84-6.916-6.113-.2-.27-1.632-2.17-1.632-4.14 0-1.97 1.033-2.942 1.4-3.343.366-.4.8-.5 1.066-.5.267 0 .534.003.768.014.247.012.578-.094.905.69.344.817 1.166 2.787 1.268 2.99.1.2.167.433.033.7-.133.267-.2.433-.4.667-.2.233-.42.52-.6.7-.2.2-.408.416-.176.817.234.4 1.04 1.716 2.233 2.78 1.533 1.366 2.82 1.79 3.22 1.99.4.2.634.167.867-.1.234-.267 1-1.167 1.267-1.567.267-.4.534-.333.9-.2.367.133 2.333 1.1 2.733 1.3.4.2.667.3.767.467.1.166.1.966-.244 1.9z";

  return (
    <div className="relative pointer-events-auto" style={{ zIndex: 50 }}>

      {/* Glow behind button */}
      <div
        className="absolute inset-0 rounded-full animate-float"
        style={{ background: 'radial-gradient(circle, rgba(37,211,102,0.32) 0%, transparent 70%)', transform: 'scale(2.0)', filter: 'blur(8px)' }}
      />

      {/* WhatsApp Toggle Button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        aria-label="Open WhatsApp Chat"
        className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-white font-bold text-xs tracking-wide active:scale-95 border border-white/25 transition-all transform hover:-translate-y-1 shadow-[0_8px_22px_-4px_rgba(37,211,102,0.45)]"
        style={{ background: 'linear-gradient(135deg, #128c3e 0%, #25D366 60%, #20ba59 100%)' }}
      >
        <svg viewBox="0 0 32 32" style={{ width: '16px', height: '16px', fill: 'white', flexShrink: 0 }}>
          <path d={waLogoPath} />
        </svg>
        <span className="hidden xs:inline">WhatsApp</span>

        {/* Notification badge */}
        {!isOpen && (
          <span
            className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center"
            style={{ fontSize: '7px', fontWeight: 900, color: 'white', lineHeight: 1 }}
          >
            1
          </span>
        )}
      </button>

      {/* ══════════════════════════════════════════
          Chat Dialog (WhatsApp Web style popup)
          ══════════════════════════════════════════ */}
      {isOpen && (
        <>
          {/* Slide-up animation keyframe */}
          <style>{`
            @keyframes wa-slide-up {
              from { opacity: 0; transform: translateY(16px) scale(0.95); }
              to   { opacity: 1; transform: translateY(0)    scale(1);    }
            }
          `}</style>

          <div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 12px)',
              right: 0,
              width: isDesktop ? '322px' : '288px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 24px 64px -8px rgba(0,0,0,0.40), 0 4px 18px rgba(0,0,0,0.18)',
              animation: 'wa-slide-up 0.22s ease-out',
              zIndex: 100,
            }}
          >

            {/* ── HEADER ─────────────────────────── */}
            <div
              style={{
                background: 'linear-gradient(135deg, #075e54 0%, #128c3e 100%)',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '11px',
              }}
            >
              {/* Clinic avatar */}
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                background: 'rgba(255,255,255,0.18)',
                border: '2px solid rgba(255,255,255,0.38)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg viewBox="0 0 32 32" style={{ width: '24px', height: '24px', fill: 'white' }}>
                  <path d={waLogoPath} />
                </svg>
              </div>

              {/* Name + status */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#fff', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {CLINIC_CONFIG.name}
                </p>
                <p style={{ margin: '3px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.82)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', display: 'inline-block', flexShrink: 0 }} />
                  Online · Typically replies instantly
                </p>
              </div>

              {/* Close ✕ */}
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                style={{
                  background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer',
                  width: '28px', height: '28px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  color: 'white', transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.28)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
              >
                <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', fill: 'none', stroke: 'white', strokeWidth: 2.5, strokeLinecap: 'round' }}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* ── CHAT BODY (wallpaper) ───────────── */}
            <div
              style={{
                background: '#e5ddd5',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23b2b2b2' fill-opacity='0.12'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
                padding: '14px 10px 10px',
                minHeight: '128px',
              }}
            >
              {/* Clinic greeting bubble (received / left) */}
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '6px' }}>
                <div style={{
                  background: 'white',
                  borderRadius: '0 12px 12px 12px',
                  padding: '10px 12px 5px',
                  maxWidth: '87%',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.13)',
                }}>
                  <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#075e54', fontWeight: 700 }}>
                    {CLINIC_CONFIG.name}
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#111', lineHeight: 1.45 }}>
                    Hello! How can we help you? Type your message below and we'll connect with you directly on WhatsApp.
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px', marginTop: '5px' }}>
                    <span style={{ fontSize: '10px', color: '#999' }}>{timeStr}</span>
                    {/* Blue double tick */}
                    <svg viewBox="0 0 16 11" style={{ width: '16px', height: '11px', fill: '#53bdeb' }}>
                      <path d="M11.071.653a.5.5 0 0 0-.707.04L4.576 7.52 2.121 5.066a.5.5 0 0 0-.707 0l-.707.707a.5.5 0 0 0 0 .707l3.536 3.536a.5.5 0 0 0 .735-.028l6.435-7.628a.5.5 0 0 0-.04-.707l-.302-.3z"/>
                      <path d="M15.071.653a.5.5 0 0 0-.707.04L8.576 7.52 7.414 6.358a.5.5 0 0 0-.707.707l1.869 1.87a.5.5 0 0 0 .735-.028l6.435-7.628a.5.5 0 0 0-.04-.707l-.302-.3z" opacity=".6"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* User's sent bubble (sent / right) — appears after sending */}
              {sent && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <div style={{
                    background: '#dcf8c6',
                    borderRadius: '12px 0 12px 12px',
                    padding: '9px 12px 5px',
                    maxWidth: '87%',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.13)',
                  }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#111', lineHeight: 1.45 }}>
                      {message.trim() || 'Hello! I would like to inquire about a consultation.'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '3px', marginTop: '5px' }}>
                      <span style={{ fontSize: '10px', color: '#999' }}>{timeStr}</span>
                      <svg viewBox="0 0 16 11" style={{ width: '16px', height: '11px', fill: '#53bdeb' }}>
                        <path d="M11.071.653a.5.5 0 0 0-.707.04L4.576 7.52 2.121 5.066a.5.5 0 0 0-.707 0l-.707.707a.5.5 0 0 0 0 .707l3.536 3.536a.5.5 0 0 0 .735-.028l6.435-7.628a.5.5 0 0 0-.04-.707l-.302-.3z"/>
                        <path d="M15.071.653a.5.5 0 0 0-.707.04L8.576 7.52 7.414 6.358a.5.5 0 0 0-.707.707l1.869 1.87a.5.5 0 0 0 .735-.028l6.435-7.628a.5.5 0 0 0-.04-.707l-.302-.3z" opacity=".6"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── INPUT FOOTER ────────────────────── */}
            <div style={{
              background: '#f0f2f5',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px',
              borderTop: '1px solid rgba(0,0,0,0.07)',
            }}>
              <textarea
                rows={1}
                placeholder="Type a message…"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sent}
                autoFocus
                style={{
                  flex: 1, resize: 'none', border: 'none', outline: 'none',
                  borderRadius: '20px', padding: '9px 14px',
                  fontSize: '13px', lineHeight: 1.45,
                  background: 'white', color: '#111',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                  maxHeight: '80px', overflowY: 'auto',
                  fontFamily: 'inherit',
                }}
              />
              <button
                onClick={handleSend}
                disabled={sent}
                aria-label="Send message"
                style={{
                  width: '40px', height: '40px', borderRadius: '50%', border: 'none',
                  cursor: sent ? 'default' : 'pointer',
                  background: sent ? '#9ca3af' : 'linear-gradient(135deg, #075e54, #25D366)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'background 0.2s',
                  boxShadow: sent ? 'none' : '0 3px 10px rgba(37,211,102,0.45)',
                }}
              >
                {sent ? (
                  /* Checkmark */
                  <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'none', stroke: 'white', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  /* Send arrow */
                  <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'white' }}>
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Encryption note */}
            <div style={{ background: '#f0f2f5', padding: '3px 12px 8px', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', color: '#8696a0' }}>End-to-end encrypted · Powered by WhatsApp</span>
            </div>

          </div>

          {/* Transparent backdrop — click outside to close */}
          <div
            onClick={() => setIsOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 49 }}
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
};
