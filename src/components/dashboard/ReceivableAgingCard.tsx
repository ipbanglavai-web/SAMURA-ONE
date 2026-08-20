import React from 'react';
import { ReceivableAgingItem } from '../../types';

interface ReceivableAgingCardProps {
  agingData: ReceivableAgingItem[];
  totalReceivable?: string;
  onViewAgingLedger?: () => void;
}

export const ReceivableAgingCard: React.FC<ReceivableAgingCardProps> = ({
  agingData,
  totalReceivable = '৳ 2.18Cr',
  onViewAgingLedger
}) => {
  const getBarColor = (range: string) => {
    if (range.includes('0-30')) return 'bg-[#0E5A4F]';
    if (range.includes('31-60')) return 'bg-[#22A06B]';
    if (range.includes('61-90')) return 'bg-[#D9A441]';
    return 'bg-[#D9534F]';
  };

  return (
    <div
      onClick={onViewAgingLedger}
      className="bg-white border border-[#E5EAE8] rounded-xl p-4 shadow-xs hover:border-[#CBD5E1] transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex justify-between items-baseline mb-1">
        <div className="font-bold text-sm text-[#18211F] group-hover:text-[#0E5A4F] transition-colors">
          Receivable Aging
        </div>
        <div className="text-[10px] text-[#71807B] font-semibold">
          Total: {totalReceivable}
        </div>
      </div>

      {/* Progress Bars List */}
      <div className="space-y-2.5 mt-3">
        {agingData.map((item) => (
          <div key={item.range}>
            <div className="flex justify-between text-[10px] mb-1 font-semibold">
              <span className="text-[#71807B]">{item.range}</span>
              <span className={item.range === '90+ days' ? 'text-[#D9534F]' : 'text-[#18211F]'}>
                {item.percentage}%
              </span>
            </div>

            {/* Horizontal Bar Track */}
            <div className="h-1.5 w-full bg-[#F6F8F7] rounded-full overflow-hidden border border-[#E5EAE8]/30">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(item.range)}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
