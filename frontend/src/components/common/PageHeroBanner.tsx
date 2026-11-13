import React from 'react';

interface PageHeroBannerProps {
  /** Small pill badge text above the title */
  badge?: string;
  /** Optional icon in the badge */
  badgeIcon?: React.ReactNode;
  /** Large page title */
  title: string;
  /** Highlighted / colored part of title (renders in teal) */
  titleAccent?: string;
  /** Subtitle / description */
  subtitle?: string;
  /** SVG icon node — used as background watermark AND floating icon */
  icon?: React.ReactNode;
  /** Extra right-side decoration slot */
  rightDecoration?: React.ReactNode;
  /** Real-world background photograph URL */
  bgImageUrl?: string;
  className?: string;
}

/**
 * PageHeroBanner — Professional full-width inner-page hero banner
 * Features:
 *  - Real-world medical photo backdrop behind words & lines
 *  - Deep medical-blue → teal gradient background
 *  - Hex/dot grid pattern overlay
 *  - Large translucent watermark icon
 *  - Animated floating medical cross (top-right)
 *  - Decorative ECG wave (bottom edge)
 *  - Animated ambient orbs
 */
export const PageHeroBanner: React.FC<PageHeroBannerProps> = ({
  badge,
  badgeIcon,
  title,
  titleAccent,
  subtitle,
  icon,
  rightDecoration,
  bgImageUrl,
  className = '',
}) => {
  return (
    <section
      className={`relative overflow-hidden ${className}`}
      style={{
        background: '#041628',
        minHeight: '240px',
      }}
    >
      {/* ── Real-world Clinical Background Image — Vivid, Clear, Authentic ── */}
      <img
        src={bgImageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1600'}
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none transition-transform duration-1000"
      />
      {/* ── Cinematic Scrim: deep high-contrast multi-stop scrim for 100% text readability ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/98 via-slate-950/90 to-brand-950/85 pointer-events-none" />

      {/* ── Canva Delicately Inset White Border Frame ── */}
      <div className="canva-hero-frame" />

      {/* ── Dot-grid background pattern ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Ambient gradient orbs ── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full animate-pulse-glow"
          style={{
            width: '320px', height: '320px',
            top: '-80px', right: '-60px',
            background: 'radial-gradient(circle, rgba(20,184,166,0.22) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '240px', height: '240px',
            bottom: '-60px', left: '10%',
            background: 'radial-gradient(circle, rgba(30,64,175,0.28) 0%, transparent 70%)',
            filter: 'blur(32px)',
          }}
        />
      </div>

      {/* ── Animated floating medical cross (top-right) ── */}
      <div
        aria-hidden="true"
        className="absolute top-4 right-4 sm:top-6 sm:right-8 pointer-events-none animate-float"
        style={{ opacity: 0.18 }}
      >
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '48px', height: '48px' }}>
          <rect x="18" y="4" width="12" height="40" rx="6" fill="white" />
          <rect x="4" y="18" width="40" height="12" rx="6" fill="white" />
        </svg>
      </div>

      {/* ── Large watermark icon (center-right background) ── */}
      {icon && (
        <div
          aria-hidden="true"
          className="absolute right-8 sm:right-16 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ opacity: 0.06, color: 'white' }}
        >
          <div style={{ transform: 'scale(5)', transformOrigin: 'center' }}>
            {icon}
          </div>
        </div>
      )}

      {/* ── Right decoration slot (optional custom SVG/element) ── */}
      {rightDecoration && (
        <div
          className="absolute right-6 sm:right-14 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block"
          style={{ opacity: 0.22 }}
        >
          {rightDecoration}
        </div>
      )}

      {/* ── ECG wave decoration (bottom edge) ── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ opacity: 0.12 }}
      >
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ width: '100%', height: '40px' }}>
          <polyline
            points="0,20 120,20 150,4 180,36 210,4 240,36 270,20 400,20 430,8 460,32 490,8 520,32 550,20 700,20 720,4 750,20 1200,20"
            stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-3xl space-y-4">

          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-teal-400/40 backdrop-blur-md text-xs font-bold text-teal-200 shadow-md">
              {badgeIcon ? badgeIcon : <span className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse" />}
              <span className="uppercase tracking-widest">{badge}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
            {title}
            {titleAccent && (
              <>
                {' '}
                <span className="text-teal-300 drop-shadow-md">{titleAccent}</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-sm sm:text-base text-white font-medium leading-relaxed max-w-xl drop-shadow-md">
              {subtitle}
            </p>
          )}

          {/* Decorative bottom rule */}
          <div className="flex items-center gap-3 pt-1">
            <div className="h-0.5 w-12 bg-teal-400 rounded-full" />
            <div className="h-0.5 w-6 bg-teal-400/50 rounded-full" />
            <div className="h-0.5 w-3 bg-teal-400/25 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};
