import React from 'react';

/**
 * Modern UI/UX Vector Illustrations in clean SVG style
 * Featuring modern gradients (deep medical blue, teal, purple/violet accent)
 * and approachable vector workspace & consultation scenes.
 */

export const ConsultationIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => (
  <svg
    viewBox="0 0 600 450"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="bgGlow" x1="0" y1="0" x2="600" y2="450" gradientUnits="userSpaceOnUse">
        <stop stopColor="#e0f2fe" stopOpacity="0.8" />
        <stop offset="0.5" stopColor="#f3e8ff" stopOpacity="0.6" />
        <stop offset="1" stopColor="#ccfbf1" stopOpacity="0.7" />
      </linearGradient>
      <linearGradient id="deskGrad" x1="50" y1="320" x2="550" y2="340" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0b3b60" />
        <stop offset="1" stopColor="#1e293b" />
      </linearGradient>
      <linearGradient id="screenGrad" x1="220" y1="180" x2="380" y2="300" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="1" stopColor="#6366f1" />
      </linearGradient>
      <linearGradient id="tealGrad" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#14b8a6" />
        <stop offset="1" stopColor="#0d9488" />
      </linearGradient>
      <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#a855f7" />
        <stop offset="1" stopColor="#7c3aed" />
      </linearGradient>
      <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#0b3b60" floodOpacity="0.12" />
      </filter>
    </defs>

    {/* Background Soft Blob */}
    <rect x="20" y="20" width="560" height="410" rx="36" fill="url(#bgGlow)" />
    
    {/* Floating Decorative Elements (UI/UX landing style) */}
    {/* Heart Vital Floating Badge */}
    <g className="animate-float" filter="url(#softShadow)">
      <rect x="60" y="70" width="130" height="48" rx="14" fill="#ffffff" />
      <circle cx="84" cy="94" r="14" fill="#ecfdf5" />
      <path d="M78 94h3l2-4 3 8 3-6 2 2h3" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="106" y="91" fill="#0f172a" fontSize="11" fontWeight="700" fontFamily="sans-serif">Normal Vitals</text>
      <text x="106" y="105" fill="#64748b" fontSize="9" fontWeight="500" fontFamily="sans-serif">98.6°F • 72 bpm</text>
    </g>

    {/* Rating / Trust Floating Badge */}
    <g className="animate-float-delayed" filter="url(#softShadow)">
      <rect x="420" y="80" width="120" height="46" rx="14" fill="#ffffff" />
      <circle cx="442" cy="103" r="12" fill="#fef3c7" />
      <path d="M442 96l2.3 4.7 5.2.8-3.8 3.7.9 5.2-4.6-2.4-4.6 2.4.9-5.2-3.8-3.7 5.2-.8z" fill="#f59e0b" />
      <text x="462" y="100" fill="#0f172a" fontSize="11" fontWeight="700" fontFamily="sans-serif">Dedicated</text>
      <text x="462" y="113" fill="#64748b" fontSize="9" fontWeight="500" fontFamily="sans-serif">Doctor Care</text>
    </g>

    {/* Modern Clinic Window / Wall Arch */}
    <rect x="180" y="45" width="240" height="150" rx="20" fill="#ffffff" fillOpacity="0.6" />
    <line x1="300" y1="45" x2="300" y2="195" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
    <line x1="180" y1="120" x2="420" y2="120" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

    {/* Potted Aesthetic Desk Plant (Figma / Landing Page Theme) */}
    <path d="M75 320h40l-6 50H81z" fill="#e2e8f0" />
    <ellipse cx="95" cy="320" rx="20" ry="6" fill="#cbd5e1" />
    <path d="M95 315c-15-30-2-60 15-70-2 25-10 45-15 70z" fill="#10b981" />
    <path d="M95 315c15-25 35-40 40-20-10 15-25 15-40 20z" fill="#059669" />
    <path d="M95 318c-25-15-35-40-20-45 15 5 20 25 20 45z" fill="#34d399" />

    {/* Consultation Desk */}
    <rect x="110" y="325" width="380" height="18" rx="8" fill="url(#deskGrad)" />
    <rect x="140" y="343" width="16" height="75" rx="4" fill="#475569" />
    <rect x="444" y="343" width="16" height="75" rx="4" fill="#475569" />

    {/* Doctor Character (Left) */}
    <g>
      {/* Doctor Body & White Coat */}
      <circle cx="210" cy="190" r="28" fill="#fbcfe8" /> {/* Head */}
      <path d="M190 185c0-18 12-28 28-28s25 10 25 28c-6-4-16-6-25-4-8 2-18 4-28 4z" fill="#334155" /> {/* Hair */}
      <path d="M170 325v-80c0-15 15-30 40-30s40 15 40 30v80z" fill="#ffffff" /> {/* Coat */}
      <path d="M195 240l15 35 15-35v-25h-30z" fill="#e0f2fe" /> {/* Shirt Collar */}
      <path d="M207 245l3 30 3-30z" fill="#0284c7" /> {/* Tie */}
      {/* Stethoscope around neck */}
      <path d="M195 240c0 20 12 40 15 40s15-20 15-40" stroke="#0f766e" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="210" cy="285" r="5" fill="#0d9488" />
    </g>

    {/* Desktop Computer Workspace & Medical Chart */}
    <g filter="url(#softShadow)">
      <rect x="250" y="190" width="100" height="70" rx="8" fill="#0f172a" />
      <rect x="254" y="194" width="92" height="62" rx="6" fill="url(#screenGrad)" />
      {/* Screen Graphic (ECG / Chart UI) */}
      <rect x="260" y="202" width="40" height="6" rx="2" fill="#ffffff" fillOpacity="0.8" />
      <path d="M260 230h15l4-12 5 24 6-18 4 6h46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Stand */}
      <rect x="295" y="260" width="10" height="65" rx="2" fill="#64748b" />
      <ellipse cx="300" cy="325" rx="22" ry="5" fill="#94a3b8" />
      {/* Keyboard */}
      <rect x="270" y="322" width="60" height="4" rx="2" fill="#cbd5e1" />
    </g>

    {/* Patient Character (Right) */}
    <g>
      <circle cx="390" cy="205" r="26" fill="#fed7aa" /> {/* Head */}
      <path d="M370 200c0-18 14-25 32-25 15 0 24 10 24 25-6-3-16-4-28-2-12 2-20 2-28 2z" fill="#78350f" /> {/* Hair */}
      <path d="M350 325v-70c0-15 15-28 40-28s40 13 40 28v70z" fill="url(#purpleGrad)" /> {/* Clothes */}
      {/* Attentive Listening Gesture */}
      <circle cx="390" cy="208" r="4" fill="#ea580c" fillOpacity="0.4" />
    </g>

    {/* Clipboard with prescription on desk */}
    <rect x="345" y="318" width="35" height="8" rx="2" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
    <path d="M352 321h15m-15 3h10" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" />

    {/* Bottom Floating Badge: "Confidential & Private" */}
    <g className="animate-float" filter="url(#softShadow)">
      <rect x="210" y="375" width="180" height="46" rx="14" fill="#ffffff" />
      <circle cx="232" cy="398" r="12" fill="#ccfbf1" />
      <path d="M232 392v4m0 4h.01M228 395a4 4 0 018 0v2h-8v-2z" stroke="#0f766e" strokeWidth="1.5" fill="none" />
      <text x="252" y="395" fill="#0f172a" fontSize="11" fontWeight="700" fontFamily="sans-serif">100% Private Room</text>
      <text x="252" y="408" fill="#64748b" fontSize="9" fontWeight="500" fontFamily="sans-serif">Acoustic Confidentiality</text>
    </g>
  </svg>
);

