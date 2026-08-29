import React, { useState, useRef } from 'react';
import { useLogo } from '../../context/LogoContext';
import { LogoUploadModal, LogoTarget } from '../../components/modals/LogoUploadModal';
import {
  Settings,
  Shield,
  Key,
  Bell,
  Globe,
  Save,
  CheckCircle2,
  Lock,
  Image as ImageIcon,
  Upload,
  Trash2,
  KeyRound,
  LayoutDashboard
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    customLogo,
    loginLogo,
    resetLogo,
    resetLoginLogo,
    uploadLogoFile
  } = useLogo();
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<LogoTarget>('login');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [currencyFormat, setCurrencyFormat] = useState('bdt_subcontinent');
  const [alertThresholdReceivable, setAlertThresholdReceivable] = useState('60');
  const [coldRoomTolerance, setColdRoomTolerance] = useState('2.0');

  const loginFileInputRef = useRef<HTMLInputElement>(null);
  const systemFileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: LogoTarget) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadLogoFile(file, target);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      alert(err.message || 'Failed to upload image');
    }
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
            Enterprise parameters, branding logos, login page branding, security thresholds, and system governance
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#DCFCE7] text-[#166534] rounded-lg text-xs font-semibold animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#22A06B]" />
            <span>Configuration Saved</span>
          </div>
        )}
      </div>

      {/* Hidden file inputs for direct upload */}
      <input
        type="file"
        ref={loginFileInputRef}
        onChange={(e) => handleDirectUpload(e, 'login')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={systemFileInputRef}
        onChange={(e) => handleDirectUpload(e, 'system')}
        accept="image/*"
        className="hidden"
      />

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-4">
        {/* Brand Identity & Logo Customization Section */}
        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F4]">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#0E5A4F]" />
              <h3 className="text-sm font-bold text-[#18211F]">Enterprise Branding & Logos</h3>
            </div>
            <span className="text-[11px] font-medium text-[#22A06B] bg-[#E8F6F0] px-2.5 py-1 rounded-full">
              Live Real-Time Sync
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Login Page Logo */}
            <div className="p-4 rounded-xl border border-[#E5EAE8] bg-[#F8FAF9] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#0E5A4F]" />
                    <h4 className="text-xs font-bold text-[#18211F] uppercase tracking-wider">
                      Login Page Logo
                    </h4>
                  </div>
                  {loginLogo ? (
                    <span className="text-[10px] font-bold text-[#22A06B] bg-[#DCFCE7] px-2 py-0.5 rounded">
                      Custom Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-[#71807B] bg-[#E5EAE8] px-2 py-0.5 rounded">
                      Default Mark
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#71807B] mb-3">
                  Displayed on the public login portal, gateway header, and authentication card.
                </p>

                <div className="w-full h-24 rounded-lg bg-white border border-[#E5EAE8] flex items-center justify-center p-2 mb-3 shadow-inner">
                  {loginLogo ? (
                    <img
                      src={loginLogo}
                      alt="Login Page Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="h-12 px-3 rounded-lg bg-[#0E5A4F] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                      <span>SAMURA ONE (Default)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-[#E5EAE8]">
                <button
                  type="button"
                  onClick={() => {
                    setModalInitialTab('login');
                    setLogoModalOpen(true);
                  }}
                  className="flex-1 py-2 px-3 bg-[#0E5A4F] hover:bg-[#073F37] text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{loginLogo ? 'Change Login Logo' : 'Upload Login Logo'}</span>
                </button>

                {loginLogo && (
                  <button
                    type="button"
                    onClick={resetLoginLogo}
                    title="Reset to default logo"
                    className="p-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Card 2: Main System / Dashboard Logo */}
            <div className="p-4 rounded-xl border border-[#E5EAE8] bg-[#F8FAF9] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4 text-[#0E5A4F]" />
                    <h4 className="text-xs font-bold text-[#18211F] uppercase tracking-wider">
                      System & Dashboard Logo
                    </h4>
                  </div>
                  {customLogo ? (
                    <span className="text-[10px] font-bold text-[#22A06B] bg-[#DCFCE7] px-2 py-0.5 rounded">
                      Custom Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-[#71807B] bg-[#E5EAE8] px-2 py-0.5 rounded">
                      Default Mark
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#71807B] mb-3">
                  Displayed in the top navigation bar, collapsible sidebar, sales vouchers & PDF invoices.
                </p>

                <div className="w-full h-24 rounded-lg bg-white border border-[#E5EAE8] flex items-center justify-center p-2 mb-3 shadow-inner">
                  {customLogo ? (
                    <img
                      src={customLogo}
                      alt="System Dashboard Logo"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-[#0E5A4F] text-white flex flex-col items-center justify-center font-bold text-xs shadow-2xs">
                      <span className="leading-tight text-center">SAMURA<br/>ONE</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-[#E5EAE8]">
                <button
                  type="button"
                  onClick={() => {
                    setModalInitialTab('system');
                    setLogoModalOpen(true);
                  }}
                  className="flex-1 py-2 px-3 bg-[#0E5A4F] hover:bg-[#073F37] text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{customLogo ? 'Change System Logo' : 'Upload System Logo'}</span>
                </button>

                {customLogo && (
                  <button
                    type="button"
                    onClick={resetLogo}
                    title="Reset to default logo"
                    className="p-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

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

      {/* Brand Logo Upload Modal */}
      <LogoUploadModal
        isOpen={logoModalOpen}
        initialTab={modalInitialTab}
        onClose={() => setLogoModalOpen(false)}
      />
    </div>
  );
};
