import React from 'react';
import { Home, Calendar, Phone, ArrowLeft, HeartPulse } from 'lucide-react';
import { PageRoute } from '../types';

interface NotFoundPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-20">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-800 flex items-center justify-center mx-auto shadow-soft-sm">
          <HeartPulse className="w-9 h-9 text-brand-800" />
        </div>

        <div className="space-y-2">
          <span className="medical-badge medical-badge-blue text-xs font-bold">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-950">
            Page Not Found
          </h1>
          <p className="text-sm text-slateSubtle-600 leading-relaxed max-w-sm mx-auto">
            The page you are looking for might have been moved or is currently unavailable. Let’s get you back to the right place.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto btn-primary text-sm py-2.5 px-5 font-semibold"
          >
            <Home className="w-4 h-4 text-tealAccent-300" />
            <span>Return to Homepage</span>
          </button>

          <button
            onClick={() => onNavigate('appointments')}
            className="w-full sm:w-auto btn-teal text-sm py-2.5 px-5 font-semibold"
          >
            <Calendar className="w-4 h-4" />
            <span>Book an Appointment</span>
          </button>
        </div>

        <div className="pt-6 border-t border-slateSubtle-200/80 flex items-center justify-center gap-6 text-xs text-slateSubtle-500">
          <button onClick={() => onNavigate('services')} className="hover:text-brand-800 transition-colors">
            Medical Services
          </button>
          <span>&bull;</span>
          <button onClick={() => onNavigate('doctor')} className="hover:text-brand-800 transition-colors">
            Doctor Profile
          </button>
          <span>&bull;</span>
          <button onClick={() => onNavigate('contact')} className="hover:text-brand-800 transition-colors">
            Contact Clinic
          </button>
        </div>
      </div>
    </div>
  );
};