export const DigitalBookingIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => (
  <svg
    viewBox="0 0 500 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="phoneGrad" x1="150" y1="50" x2="350" y2="350" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0b3b60" />
        <stop offset="1" stopColor="#072640" />
      </linearGradient>
      <linearGradient id="tealBtn" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#14b8a6" />
        <stop offset="1" stopColor="#0d9488" />
      </linearGradient>
      <filter id="softShad2" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#0b3b60" floodOpacity="0.15" />
      </filter>
    </defs>

    {/* Background Glow */}
    <circle cx="250" cy="200" r="160" fill="#f0f9ff" />
    <circle cx="280" cy="180" r="120" fill="#f3e8ff" fillOpacity="0.6" />

    {/* Mobile Phone Mockup */}
    <g filter="url(#softShad2)">
      <rect x="160" y="40" width="180" height="320" rx="32" fill="#0f172a" />
      <rect x="168" y="48" width="164" height="304" rx="26" fill="#ffffff" />
      
      {/* Notch */}
      <rect x="220" y="55" width="60" height="10" rx="5" fill="#0f172a" />
      
      {/* Clinic App UI Header */}
      <rect x="178" y="75" width="144" height="36" rx="10" fill="#0b3b60" />
      <text x="190" y="97" fill="#ffffff" fontSize="11" fontWeight="700" fontFamily="sans-serif">Sindhu Clinic</text>
      <circle cx="308" cy="93" r="5" fill="#2dd4bf" />

      {/* Booking Calendar Widget */}
      <rect x="178" y="120" width="144" height="90" rx="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      <text x="188" y="138" fill="#0f172a" fontSize="10" fontWeight="700" fontFamily="sans-serif">Select Date &amp; Slot</text>
      
      {/* Mini Calendar Days */}
      <rect x="188" y="150" width="22" height="22" rx="6" fill="#e2e8f0" />
      <text x="195" y="165" fill="#475569" fontSize="9" fontWeight="600" fontFamily="sans-serif">12</text>
      
      <rect x="216" y="150" width="22" height="22" rx="6" fill="#e2e8f0" />
      <text x="223" y="165" fill="#475569" fontSize="9" fontWeight="600" fontFamily="sans-serif">13</text>
      
      <rect x="244" y="150" width="22" height="22" rx="6" fill="url(#tealBtn)" />
      <text x="251" y="165" fill="#ffffff" fontSize="9" fontWeight="700" fontFamily="sans-serif">14</text>
      
      <rect x="272" y="150" width="22" height="22" rx="6" fill="#e2e8f0" />
      <text x="279" y="165" fill="#475569" fontSize="9" fontWeight="600" fontFamily="sans-serif">15</text>

      {/* Selected Slot Badge */}
      <rect x="188" y="180" width="124" height="20" rx="6" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1" />
      <text x="198" y="194" fill="#065f46" fontSize="8" fontWeight="600" fontFamily="sans-serif">Morning • 10:30 AM Slot</text>

      {/* Doctor Preview Strip */}
      <rect x="178" y="220" width="144" height="50" rx="12" fill="#f1f5f9" />
      <circle cx="198" cy="245" r="14" fill="#0b3b60" />
      <path d="M194 245h8m-4-4v8" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <text x="220" y="240" fill="#0f172a" fontSize="9" fontWeight="700" fontFamily="sans-serif">[Doctor Name]</text>
      <text x="220" y="252" fill="#64748b" fontSize="8" fontWeight="500" fontFamily="sans-serif">Consultant Physician</text>

      {/* CTA Button */}
      <rect x="178" y="285" width="144" height="34" rx="10" fill="url(#tealBtn)" />
      <text x="215" y="306" fill="#ffffff" fontSize="10" fontWeight="700" fontFamily="sans-serif">Confirm Booking</text>
    </g>

    {/* Floating Badge Left */}
    <g className="animate-float" filter="url(#softShad2)">
      <rect x="40" y="140" width="130" height="48" rx="14" fill="#ffffff" />
      <circle cx="64" cy="164" r="12" fill="#dbeafe" />
      <path d="M60 164l3 3 6-6" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="84" y="161" fill="#0f172a" fontSize="10" fontWeight="700" fontFamily="sans-serif">Instant Token</text>
      <text x="84" y="174" fill="#64748b" fontSize="8" fontWeight="500" fontFamily="sans-serif">Zero Wait Queue</text>
    </g>

    {/* Floating Badge Right */}
    <g className="animate-float-delayed" filter="url(#softShad2)">
      <rect x="330" y="230" width="130" height="48" rx="14" fill="#ffffff" />
      <circle cx="354" cy="254" r="12" fill="#fef3c7" />
      <path d="M354 247v8m0 4h.01" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
      <text x="374" y="251" fill="#0f172a" fontSize="10" fontWeight="700" fontFamily="sans-serif">SMS &amp; WhatsApp</text>
      <text x="374" y="264" fill="#64748b" fontSize="8" fontWeight="500" fontFamily="sans-serif">Visit Reminders</text>
    </g>
  </svg>
);
