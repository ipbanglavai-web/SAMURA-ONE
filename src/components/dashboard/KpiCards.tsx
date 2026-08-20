import React from 'react';
import { KpiItem } from '../../types';
import {
  ArrowUpRight,
  TrendingUp,
  CircleDot,
  Landmark,
  AlertCircle,
  Boxes
} from 'lucide-react';

interface KpiCardsProps {
  kpis: KpiItem[];
  onCardClick?: (kpiId: string) => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpis, onCardClick }) => {
  const getIcon = (name: KpiItem['iconName']) => {
    switch (name) {
      case 'sales':
        return <TrendingUp className="w-3.5 h-3.5 text-[#0E5A4F]" />;
      case 'collection':
        return <CircleDot className="w-3.5 h-3.5 text-[#0E5A4F]" />;
      case 'bank':
        return <Landmark className="w-3.5 h-3.5 text-[#0E5A4F]" />;
      case 'receivable':
        return <AlertCircle className="w-3.5 h-3.5 text-[#D9534F]" />;
      case 'inventory':
        return <Boxes className="w-3.5 h-3.5 text-[#D9A441]" />;
    }
  };

  const getBadge = (kpi: KpiItem) => {
    switch (kpi.id) {
      case 'kpi-sales':
        return <span className="text-[#22A06B] text-[11px] font-bold">+8.4%</span>;
      case 'kpi-collection':
        return <span className="text-[#0E5A4F] text-[11px] font-bold">73.8%</span>;
      case 'kpi-cash-bank':
        return <span className="text-[#0E5A4F] text-[11px] font-bold">13 A/C</span>;
      case 'kpi-receivable':
        return <span className="text-[#D9534F] text-[11px] font-bold">-৳38.5L</span>;
      case 'kpi-inventory':
        return <span className="text-[#D9A441] text-[11px] font-bold">Aging Risk</span>;
      default:
        return <span className="text-[#71807B] text-[11px] font-bold">{kpi.secondary}</span>;
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          id={`kpi-card-${kpi.id}`}
          onClick={() => onCardClick && onCardClick(kpi.id)}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#E5EAE8] shadow-2xs hover:border-[#0E5A4F] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
        >
          {/* Top Row: Icon + Badge */}
          <div className="flex justify-between items-start">
            <div className="p-1.5 bg-[#F6F8F7] rounded-lg text-xs border border-[#E5EAE8]/60">
              {getIcon(kpi.iconName)}
            </div>
            {getBadge(kpi)}
          </div>

          {/* Metric Details */}
          <div>
            <div className="text-[11px] text-[#71807B] font-bold uppercase mt-2.5 tracking-tight truncate">
              {kpi.title}
            </div>
            <div className="text-xl sm:text-2xl font-bold mt-0.5 text-[#18211F] tracking-tight">
              {kpi.value}
            </div>
            <div className="text-[10px] text-[#71807B] mt-0.5 font-medium truncate">
              {kpi.secondary}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
