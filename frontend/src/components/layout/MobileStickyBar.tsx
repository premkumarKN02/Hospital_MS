import React from 'react';
import { Phone, MessageSquare, Calendar } from 'lucide-react';
import { CLINIC_CONFIG } from '../../config/clinicData';
import { PageRoute } from '../../types';

interface MobileStickyBarProps {
  onNavigate: (page: PageRoute) => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onNavigate }) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slateSubtle-200 px-3 py-2.5 shadow-soft-xl flex items-center justify-between gap-2">
      <a
        href={CLINIC_CONFIG.phoneCallValue}
        className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-slateSubtle-100 text-slateSubtle-800 text-[11px] font-semibold active:scale-95 transition-transform"
      >
        <Phone className="w-4 h-4 text-brand-700 mb-0.5" />
        <span>Call</span>
      </a>

      <a
        href={CLINIC_CONFIG.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl bg-tealAccent-50 border border-tealAccent-200/80 text-tealAccent-900 text-[11px] font-semibold active:scale-95 transition-transform"
      >
        <MessageSquare className="w-4 h-4 text-tealAccent-600 mb-0.5" />
        <span>WhatsApp</span>
      </a>

      <button
        onClick={() => {
          onNavigate('appointments');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex-[2] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-brand-800 text-white text-xs font-bold active:scale-95 transition-transform shadow-soft-sm"
      >
        <Calendar className="w-4 h-4 text-tealAccent-300" />
        <span>Book Visit</span>
      </button>
    </div>
  );
};
