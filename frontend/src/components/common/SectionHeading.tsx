import React from 'react';

interface SectionHeadingProps {
  badge?: string;
  badgeVariant?: 'blue' | 'teal' | 'amber' | 'green';
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  /** Lucide icon name as SVG path string, or a pre-rendered JSX icon node */
  watermarkIcon?: React.ReactNode;
  className?: string;
}

/**
 * SectionHeading — Professional reusable section title block
 * Renders a badge + h2 + optional subtitle with:
 *   - Decorative flanking lines with diamond nodes
 *   - A large translucent watermark icon behind the heading
 *   - Consistent spacing & typography across all pages
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  badgeVariant = 'blue',
  title,
  subtitle,
  align = 'center',
  watermarkIcon,
  className = '',
}) => {
  const badgeClass = {
    blue:  'medical-badge medical-badge-blue',
    teal:  'medical-badge medical-badge-teal',
    amber: 'medical-badge medical-badge-amber',
    green: 'medical-badge medical-badge-teal',
  }[badgeVariant];

  const isCenter = align === 'center';

  return (
    <div className={`relative ${isCenter ? 'text-center' : 'text-left'} ${className}`}>

      {/* ── Watermark Icon (large translucent background) ── */}
      {watermarkIcon && (
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{ zIndex: 0 }}
        >
          <div
            className="opacity-[0.045]"
            style={{ transform: 'scale(3.5)', color: '#0b3b60' }}
          >
            {watermarkIcon}
          </div>
        </div>
      )}

      <div className={`relative z-10 ${isCenter ? 'max-w-2xl mx-auto' : ''} space-y-4`}>

        {/* Badge */}
        {badge && (
          <div className={isCenter ? 'flex justify-center' : ''}>
            <span className={badgeClass}>{badge}</span>
          </div>
        )}

        {/* Decorated Title Row */}
        <div className={`flex items-center gap-4 ${isCenter ? 'justify-center' : ''}`}>
          {/* Left decorative line */}
          {isCenter && (
            <div className="flex items-center gap-1.5 flex-shrink-0" aria-hidden="true">
              <div className="h-px w-8 sm:w-14 bg-gradient-to-l from-teal-400/60 to-transparent rounded-full" />
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 rotate-45 flex-shrink-0" />
            </div>
          )}

          <h2 className="text-2xl sm:text-4xl font-extrabold text-brand-950 leading-tight tracking-tight">
            {title}
          </h2>

          {/* Right decorative line */}
          {isCenter && (
            <div className="flex items-center gap-1.5 flex-shrink-0" aria-hidden="true">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 rotate-45 flex-shrink-0" />
              <div className="h-px w-8 sm:w-14 bg-gradient-to-r from-teal-400/60 to-transparent rounded-full" />
            </div>
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm sm:text-base text-slateSubtle-600 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
