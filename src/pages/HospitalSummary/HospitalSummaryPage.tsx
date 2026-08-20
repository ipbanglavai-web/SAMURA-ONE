import React from 'react';
import { PlusSquare, Users, Activity, BedDouble, Stethoscope, HeartPulse } from 'lucide-react';

export const HospitalSummaryPage: React.FC = () => {
  return (
    <div className="space-y-5 pb-10">
      {/* Top Hospital Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Daily Hospital Revenue</span>
            <Activity className="w-4 h-4 text-[#0E5A4F]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">৳ 2.40L</p>
          <p className="text-xs text-[#22A06B] font-medium mt-1">98.2% Direct Cash Collection</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Today's OPD Consultations</span>
            <Users className="w-4 h-4 text-[#0E5A4F]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">142 Patients</p>
          <p className="text-xs text-[#71807B] mt-1">General Medicine, Cardiology & Orthopedics</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">IPD Bed Occupancy</span>
            <BedDouble className="w-4 h-4 text-[#0E5A4F]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">84%</p>
          <p className="text-xs text-[#22A06B] font-medium mt-1">42 / 50 Inpatient Beds Active</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71807B] font-medium">Pharmacy Daily Dispense</span>
            <Stethoscope className="w-4 h-4 text-[#0E5A4F]" />
          </div>
          <p className="text-2xl font-bold text-[#18211F] mt-2 font-['Inter',sans-serif]">৳ 95,400</p>
          <p className="text-xs text-[#22A06B] font-medium mt-1">100% computerized inventory</p>
        </div>
      </div>

      {/* Hospital Department Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <h3 className="text-base font-bold text-[#18211F] mb-3 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#0E5A4F]" />
            <span>Emergency & Diagnostic Services</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAF9] rounded-lg">
              <span className="text-[#18211F] font-medium">24/7 Emergency Admissions</span>
              <span className="font-bold text-[#18211F]">18 Cases</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAF9] rounded-lg">
              <span className="text-[#18211F] font-medium">Digital X-Ray & Ultrasonography</span>
              <span className="font-bold text-[#18211F]">36 Tests Completed</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAF9] rounded-lg">
              <span className="text-[#18211F] font-medium">Pathology Lab Tests</span>
              <span className="font-bold text-[#18211F]">94 Samples</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs">
          <h3 className="text-base font-bold text-[#18211F] mb-3 flex items-center gap-2">
            <PlusSquare className="w-4 h-4 text-[#0E5A4F]" />
            <span>Critical Supplies & Oxygen Telemetry</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAF9] rounded-lg">
              <span className="text-[#18211F] font-medium">Central Oxygen Manifold</span>
              <span className="font-bold text-[#22A06B]">92% Pressure (Optimal)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAF9] rounded-lg">
              <span className="text-[#18211F] font-medium">Backup Generator Diesel Reserve</span>
              <span className="font-bold text-[#18211F]">1,800 Liters (Full)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-[#F8FAF9] rounded-lg">
              <span className="text-[#18211F] font-medium">Emergency Blood Bank Reserves</span>
              <span className="font-bold text-[#18211F]">Available (All groups)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
