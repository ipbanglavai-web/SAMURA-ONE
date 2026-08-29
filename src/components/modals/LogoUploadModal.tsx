import React, { useState, useRef } from 'react';
import { useLogo } from '../../context/LogoContext';
import { Upload, Image as ImageIcon, Trash2, Check, X, Shield, LayoutDashboard, KeyRound } from 'lucide-react';

export type LogoTarget = 'system' | 'login';

interface LogoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LogoTarget;
}

export const LogoUploadModal: React.FC<LogoUploadModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login'
}) => {
  const {
    customLogo,
    loginLogo,
    uploadLogoFile,
    setCustomLogo,
    setLoginLogo,
    resetLogo,
    resetLoginLogo
  } = useLogo();

  const [activeTab, setActiveTab] = useState<LogoTarget>(initialTab);
  const [urlInput, setUrlInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setError(null);
      setUrlInput('');
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const currentLogo = activeTab === 'login' ? loginLogo : customLogo;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    try {
      await uploadLogoFile(file, activeTab);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to upload logo.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!urlInput.trim()) {
      setError('Please provide a valid image URL.');
      return;
    }
    if (activeTab === 'login') {
      setLoginLogo(urlInput.trim());
    } else {
      setCustomLogo(urlInput.trim());
    }
    setUrlInput('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    if (activeTab === 'login') {
      resetLoginLogo();
    } else {
      resetLogo();
    }
    setUrlInput('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#E5EAE8] overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0E5A4F] to-[#073F37] p-4 sm:p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <ImageIcon className="w-4 h-4 text-[#22A06B]" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">Brand Logo Customization</h3>
              <p className="text-xs text-[#A3B8B0]">Configure Login Page Logo & Enterprise Command System Logo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="p-4 bg-[#F6F8F7] border-b border-[#E5EAE8]">
          <div className="flex bg-[#E5EAE8] p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError(null);
                setUrlInput('');
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-[#0E5A4F] shadow-xs'
                  : 'text-[#71807B] hover:text-[#18211F]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-[#22A06B]" />
              <span>Login Page Logo</span>
              {loginLogo && <span className="w-2 h-2 rounded-full bg-[#22A06B]" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('system');
                setError(null);
                setUrlInput('');
              }}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'system'
                  ? 'bg-white text-[#0E5A4F] shadow-xs'
                  : 'text-[#71807B] hover:text-[#18211F]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#22A06B]" />
              <span>System & Dashboard Logo</span>
              {customLogo && <span className="w-2 h-2 rounded-full bg-[#22A06B]" />}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Logo Live Preview */}
          <div className="p-4 bg-[#F8FAF9] rounded-xl border border-[#E5EAE8] flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[10px] font-bold text-[#71807B] uppercase tracking-wider">
                {activeTab === 'login' ? 'Active Login Page Logo Preview' : 'Active System & Sidebar Logo Preview'}
              </span>
            </div>

            <div className="w-28 h-24 rounded-xl bg-white border border-[#E5EAE8] shadow-inner flex items-center justify-center overflow-hidden p-2 relative group">
              {currentLogo ? (
                <img
                  src={currentLogo}
                  alt="Current Logo"
                  className="max-w-full max-h-full object-contain"
                  onError={() => setError('Image failed to load. Please check the URL or upload a different file.')}
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-[#0E5A4F] flex flex-col items-center justify-center text-white font-bold text-xs tracking-wider shadow-sm">
                  <span className="leading-tight text-center">SAMURA<br />ONE</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-[#71807B] mt-2">
              {currentLogo
                ? `Custom ${activeTab === 'login' ? 'Login Page' : 'System'} Logo is Active`
                : `Using default SAMURA ONE mark for ${activeTab === 'login' ? 'Login Page' : 'System'}`}
            </p>
            <p className="text-[10px] text-[#A3B8B0] mt-0.5">
              {activeTab === 'login'
                ? 'Appears on the login portal header and login card'
                : 'Appears on top command bar, sidebar, and printout invoices'}
            </p>
          </div>

          {/* Success Banner */}
          {saveSuccess && (
            <div className="p-2.5 rounded-lg bg-[#DCFCE7] text-[#166534] text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <Check className="w-4 h-4 text-[#22A06B] shrink-0" />
              <span>
                {activeTab === 'login'
                  ? 'Login page logo updated successfully!'
                  : 'System & Dashboard logo updated successfully!'}
              </span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {error}
            </div>
          )}

          {/* Upload Box */}
          <div>
            <label className="block text-xs font-bold text-[#18211F] mb-1.5">
              Option 1: Upload Image File (PNG, JPG, SVG, WebP)
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full py-3.5 px-4 border-2 border-dashed border-[#0E5A4F]/30 hover:border-[#0E5A4F] bg-[#F8FAF9] hover:bg-[#F1F6F4] rounded-xl flex flex-col items-center justify-center gap-1.5 text-xs font-semibold text-[#0E5A4F] transition-all cursor-pointer group"
            >
              <Upload className="w-5 h-5 text-[#22A06B] group-hover:scale-110 transition-transform" />
              <span>
                {isUploading
                  ? 'Uploading Image...'
                  : `Upload New ${activeTab === 'login' ? 'Login Page' : 'System'} Logo`}
              </span>
              <span className="text-[10px] text-[#71807B] font-normal">
                Recommended: 250x80px or 200x200px transparent PNG / SVG (Max 5MB)
              </span>
            </button>
          </div>

          {/* URL Input Form */}
          <form onSubmit={handleApplyUrl} className="space-y-2">
            <label className="block text-xs font-bold text-[#18211F]">
              Option 2: Direct Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/brand-logo.png"
                className="flex-1 px-3 py-2 border border-[#E5EAE8] rounded-xl text-xs text-[#18211F] focus:border-[#0E5A4F] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#0E5A4F] hover:bg-[#073F37] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
          </form>

          {/* Reset / Actions */}
          <div className="pt-3 border-t border-[#E5EAE8] flex items-center justify-between">
            {currentLogo ? (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset {activeTab === 'login' ? 'Login Logo' : 'System Logo'} to Default</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#0E5A4F] hover:bg-[#073F37] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

