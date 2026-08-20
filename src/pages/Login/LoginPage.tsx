import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { Eye, EyeOff, Lock, Mail, Shield, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);

  const isEmailValid = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!isEmailValid(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      onLoginSuccess();
    } else {
      setErrorMessage(res.error || 'Invalid email or password.');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@admin.com');
    setPassword('admin123');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#06352F] flex flex-col justify-between relative overflow-hidden text-white font-['Inter',sans-serif]">
      {/* Background ambient lighting */}
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-[#0E5A4F] rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-[#073F37] rounded-full blur-3xl opacity-60 pointer-events-none" />

      {/* Top Header Bar */}
      <header className="px-6 py-5 border-b border-[#0E5A4F]/40 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0E5A4F] border border-[#22A06B]/30 flex items-center justify-center font-bold text-xs tracking-wider text-white shadow-sm">
            <span className="leading-tight text-center">AL<br/>SAMU</span>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white leading-none">SAMURA ONE</h1>
            <p className="text-[11px] text-[#A3B8B0] font-medium tracking-wide">AL SAMURA Group Command Platform</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#A3B8B0] bg-[#073F37]/80 px-3 py-1.5 rounded-md border border-[#0E5A4F]">
          <span className="w-2 h-2 rounded-full bg-[#22A06B] animate-pulse"></span>
          <span>Enterprise Secure Gateway</span>
        </div>
      </header>

      {/* Main Login Card Center */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-[440px] bg-[#073F37]/90 backdrop-blur-md rounded-xl border border-[#0E5A4F] p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0E5A4F]/60 border border-[#22A06B]/30 text-[#22A06B] mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-semibold text-white tracking-tight">Welcome Back</h2>
            <p className="text-sm text-[#A3B8B0] mt-1.5">Sign in to access the SAMURA ONE Command Platform</p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-lg bg-[#D9534F]/20 border border-[#D9534F]/40 flex items-start gap-2.5 text-sm text-[#FCA5A5] animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-tight">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#D1DDD7] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71807B]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="admin@admin.com"
                  autoComplete="email"
                  className={`w-full bg-[#06352F] border ${
                    emailTouched && !isEmailValid(email) && email.length > 0
                      ? 'border-[#D9534F] focus:ring-[#D9534F]'
                      : 'border-[#0E5A4F] focus:border-[#22A06B]'
                  } rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#5A6D67] focus:outline-none focus:ring-1 focus:ring-[#22A06B] transition-colors`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#D1DDD7] uppercase tracking-wider">
                  Password
                </label>
                <span className="text-xs text-[#22A06B] hover:underline cursor-pointer">
                  Protected System
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71807B]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#06352F] border border-[#0E5A4F] focus:border-[#22A06B] rounded-lg pl-10 pr-11 py-2.5 text-sm text-white placeholder-[#5A6D67] focus:outline-none focus:ring-1 focus:ring-[#22A06B] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#71807B] hover:text-[#D1DDD7] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="login-submit-button"
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0E5A4F] hover:bg-[#135E54] active:bg-[#0B4A40] text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="mt-6 pt-5 border-t border-[#0E5A4F]/60 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs text-[#A3B8B0] hover:text-white flex items-center justify-center gap-1.5 mx-auto py-1 px-3 rounded bg-[#06352F]/70 border border-[#0E5A4F] transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#22A06B]" />
              <span>Fill Admin Demo Credentials (admin@admin.com)</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="px-6 py-4 border-t border-[#0E5A4F]/30 text-center text-xs text-[#71807B] z-10">
        <p>© 2026 AL SAMURA Group. All rights reserved. Authorized executive access only.</p>
      </footer>
    </div>
  );
};
