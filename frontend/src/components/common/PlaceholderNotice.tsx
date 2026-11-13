import React from 'react';
import { AlertCircle, Sliders } from 'lucide-react';
import { CLINIC_CONFIG } from '../../config/clinicData';

interface PlaceholderNoticeProps {
  compact?: boolean;
}

export const PlaceholderNotice: React.FC<PlaceholderNoticeProps> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-amber-50 text-amber-900 border border-amber-200">
        <Sliders className="w-3 h-3 text-amber-700 flex-shrink-0" />
        <span>Template Mode: Bracketed fields are editable client placeholders</span>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 sm:p-4 my-4 flex items-start gap-3 text-xs sm:text-sm text-amber-900 shadow-sm">
      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-amber-950">Client Configuration Notice</p>
        <p className="mt-0.5 text-amber-800 leading-relaxed">
          {CLINIC_CONFIG.placeholderNotice} All clinical credentials, registration IDs, phone numbers, and timings are centrally managed in <code className="px-1.5 py-0.5 bg-amber-100/80 rounded text-amber-950 font-mono text-xs">src/config/clinicData.ts</code>.
        </p>
      </div>
    </div>
  );
};
