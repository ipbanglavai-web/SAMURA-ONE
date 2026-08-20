import React from 'react';
import { COLD_STORAGE_CHAMBERS } from '../../data/mockData';
import { Snowflake, Thermometer, Droplets, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export const ColdStoragePage: React.FC = () => {
  return (
    <div className="space-y-5 pb-10">
      {/* Top Banner Alert for Cold Room Excursion */}
      <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-4 flex items-center justify-between text-xs text-[#92400E]">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />
          <span>
            <strong>Chamber C-02 Telemetry Alert:</strong> 2 temperature deviations logged during defrost cycle (3.4°C vs 0.5°C setpoint). Acknowledged by Plant Engineer. Compressor restored.
          </span>
        </div>
        <span className="font-semibold bg-[#F59E0B]/20 px-2 py-0.5 rounded text-[#92400E]">Monitored</span>
      </div>

      {/* Grid of Cold Storage Chambers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COLD_STORAGE_CHAMBERS.map((chamber) => (
          <div
            key={chamber.id}
            className={`bg-white rounded-xl p-5 border shadow-2xs transition-all ${
              chamber.status === 'Deviation'
                ? 'border-[#FDE68A] ring-1 ring-[#FDE68A]'
                : 'border-[#E5EAE8]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${chamber.status === 'Deviation' ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#E0F2FE] text-[#0284C7]'}`}>
                  <Snowflake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[#18211F] text-sm">{chamber.name}</h3>
                  <span className="text-[11px] text-[#71807B]">{chamber.commodity}</span>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                  chamber.status === 'Normal'
                    ? 'bg-[#DCFCE7] text-[#166534]'
                    : 'bg-[#FEF3C7] text-[#B45309]'
                }`}
              >
                <span>{chamber.status}</span>
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#F1F5F4]">
              <div className="p-2.5 bg-[#F8FAF9] rounded-lg">
                <div className="flex items-center gap-1 text-[11px] text-[#71807B]">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>Real Temp</span>
                </div>
                <span className={`text-lg font-bold block mt-1 ${chamber.status === 'Deviation' ? 'text-[#D97706]' : 'text-[#18211F]'}`}>
                  {chamber.temperature}°C
                </span>
                <span className="text-[10px] text-[#71807B]">Set: {chamber.setPoint}°C</span>
              </div>

              <div className="p-2.5 bg-[#F8FAF9] rounded-lg">
                <div className="flex items-center gap-1 text-[11px] text-[#71807B]">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Rel. Humidity</span>
                </div>
                <span className="text-lg font-bold text-[#18211F] block mt-1">
                  {chamber.humidity}%
                </span>
                <span className="text-[10px] text-[#22A06B]">Optimal RH</span>
              </div>
            </div>

            {/* Capacity Bar */}
            <div className="mt-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs text-[#71807B]">
                <span>Storage Utilization</span>
                <span className="font-semibold text-[#18211F]">{chamber.capacityUsed} / {chamber.totalCapacityTons} Tons</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#F1F5F4] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#0E5A4F]"
                  style={{ width: `${(chamber.capacityUsed / chamber.totalCapacityTons) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
