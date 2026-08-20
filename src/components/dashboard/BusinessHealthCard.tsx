import React from 'react';
import { BusinessHealthItem } from '../../types';

interface BusinessHealthCardProps {
  businesses: BusinessHealthItem[];
  onSelectBusiness?: (business: BusinessHealthItem) => void;
  onViewAll?: () => void;
  isCompactSection?: boolean;
}

export const BusinessHealthCard: React.FC<BusinessHealthCardProps> = ({
  businesses,
  onSelectBusiness,
  onViewAll,
  isCompactSection = false
}) => {
  // Show top 4 from the screenshot / dataset
  const displayItems = businesses.slice(0, 4);

  const content = (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#71807B] flex items-center gap-1.5">
          <span>Business Health</span>
        </h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-[10px] font-semibold text-[#0E5A4F] hover:underline cursor-pointer"
          >
            View All Businesses →
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#E5EAE8] text-[#71807B] text-[10px]">
              <th className="pb-1.5 font-bold uppercase">Business</th>
              <th className="pb-1.5 font-bold uppercase text-right">Sales</th>
              <th className="pb-1.5 font-bold uppercase text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5EAE8]">
            {displayItems.map((biz) => (
              <tr
                key={biz.id}
                onClick={() => onSelectBusiness && onSelectBusiness(biz)}
                className="hover:bg-[#F6F8F7] cursor-pointer transition-colors group"
              >
                <td className="py-2 font-bold text-[#18211F] group-hover:text-[#0E5A4F] text-xs">
                  {biz.name}
                </td>
                <td className="py-2 text-right font-medium text-[#18211F] text-xs">
                  {biz.sales}
                </td>
                <td className="py-2 text-right">
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      biz.status === 'Healthy'
                        ? 'bg-[#E6F4ED] text-[#22A06B]'
                        : 'bg-[#FEF6E7] text-[#D9A441]'
                    }`}
                  >
                    {biz.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (isCompactSection) {
    return <div className="mt-4 border-t border-[#E5EAE8] pt-3.5">{content}</div>;
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-[#E5EAE8] shadow-xs flex flex-col justify-between h-full">
      {content}
    </div>
  );
};
