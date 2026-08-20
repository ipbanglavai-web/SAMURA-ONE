import React from 'react';
import { IMPORT_SHIPMENTS_DATA } from '../../data/mockData';
import { Ship, Anchor, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const ImportShipmentsPage: React.FC = () => {
  return (
    <div className="space-y-5 pb-10">
      {/* Top Shipment KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Active Import Pipeline</span>
            <Ship className="w-4 h-4 text-[#0E5A4F]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">40 Containers</p>
          <p className="text-xs text-[#71807B] mt-1">4 Active International LCs</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Total Consignment Value</span>
            <Anchor className="w-4 h-4 text-[#0E5A4F]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">৳ 5.32Cr</p>
          <p className="text-xs text-[#22A06B] font-medium mt-1">Port clearance underway at Chittagong</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Landed Cost Variance</span>
            <AlertTriangle className="w-4 h-4 text-[#D9A441]" />
          </div>
          <p className="text-2xl font-bold text-[#D9A441] mt-2 font-['Inter',sans-serif]">+6.8% Egypt</p>
          <p className="text-xs text-[#D9A441] font-medium mt-1">Shipping line demurrage variance flagged</p>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-xl border border-[#E5EAE8] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#E5EAE8]">
          <h3 className="text-base font-bold text-[#18211F]">Live Import Cargo & Sea Freight Tracking</h3>
          <p className="text-xs text-[#71807B] mt-0.5">Customs assessment, reefer container temperature & clearance timeline</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-[#71807B] border-b border-[#E5EAE8] uppercase font-semibold">
              <tr>
                <th className="py-3 px-5">LC & Consignment</th>
                <th className="py-3 px-5">Origin & Vessel</th>
                <th className="py-3 px-5">ETA / Arrival</th>
                <th className="py-3 px-5 text-right">Budget Cost</th>
                <th className="py-3 px-5 text-right">Actual / Est. Cost</th>
                <th className="py-3 px-5 text-right">Cost Variance</th>
                <th className="py-3 px-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F4]">
              {IMPORT_SHIPMENTS_DATA.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-[#F6F8F7] transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-[#18211F]">{shipment.commodity}</div>
                    <div className="text-[11px] font-mono text-[#0E5A4F]">{shipment.lcNumber} · {shipment.containers} Reefers</div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="text-[#18211F] font-medium">{shipment.origin}</div>
                    <div className="text-[11px] text-[#71807B]">{shipment.vesselName}</div>
                  </td>
                  <td className="py-3.5 px-5 font-medium text-[#18211F]">{shipment.eta}</td>
                  <td className="py-3.5 px-5 text-right font-medium text-[#71807B]">{shipment.budgetLandedCost}</td>
                  <td className="py-3.5 px-5 text-right font-bold text-[#18211F]">{shipment.actualEstimatedCost}</td>
                  <td className="py-3.5 px-5 text-right">
                    <span
                      className={`font-semibold ${
                        shipment.variancePercent > 0 ? 'text-[#D9534F]' : 'text-[#22A06B]'
                      }`}
                    >
                      {shipment.variancePercent > 0 ? `+${shipment.variancePercent}%` : `${shipment.variancePercent}%`}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        shipment.status === 'Port Clearance'
                          ? 'bg-[#FEF3C7] text-[#B45309]'
                          : shipment.status === 'At Sea'
                          ? 'bg-[#E0F2FE] text-[#0369A1]'
                          : 'bg-[#DCFCE7] text-[#166534]'
                      }`}
                    >
                      <span>{shipment.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
