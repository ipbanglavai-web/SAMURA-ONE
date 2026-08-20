import React, { useState } from 'react';
import { Settings, Shield, Key, Bell, Globe, Save, CheckCircle2, Lock } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [currencyFormat, setCurrencyFormat] = useState('bdt_subcontinent');
  const [alertThresholdReceivable, setAlertThresholdReceivable] = useState('60');
  const [coldRoomTolerance, setColdRoomTolerance] = useState('2.0');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-5 pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#18211F] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#0E5A4F]" />
            <span>Settings & Governance</span>
          </h2>
          <p className="text-xs text-[#71807B] mt-0.5">
            Enterprise parameters, security thresholds, and system governance
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#DCFCE7] text-[#166534] rounded-lg text-xs font-semibold animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#22A06B]" />
            <span>Configuration Saved</span>
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* Governance & RBAC */}
        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F4]">
            <Shield className="w-4 h-4 text-[#0E5A4F]" />
            <h3 className="text-sm font-bold text-[#18211F]">Executive Access & Governance</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#71807B] uppercase tracking-wider mb-1">
                Active Super-Admin Account
              </label>
              <input
                type="text"
                disabled
                value="Md. Labibul Haque Sabuz (Founder & MD)"
                className="w-full p-2.5 bg-[#F8FAF9] border border-[#E5EAE8] rounded-lg text-[#18211F] font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#71807B] uppercase tracking-wider mb-1">
                Security Protocol
              </label>
              <input
                type="text"
                disabled
                value="Hardware 2FA & IP Whitelisting Active"
                className="w-full p-2.5 bg-[#F8FAF9] border border-[#E5EAE8] rounded-lg text-[#22A06B] font-medium"
              />
            </div>
          </div>
        </div>

        {/* Currency & Financial Standards */}
        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F4]">
            <Globe className="w-4 h-4 text-[#0E5A4F]" />
            <h3 className="text-sm font-bold text-[#18211F]">Financial Format & Currency Standard</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#71807B] uppercase tracking-wider mb-1">
                Denomination Scale
              </label>
              <select
                value={currencyFormat}
                onChange={(e) => setCurrencyFormat(e.target.value)}
                className="w-full p-2.5 bg-[#F6F8F7] border border-[#E5EAE8] rounded-lg text-[#18211F] font-medium focus:border-[#0E5A4F] focus:outline-none"
              >
                <option value="bdt_subcontinent">Bangladeshi Taka (৳) · Lakhs (L) & Crores (Cr)</option>
                <option value="bdt_millions">Bangladeshi Taka (৳) · Millions & Billions</option>
                <option value="usd">US Dollar ($) · International Format</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#71807B] uppercase tracking-wider mb-1">
                Financial Fiscal Year
              </label>
              <input
                type="text"
                disabled
                value="FY 2026-2027 (Starts July 01)"
                className="w-full p-2.5 bg-[#F8FAF9] border border-[#E5EAE8] rounded-lg text-[#18211F] font-medium"
              />
            </div>
          </div>
        </div>

        {/* Automated Alert Triggers */}
        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F4]">
            <Bell className="w-4 h-4 text-[#0E5A4F]" />
            <h3 className="text-sm font-bold text-[#18211F]">Automated Critical Alert Triggers</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#71807B] uppercase tracking-wider mb-1">
                Receivable Overdue Trigger (Days)
              </label>
              <input
                type="number"
                value={alertThresholdReceivable}
                onChange={(e) => setAlertThresholdReceivable(e.target.value)}
                className="w-full p-2.5 bg-[#F6F8F7] border border-[#E5EAE8] rounded-lg text-[#18211F] font-medium focus:border-[#0E5A4F] focus:outline-none"
              />
              <span className="text-[11px] text-[#71807B] mt-1 block">Alert when invoices exceed 60 days overdue</span>
            </div>

            <div>
              <label className="block font-semibold text-[#71807B] uppercase tracking-wider mb-1">
                Cold Storage Max Deviation (°C)
              </label>
              <input
                type="number"
                step="0.5"
                value={coldRoomTolerance}
                onChange={(e) => setColdRoomTolerance(e.target.value)}
                className="w-full p-2.5 bg-[#F6F8F7] border border-[#E5EAE8] rounded-lg text-[#18211F] font-medium focus:border-[#0E5A4F] focus:outline-none"
              />
              <span className="text-[11px] text-[#71807B] mt-1 block">Trigger alarm when temperature exceeds setpoint by 2.0°C</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#0E5A4F] hover:bg-[#135E54] active:bg-[#0B4A40] text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Governance Parameters</span>
          </button>
        </div>
      </form>
    </div>
  );
};
