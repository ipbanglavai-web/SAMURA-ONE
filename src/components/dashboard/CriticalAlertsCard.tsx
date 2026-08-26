import React from 'react';
import { CriticalAlert } from '../../types';

interface CriticalAlertsCardProps {
  alerts: CriticalAlert[];
  onAlertClick?: (alert: CriticalAlert) => void;
}

export const CriticalAlertsCard: React.FC<CriticalAlertsCardProps> = ({ alerts, onAlertClick }) => {
  const getAlertStyle = (type: CriticalAlert['type']) => {
    switch (type) {
      case 'receivable':
        return 'bg-red-50/80 border-l-2 border-red-500 hover:bg-red-100/60';
      case 'shipment':
        return 'bg-amber-50/80 border-l-2 border-amber-500 hover:bg-amber-100/60';
      case 'coldroom':
        return 'bg-blue-50/80 border-l-2 border-blue-500 hover:bg-blue-100/60';
    }
  };

  return (
    <div className="bg-white border border-[#E5EAE8] rounded-xl p-4 shadow-xs">
      {/* Header */}
      <div className="font-bold text-sm mb-3 flex items-center justify-between text-[#18211F]">
        <div className="flex items-center gap-1.5">
          <span>Critical Alerts</span>
        </div>
        <span className="text-[10px] text-[#71807B] font-semibold">
          {alerts.filter(a => a.status !== 'resolved').length} open
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-2.5">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => onAlertClick && onAlertClick(alert)}
            className={`p-2.5 rounded-lg transition-colors cursor-pointer ${getAlertStyle(alert.type)}`}
          >
            <div className="text-[11px] font-bold text-[#18211F]">
              {alert.title}
            </div>
            <div className="text-[10px] text-[#71807B] mt-0.5 leading-snug">
              {alert.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
