import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useLogo } from '../../context/LogoContext';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Building2,
  UserCheck,
  Briefcase
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { login, isLoading } = useAuth();
  const { loginLogo, customLogo } = useLogo();
  const [loginRole, setLoginRole] = useState<'admin' | 'manager'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);

  const effectiveLoginLogo = loginLogo || customLogo;

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
      setErrorMessage(
        res.error ||
          (loginRole === 'manager'
            ? 'Manager credentials not found. Ensure Admin has registered this email.'
            : 'Invalid email or password.')
      );
    }
  };

  const handleFillAdminDemo = () => {
    setLoginRole('admin');
    setEmail('admin@admin.com');
    setPassword('admin123');
    setErrorMessage(null);
  };

  const handleFillManagerDemo = (mgrEmail: string, pass = 'password123') => {
    setLoginRole('manager');
    setEmail(mgrEmail);
    setPassword(pass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#06352F] flex flex-col justify-between relative overflow-hidden text-white font-['Inter',sans-serif]">
      {/* Background ambient lighting */}
      <div className="absolute -top-48 -left-48 w-96 h-96 bg-[#0E5A4F] rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-[#073F37] rounded-full blur-3xl opacity-60 pointer-events-none" />

      {/* Top Header Bar */}
      <header className="px-6 py-4 sm:py-5 border-b border-[#0E5A4F]/40 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {effectiveLoginLogo ? (
            <div className="h-10 max-w-[150px] px-2 py-1 bg-white rounded-lg flex items-center justify-center shadow-xs border border-white/30">
              <img
                src={effectiveLoginLogo}
                alt="Brand Logo"
                className="max-h-8 max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-lg bg-[#0E5A4F] border border-[#22A06B]/30 flex items-center justify-center font-bold text-xs tracking-wider text-white shadow-sm">
              <span className="leading-tight text-center">AL<br/>SAMU</span>
            </div>
          )}
          <div>
            <h1 className="text-base font-bold tracking-tight text-white leading-none">
              {effectiveLoginLogo ? 'SAMURA ONE' : 'SAMURA ONE'}
            </h1>
            <p className="text-[11px] text-[#A3B8B0] font-medium tracking-wide">AL SAMURA Group Command Platform</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#A3B8B0] bg-[#073F37]/80 px-3 py-1.5 rounded-md border border-[#0E5A4F]">
          <span className="w-2 h-2 rounded-full bg-[#22A06B] animate-pulse"></span>
          <span>Enterprise Gateway · Multi-Unit Support</span>
        </div>
      </header>

      {/* Main Login Card Center */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-[460px] bg-[#073F37]/90 backdrop-blur-md rounded-2xl border border-[#0E5A4F] p-6 sm:p-8 shadow-2xl">
          {/* Role Switcher Tabs */}
          <div className="flex p-1 bg-[#06352F] rounded-xl border border-[#0E5A4F] mb-6">
            <button
              id="login-role-admin"
              type="button"
              onClick={() => {
                setLoginRole('admin');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                loginRole === 'admin'
                  ? 'bg-[#0E5A4F] text-white shadow-sm border border-[#22A06B]/40'
                  : 'text-[#A3B8B0] hover:text-white hover:bg-white/5'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#22A06B]" />
              <span>Group Admin</span>
            </button>
            <button
              id="login-role-manager"
              type="button"
              onClick={() => {
                setLoginRole('manager');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                loginRole === 'manager'
                  ? 'bg-[#0E5A4F] text-white shadow-sm border border-[#22A06B]/40'
                  : 'text-[#A3B8B0] hover:text-white hover:bg-white/5'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#22A06B]" />
              <span>Manager / GM</span>
            </button>
          </div>

          <div className="mb-6 text-center">
            {effectiveLoginLogo ? (
              <div className="mb-4 flex flex-col items-center justify-center">
                <div className="h-16 max-w-[200px] px-3 py-1.5 bg-white rounded-xl flex items-center justify-center shadow-md border border-white/40">
                  <img
                    src={effectiveLoginLogo}
                    alt="Login Brand Logo"
                    className="max-h-12 max-w-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0E5A4F]/60 border border-[#22A06B]/30 text-[#22A06B] mb-3">
                {loginRole === 'admin' ? (
                  <Shield className="w-6 h-6" />
                ) : (
                  <Building2 className="w-6 h-6" />
                )}
              </div>
            )}
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {loginRole === 'admin' ? 'Executive Admin Portal' : 'Manager / General Manager Login'}
            </h2>
            <p className="text-xs text-[#A3B8B0] mt-1.5">
              {loginRole === 'admin'
                ? 'Authorized access for Group Managing Director & Chairman'
                : 'Sign in as Unit Manager or General Manager to access assigned businesses'}
            </p>
            <p className="text-xs sm:text-sm text-[#A3B8B0] mt-1">
              {loginRole === 'admin'
                ? 'Sign in to access the Group Command Dashboard'
                : 'Sign in with your assigned business email & password to access your unit'}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-[#D9534F]/20 border border-[#D9534F]/40 flex items-start gap-2 text-xs sm:text-sm text-[#FCA5A5] animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-tight">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#D1DDD7] uppercase tracking-wider mb-1.5">
                {loginRole === 'admin' ? 'Admin Email Address' : 'Manager Email Address'}
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
                  placeholder={
                    loginRole === 'admin' ? 'admin@admin.com' : 'rafiqul@alsamura.com'
                  }
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
                <span className="text-xs text-[#22A06B]">
                  {loginRole === 'admin' ? 'Master Access' : 'Unit Assigned'}
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
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#71807B] hover:text-[#D1DDD7] transition-colors cursor-pointer"
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
                className="w-full bg-[#0E5A4F] hover:bg-[#135E54] active:bg-[#0B4A40] text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {loginRole === 'admin'
                        ? 'Sign In to Admin Dashboard'
                        : 'Sign In to Unit Dashboard'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Helpers */}
          <div className="mt-6 pt-4 border-t border-[#0E5A4F]/60">
            <div className="text-[11px] uppercase tracking-wider text-[#A3B8B0] font-bold text-center mb-2.5">
              Quick One-Click Demo Access
            </div>
            <div className="flex flex-col gap-2">
              {loginRole === 'admin' ? (
                <button
                  id="fill-admin-demo-btn"
                  type="button"
                  onClick={handleFillAdminDemo}
                  className="text-xs text-[#E6F4ED] hover:text-white flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#06352F] border border-[#0E5A4F] hover:border-[#22A06B] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-[#22A06B]" />
                    <span className="font-medium">Group Admin (MD & Founder)</span>
                  </div>
                  <span className="text-[10px] text-[#A3B8B0] group-hover:text-white font-mono">
                    admin@admin.com
                  </span>
                </button>
              ) : (
                <>
                  <button
                    id="fill-gm-demo-btn"
                    type="button"
                    onClick={() => handleFillManagerDemo('gm@alsamura.com')}
                    className="text-xs text-[#E6F4ED] hover:text-white flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#0E5A4F]/40 border border-[#22A06B]/50 hover:bg-[#0E5A4F]/70 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-[#22A06B]" />
                      <span className="font-bold text-[#E6F4ED]">General Manager (Kabir Ahmed - GM)</span>
                    </div>
                    <span className="text-[10px] text-[#A3B8B0] group-hover:text-white font-mono">
                      gm@alsamura.com
                    </span>
                  </button>

                  <button
                    id="fill-elenga-manager-demo-btn"
                    type="button"
                    onClick={() => handleFillManagerDemo('rafiqul@alsamura.com')}
                    className="text-xs text-[#E6F4ED] hover:text-white flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#06352F] border border-[#0E5A4F] hover:border-[#22A06B] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-[#22A06B]" />
                      <span className="font-medium">Elenga Fruits Manager (Rafiqul)</span>
                    </div>
                    <span className="text-[10px] text-[#A3B8B0] group-hover:text-white font-mono">
                      rafiqul@alsamura.com
                    </span>
                  </button>

                  <button
                    id="fill-mourin-manager-demo-btn"
                    type="button"
                    onClick={() => handleFillManagerDemo('tariqul@alsamura.com')}
                    className="text-xs text-[#E6F4ED] hover:text-white flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#06352F] border border-[#0E5A4F] hover:border-[#22A06B] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-[#22A06B]" />
                      <span className="font-medium">Mourin Fruits Manager (Tariqul)</span>
                    </div>
                    <span className="text-[10px] text-[#A3B8B0] group-hover:text-white font-mono">
                      tariqul@alsamura.com
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="px-6 py-3.5 border-t border-[#0E5A4F]/30 text-center text-xs text-[#71807B] z-10">
        <p>© 2026 AL SAMURA Group. All rights reserved. Authorized executive & unit management access only.</p>
      </footer>
    </div>
  );
};
