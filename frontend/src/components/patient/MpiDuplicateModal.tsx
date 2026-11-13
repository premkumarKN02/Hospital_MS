import React from 'react';
import { AlertTriangle, UserCheck, ShieldAlert, GitMerge, X } from 'lucide-react';

export interface MpiMatch {
  existingUhid: string;
  existingPatientId?: string;
  existingName: string;
  existingPhone: string;
  existingDob?: string;
  confidenceScore: number;
  matchReasons: string[];
}

interface MpiDuplicateModalProps {
  isOpen: boolean;
  onClose: () => void;
  matches: MpiMatch[];
  onProceedAnyway: () => void;
  onSelectExisting: (uhid: string) => void;
}

export const MpiDuplicateModal: React.FC<MpiDuplicateModalProps> = ({
  isOpen,
  onClose,
  matches,
  onProceedAnyway,
  onSelectExisting,
}) => {
  if (!isOpen || matches.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-amber-500/30 dark:border-amber-500/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-200 dark:border-amber-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Master Patient Index (MPI) Warning
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                  Duplicate Suspected
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Patient record collision detected against central master registry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <span className="font-semibold">Patient Safety Precaution:</span> Registering duplicate records can fragment prescription histories, allergic alerts, and diagnostic lab trends. Please review the matching patient record below before proceeding.
            </div>
          </div>

          <div className="space-y-3">
            {matches.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-amber-400 dark:hover:border-amber-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                      {m.existingUhid}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">
                      {m.existingName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {m.confidenceScore}% Match
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 mb-3">
                  <div>
                    <span className="text-slate-400 dark:text-slate-400">Registered Phone: </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{m.existingPhone}</span>
                  </div>
                  {m.existingDob && (
                    <div>
                      <span className="text-slate-400 dark:text-slate-400">DOB: </span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{m.existingDob}</span>
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Matching Criteria: </span>
                  {m.matchReasons.join(', ')}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => onSelectExisting(m.existingUhid)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors"
                  >
                    <GitMerge className="w-3.5 h-3.5" />
                    Open Existing Record ({m.existingUhid})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel & Recheck
          </button>
          <button
            type="button"
            onClick={onProceedAnyway}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            Proceed as Verified Distinct Individual
          </button>
        </div>
      </div>
    </div>
  );
};
