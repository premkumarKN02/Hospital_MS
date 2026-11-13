import React, { useState } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, AlertCircle } from './ui-primitives';
import { Lock, Mail, User, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

/* ==========================================================================
   1. LOGIN PAGE TEMPLATE
   ========================================================================== */
export interface LoginPageProps {
  appName?: string;
  logoIcon?: React.ReactNode;
  onLogin: (data: { email: string; pass: string; remember: boolean }) => Promise<void>;
  onNavigateRegister: () => void;
  onNavigateForgot: () => void;
  disclaimerText?: string;
}

export function LoginPage({
  appName = 'Enterprise Portal',
  logoIcon = <ShieldCheck className="w-8 h-8 text-primary" />,
  onLogin,
  onNavigateRegister,
  onNavigateForgot,
  disclaimerText = 'Protected by SOC-2 Type II and HIPAA compliant infrastructure.',
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please provide both your work email and password.');
      return;
    }
    setIsLoading(true);
    try {
      await onLogin({ email, pass: password, remember });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Invalid credentials. Please verify your login details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-primary/10 rounded-xl mb-3">{logoIcon}</div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{appName}</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your enterprise workspace</p>
        </div>

        {/* Auth Card */}
        <Card className="border-border shadow-md">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Input
                label="Work Email Address"
                type="email"
                placeholder="doctor@hospital.org"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                autoComplete="email"
              />

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <button
                    type="button"
                    onClick={onNavigateForgot}
                    className="text-xs text-primary hover:underline focus:outline-none"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="cursor-pointer hover:text-foreground focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-muted-foreground select-none">
                  Keep me signed in for 30 days
                </label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Sign In
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <div className="text-center text-xs text-muted-foreground">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={onNavigateRegister}
                  className="font-medium text-primary hover:underline focus:outline-none"
                >
                  Request access
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Security Notice */}
        <p className="text-center text-xs text-muted-foreground">
          {disclaimerText}
        </p>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. FORGOT PASSWORD & RESET FLOW
   ========================================================================== */
export interface ForgotPasswordProps {
  appName?: string;
  onSubmitEmail: (email: string) => Promise<void>;
  onBackToLogin: () => void;
}

export function ForgotPasswordPage({
  appName = 'Enterprise Portal',
  onSubmitEmail,
  onBackToLogin,
}: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmitEmail(email);
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md border-border shadow-md">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            {isSubmitted
              ? `We have dispatched recovery instructions to ${email}.`
              : 'Enter your registered work email to receive a secure recovery link.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Work Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Send Recovery Instructions
              </Button>
            </form>
          ) : (
            <div className="p-4 rounded-md bg-primary/10 border border-primary/20 text-center space-y-2">
              <p className="text-sm font-medium text-foreground">Check your inbox</p>
              <p className="text-xs text-muted-foreground">
                Follow the secure one-time link in your email to choose a new password. Link expires in 15 minutes.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" onClick={onBackToLogin}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
