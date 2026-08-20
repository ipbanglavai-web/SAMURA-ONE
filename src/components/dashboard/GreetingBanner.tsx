import React from 'react';
import { ArrowRight, AlertTriangle } from 'lucide-react';

interface GreetingBannerProps {
  userName?: string;
  onViewAttentionItems?: () => void;
}

export const GreetingBanner: React.FC<GreetingBannerProps> = ({
  userName = 'Sabuz',
  onViewAttentionItems
}) => {
  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-[#0E5A4F] to-[#073F37] rounded-xl p-4 sm:p-5 text-white flex-shrink-0 shadow-xs border border-[#0E5A4F]/60">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Assalamu Alaikum, {userName}
        </h2>
        <p className="text-[#22A06B] text-xs sm:text-sm mt-1">
          An overview of today's business health, risks, and pending decisions.
        </p>
      </div>

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
  );
};
