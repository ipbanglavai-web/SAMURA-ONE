import React, { useState } from 'react';
import { useLogo } from '../../context/LogoContext';
import { LogoUploadModal } from '../modals/LogoUploadModal';
import { Camera, Image as ImageIcon, Sparkles } from 'lucide-react';

interface GreetingBannerProps {
  userName?: string;
  onViewAttentionItems?: () => void;
}

export const GreetingBanner: React.FC<GreetingBannerProps> = ({
  userName = 'Sabuz',
  onViewAttentionItems
}) => {
  const { customLogo } = useLogo();
  const [logoModalOpen, setLogoModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-[#0E5A4F] to-[#073F37] rounded-xl p-4 sm:p-5 text-white flex-shrink-0 shadow-xs border border-[#0E5A4F]/60">
        <div className="flex items-center gap-4">
          {/* Brand Logo Upload Box on Admin Dashboard */}
          <button
            id="dashboard-upload-logo-btn"
            onClick={() => setLogoModalOpen(true)}
            className="group relative flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all p-1.5 cursor-pointer shrink-0 shadow-xs"
            title="Click to upload or change custom logo"
            aria-label="Upload custom brand logo"
          >
            {customLogo ? (
              <img
                src={customLogo}
                alt="Brand Logo"
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <ImageIcon className="w-5 h-5 text-[#22A06B] group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-bold text-[#A3B8B0] mt-0.5 leading-none">Logo</span>
              </div>
            )}
            {/* Hover overlay icon */}
            <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Assalamu Alaikum, {userName}
              </h2>
              <button
                onClick={() => setLogoModalOpen(true)}
                className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[#A3B8B0] hover:text-white text-[11px] font-medium transition-colors cursor-pointer border border-white/10"
              >
                <Camera className="w-3 h-3 text-[#22A06B]" />
                <span>{customLogo ? 'Change Logo' : 'Upload Logo'}</span>
              </button>
            </div>
            <p className="text-[#22A06B] text-xs sm:text-sm mt-1">
              An overview of today's business health, risks, and pending decisions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div
            onClick={onViewAttentionItems}
            className="bg-white/10 backdrop-blur-md border border-white/10 p-2.5 sm:p-3 px-3.5 sm:px-5 rounded-lg text-right cursor-pointer hover:bg-white/15 transition-all"
            role="button"
            tabIndex={0}
            aria-label="Group Health: Stable. 3 items need attention"
          >
            <span className="text-[10px] uppercase font-bold text-[#22A06B] block tracking-wide">
              Group Health
            </span>
            <span className="text-lg sm:text-xl font-bold leading-tight block">
              Stable
            </span>
            <span className="text-[10px] sm:text-[11px] opacity-80 block">
              3 items need attention
            </span>
          </div>
        </div>
      </div>

      {/* Brand Logo Upload Modal */}
      <LogoUploadModal
        isOpen={logoModalOpen}
        onClose={() => setLogoModalOpen(false)}
      />
    </>
  );
};

