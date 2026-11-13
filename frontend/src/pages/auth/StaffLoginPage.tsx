import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui';
import { Input } from '../../components/ui';

interface Props {
  onNavigate?: (page: string) => void;
}

export default function StaffLoginPage({ onNavigate }: Props) {
  const { login } = useAuth();
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.usernameOrEmail, form.password, false);
      onNavigate?.('admin-dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      {/* Subtle Ambient Background Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.12),rgba(0,0,0,0))] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-extrabold text-sm tracking-wider shadow-md shadow-blue-500/25 mb-3.5">
            SNH
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sindhu Narayani Hospital
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Unified Clinical &amp; Hospital Operating System (HMS / ERP)
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Staff Authentication
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Authorized clinical &amp; administrative access
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
              HIPAA Verified
            </span>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl mb-5 text-sm font-semibold text-red-700 dark:text-red-300">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Staff Username or Official Email
              </label>
              <input
                type="text"
                value={form.usernameOrEmail}
                onChange={(e) => setForm((f) => ({ ...f, usernameOrEmail: e.target.value }))}
                placeholder="e.g. admin or dr.priya@sindhu.health"
                required
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                  Secure Password
                </label>
                <button
                  type="button"
                  tabIndex={-1}
                  className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 font-bold cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full px-4 py-3 pr-16 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs font-medium"
                  placeholder="Enter staff credentials"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                />
                <span className="text-slate-600 dark:text-slate-400">Remember session for 12 hours</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm sm:text-base font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <span>Access Clinical Workspace</span>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials pill for fast evaluation */}
          <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Demo: <code className="font-mono text-slate-800 dark:text-slate-200 font-semibold">admin</code> / <code className="font-mono text-slate-800 dark:text-slate-200 font-semibold">admin123</code></span>
            <button
              type="button"
              onClick={() => setForm({ usernameOrEmail: 'admin', password: 'admin123' })}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
            >
              Auto-fill
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-500 dark:text-slate-400">
            Visiting as a patient?{' '}
            <button
              onClick={() => onNavigate?.('patient-login')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              Patient Self-Service Portal →
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-slate-400 dark:text-slate-400 text-xs mt-6">
          © {new Date().getFullYear()} Sindhu Narayani Multi-Speciality Hospital • Multi-Tenant Enterprise Tier
        </p>
      </div>
    </div>
  );
}
