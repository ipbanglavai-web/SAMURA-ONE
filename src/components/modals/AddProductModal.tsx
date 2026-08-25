import React, { useState } from 'react';
import { UnitProduct } from '../../types';
import { Package, X, Check, AlertCircle, DollarSign, Layers } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessName: string;
  onAddProduct: (product: Omit<UnitProduct, 'id'>) => void;
}

const COMMON_UNITS = [
  'Kg',
  'Carton (15 Kg)',
  'Carton (18 Kg)',
  'Carton (12 Kg)',
  'Carton (14 Kg)',
  'Box (10 Kg)',
  'Box (16 Kg)',
  'Piece',
  'Gram (1g Pack)',
  'Ton',
  'Bag (50 Kg)',
  'Liter'
];

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  businessId,
  businessName,
  onAddProduct
}) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('Carton (15 Kg)');
  const [customUnit, setCustomUnit] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('প্রোডাক্টের নাম লিখুন (Product name is required).');
      return;
    }

    const finalUnit = customUnit.trim() || unit;
    if (!finalUnit.trim()) {
      setError('প্রোডাক্ট ইউনিট সিলেক্ট করুন বা লিখুন (Product unit is required).');
      return;
    }

    const priceNum = parseFloat(unitPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('সঠিক ইউনিট মূল্য নির্ধারণ করুন (Valid unit price is required).');
      return;
    }

    const stockNum = stock ? parseInt(stock, 10) : 0;

    onAddProduct({
      businessId,
      name: name.trim(),
      unit: finalUnit.trim(),
      unitPrice: priceNum,
      category: category.trim() || 'General',
      stock: isNaN(stockNum) ? 0 : stockNum,
      notes: notes.trim(),
      createdAt: new Date().toISOString().split('T')[0]
    });

    // Reset & close
    setName('');
    setUnitPrice('');
    setCustomUnit('');
    setCategory('');
    setStock('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-['Inter',sans-serif]">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#E5EAE8] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0E5A4F] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Package className="w-5 h-5 text-[#22A06B]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">নতুন প্রোডাক্ট যুক্ত করুন</h2>
              <p className="text-xs text-[#A3B8B0]">{businessName} · Unit Inventory Entry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-[#D9534F]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-[#18211F] uppercase tracking-wider mb-1.5">
              প্রোডাক্টের নাম (Product Name) <span className="text-red-500">*</span>
            </label>
            <input
              id="product-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Egyptian Valencia Orange, South African Apple"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5EAE8] bg-[#F6F8F7] text-sm text-[#18211F] focus:bg-white focus:border-[#0E5A4F] focus:ring-1 focus:ring-[#0E5A4F] focus:outline-none transition-all"
            />
          </div>

          {/* Unit Selection */}
          <div>
            <label className="block text-xs font-bold text-[#18211F] uppercase tracking-wider mb-1.5">
              প্রোডাক্ট ইউনিট (Product Unit) <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_UNITS.slice(0, 6).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => {
                    setUnit(u);
                    setCustomUnit('');
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    unit === u && !customUnit
                      ? 'bg-[#0E5A4F] text-white'
                      : 'bg-[#F6F8F7] text-[#71807B] hover:bg-[#E5EAE8]'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={unit}
                onChange={(e) => {
                  setUnit(e.target.value);
                  setCustomUnit('');
                }}
                className="w-full px-3 py-2 rounded-lg border border-[#E5EAE8] bg-[#F6F8F7] text-xs text-[#18211F] focus:bg-white focus:border-[#0E5A4F] focus:outline-none"
              >
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value)}
                placeholder="বা কাস্টম ইউনিট লিখুন"
                className="w-full px-3 py-2 rounded-lg border border-[#E5EAE8] bg-[#F6F8F7] text-xs text-[#18211F] focus:bg-white focus:border-[#0E5A4F] focus:outline-none"
              />
            </div>
          </div>

          {/* Unit Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#18211F] uppercase tracking-wider mb-1.5">
                ইউনিট প্রতি মূল্য (Unit/Price ৳) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-bold text-sm text-[#0E5A4F]">
                  ৳
                </span>
                <input
                  id="product-price-input"
                  type="number"
                  required
                  min="0"
                  step="any"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="2850"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-[#E5EAE8] bg-[#F6F8F7] text-sm font-semibold text-[#18211F] focus:bg-white focus:border-[#0E5A4F] focus:ring-1 focus:ring-[#0E5A4F] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18211F] uppercase tracking-wider mb-1.5">
                প্রাথমিক স্টক পরিমাণ (Initial Stock)
              </label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="400"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5EAE8] bg-[#F6F8F7] text-sm text-[#18211F] focus:bg-white focus:border-[#0E5A4F] focus:outline-none"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-[#18211F] uppercase tracking-wider mb-1.5">
              ক্যাটাগরি (Category / গ্রুপ)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Citrus, Fresh Fruits, Spices, Refrigerated"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5EAE8] bg-[#F6F8F7] text-sm text-[#18211F] focus:bg-white focus:border-[#0E5A4F] focus:outline-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-[#18211F] uppercase tracking-wider mb-1.5">
              মন্তব্য বা বিবরণ (Notes / Spec)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Grade A Premium Import Batch"
              className="w-full px-3.5 py-2 rounded-lg border border-[#E5EAE8] bg-[#F6F8F7] text-xs text-[#18211F] focus:bg-white focus:border-[#0E5A4F] focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#E5EAE8] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-[#E5EAE8] text-xs font-bold text-[#71807B] hover:bg-[#F6F8F7] transition-colors cursor-pointer"
            >
              বাতিল (Cancel)
            </button>
            <button
              id="save-product-btn"
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#0E5A4F] hover:bg-[#073F37] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>প্রোডাক্ট সেভ করুন (Save Product)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
