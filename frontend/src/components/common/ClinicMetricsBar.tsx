import React from 'react';
import {
  Clock,
  ShieldCheck,
  HeartPulse,
  Award,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const ClinicMetricsBar: React.FC = () => {
  const metrics = [
    {
      value: '100%',
      label: '1-on-1 Dedicated Physician',
      desc: 'Unhurried consultation with our lead consultant physician',
      badge: 'Gold Standard',
      icon: HeartPulse,
      accentColor: 'text-rose-300',
      badgeBg: 'bg-rose-500/30 text-rose-200 border-rose-400/40',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800'
    },
    {
      value: '< 15 Min',
      label: 'Minimal In-Clinic Wait',
      desc: 'Digital queue system & scheduled consultation slots',
      badge: 'Efficient Care',
      icon: Clock,
      accentColor: 'text-tealAccent-300',
      badgeBg: 'bg-teal-500/30 text-teal-200 border-teal-400/40',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
    },
    {
      value: '7 Days',
      label: 'Free Follow-Up Review',
      desc: 'Supervised recovery window with structured follow-ups',
      badge: 'Continuity Promise',
      icon: ShieldCheck,
      accentColor: 'text-sky-300',
      badgeBg: 'bg-blue-500/30 text-sky-200 border-sky-400/40',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800'
    },
    {
      value: '100%',
      label: 'Confidential & Private',
      desc: 'Sound-insulated consultation suite & encrypted records',
      badge: 'Strict Privacy',
      icon: Lock,
      accentColor: 'text-purple-300',
      badgeBg: 'bg-purple-500/30 text-purple-200 border-purple-400/40',
      imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 relative perspective-container">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="perspective-card relative overflow-hidden rounded-3xl min-h-[220px] p-6 shadow-xl border border-white/20 group hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Real-world clinical background image */}
              <img
                src={m.imageUrl}
                alt={m.label}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />

              {/* Dark Scrim Overlay */}
              <div className="full-bleed-card-scrim bg-gradient-to-t from-slate-950/95 via-slate-900/80 to-slate-950/60" />

              {/* Canva Inset Border Line */}
              <div className="canva-frame" />

              {/* Top Row: Icon & Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-slate-950/85 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow-md group-hover:scale-110 group-hover:bg-slate-900 transition-all duration-300">
                  <Icon className="w-5 h-5 text-tealAccent-300" />
                </div>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider border px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-md ${m.badgeBg}`}>
                  <CheckCircle2 className="w-3 h-3 text-tealAccent-300" />
                  <span className="text-white drop-shadow-sm">{m.badge}</span>
                </span>
              </div>

              {/* Bottom Details with Ultra-Bright White Typography */}
              <div className="relative z-10 mt-5">
                <p className={`text-3xl sm:text-4xl font-black ${m.accentColor} tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]`}>
                  {m.value}
                </p>
                <h4 className="text-base font-bold text-white mt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
                  {m.label}
                </h4>
                <p className="text-xs text-white/90 font-medium mt-1 leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
                  {m.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
