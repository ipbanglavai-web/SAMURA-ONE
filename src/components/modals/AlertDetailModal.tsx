import React from 'react';
import { CriticalAlert } from '../../types';
import { X, AlertTriangle, Zap, Snowflake, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';

interface AlertDetailModalProps {
  alert: CriticalAlert | null;
  onClose: () => void;
  onResolve: (id: string) => void;
  onNavigateToModule?: (type: CriticalAlert['type']) => void;
}

export const AlertDetailModal: React.FC<AlertDetailModalProps> = ({
  alert,
  onClose,
  onResolve,
  onNavigateToModule
}) => {
  if (!alert) return null;

  const getAlertIcon = (type: CriticalAlert['type']) => {
    switch (type) {
      case 'receivable':
        return <AlertTriangle className="w-5 h-5 text-[#D97706]" />;
      case 'shipment':
        return <Zap className="w-5 h-5 text-[#D97706]" />;
      case 'coldroom':
        return <Snowflake className="w-5 h-5 text-[#0284C7]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E5EAE8] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#073F37] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#D9A441]" />
            <div>
              <h3 className="font-semibold text-base">Critical Operational Alert</h3>
              <p className="text-xs text-[#A3B8B0]">Executive Risk Investigation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#A3B8B0] hover:text-white hover:bg-[#0E5A4F] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-sm text-[#18211F]">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#FEF3C7] rounded-xl shrink-0 mt-0.5">
              {getAlertIcon(alert.type)}
            </div>
            <div>
              <h4 className="text-base font-bold text-[#18211F]">{alert.title}</h4>
              <p className="text-xs text-[#71807B] mt-0.5">Reported {alert.time} · Status: {alert.status.toUpperCase()}</p>
            </div>
          </div>

          <div className="p-4 bg-[#F6F8F7] rounded-xl border border-[#E5EAE8] space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#71807B]">Impact Summary</span>
            <p className="text-sm font-medium text-[#18211F] leading-relaxed">{alert.description}</p>
            
            <div className="pt-2 text-xs text-[#71807B] border-t border-[#E5EAE8] space-y-1">
              <p>• Automated telemetry detection through ERP threshold monitoring.</p>
              <p>• Department supervisor and branch accountant notified.</p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 bg-[#F8FAF9] border-t border-[#E5EAE8] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onNavigateToModule && onNavigateToModule(alert.type);
              onClose();
            }}
            className="px-3.5 py-2 text-xs font-semibold text-[#0E5A4F] hover:bg-[#0E5A4F]/10 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open Dedicated Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-[#71807B] hover:text-[#18211F] hover:bg-[#E5EAE8] rounded-lg transition-colors cursor-pointer"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={() => {
                onResolve(alert.id);
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0E5A4F] hover:bg-[#135E54] rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Acknowledge & Mark Resolved</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
