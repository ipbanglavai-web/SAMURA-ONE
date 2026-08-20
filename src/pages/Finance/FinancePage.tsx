import React, { useState } from 'react';
import { BankAccount } from '../../types';
import { BANK_ACCOUNTS_DATA } from '../../data/mockData';
import { Landmark, ArrowDownLeft, ArrowUpRight, ShieldCheck, Wallet, Search, Filter } from 'lucide-react';

export const FinancePage: React.FC = () => {
  const [bankAccounts] = useState<BankAccount[]>(BANK_ACCOUNTS_DATA);
  const [search, setSearch] = useState('');

  const filteredAccounts = bankAccounts.filter(b =>
    b.bankName.toLowerCase().includes(search.toLowerCase()) ||
    b.branch.toLowerCase().includes(search.toLowerCase()) ||
    b.accountNumber.includes(search)
  );

  return (
    <div className="space-y-5 pb-10">
      {/* Top Treasury Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Total Cash & Bank</span>
            <Wallet className="w-4 h-4 text-[#0E5A4F]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">৳ 3.74Cr</p>
          <p className="text-xs text-[#22A06B] font-medium mt-1">13 Corporate Accounts Verified</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Today's Inflows</span>
            <ArrowDownLeft className="w-4 h-4 text-[#22A06B]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">৳ 31.6L</p>
          <p className="text-xs text-[#71807B] mt-1">Direct Bank Deposits & RTGS</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Today's Disbursements</span>
            <ArrowUpRight className="w-4 h-4 text-[#D9534F]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">৳ 18.2L</p>
          <p className="text-xs text-[#71807B] mt-1">Port clearance & supplier payments</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Active LC Limits</span>
            <ShieldCheck className="w-4 h-4 text-[#0E5A4F]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">৳ 8.50Cr</p>
          <p className="text-xs text-[#71807B] mt-1">৳ 3.42Cr utilized (40.2%)</p>
        </div>
      </div>

      {/* Bank Accounts Table */}
      <div className="bg-white rounded-xl border border-[#E5EAE8] shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-[#E5EAE8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#18211F] tracking-tight flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#0E5A4F]" />
              <span>Corporate Bank Balances (13 Accounts)</span>
            </h3>
            <p className="text-xs text-[#71807B] mt-0.5">Real-time synchronized ledger balances</p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71807B]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search bank, account, branch..."
              className="text-xs pl-9 pr-3 py-1.5 bg-[#F6F8F7] border border-[#E5EAE8] rounded-lg focus:outline-none focus:border-[#0E5A4F] text-[#18211F] placeholder-[#71807B] w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] text-[#71807B] border-b border-[#E5EAE8] uppercase font-semibold">
              <tr>
                <th className="py-3 px-5">Bank Institution</th>
                <th className="py-3 px-5">Account Number</th>
                <th className="py-3 px-5">Branch</th>
                <th className="py-3 px-5">Account Type</th>
                <th className="py-3 px-5 text-right">Available Balance</th>
                <th className="py-3 px-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F4]">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-[#F6F8F7] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-[#18211F]">{account.bankName}</td>
                  <td className="py-3.5 px-5 font-mono text-[#71807B]">{account.accountNumber}</td>
                  <td className="py-3.5 px-5 text-[#71807B]">{account.branch}</td>
                  <td className="py-3.5 px-5 text-[#71807B]">{account.type}</td>
                  <td className="py-3.5 px-5 text-right font-bold text-[#18211F] text-sm font-['Inter',sans-serif]">
                    {account.balance}
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#DCFCE7] text-[#166534]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22A06B]"></span>
                      <span>{account.status}</span>
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
