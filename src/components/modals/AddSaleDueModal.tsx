import React, { useState, useEffect } from 'react';
import { SaleDueRecord, UnitProduct, ManagerCustomer } from '../../types';
import {
  FileText,
  X,
  Check,
  Search,
  AlertCircle,
  Calendar,
  Calculator,
  User,
  MapPin,
  Building,
  Package,
  CreditCard,
  Plus,
  Users,
  UserCheck,
  Sparkles
} from 'lucide-react';

interface AddSaleDueModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessName: string;
  products: UnitProduct[];
  customers?: ManagerCustomer[];
  onAddRecord: (record: Omit<SaleDueRecord, 'id' | 'invoiceNo'>) => void;
  onOpenAddProductModal?: () => void;
}

export const AddSaleDueModal: React.FC<AddSaleDueModalProps> = ({
  isOpen,
  onClose,
  businessId,
  businessName,
  products,
  customers = [],
  onAddRecord,
  onOpenAddProductModal
}) => {
  // Mode: 'existing' or 'new'
  const [customerMode, setCustomerMode] = useState<'existing' | 'new'>(() =>
    customers.length > 0 ? 'existing' : 'new'
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);

  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [customerOf, setCustomerOf] = useState('');
  const [exDue, setExDue] = useState<string>('0');
  
  // Product Search & Selection
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  
  const [productQuantity, setProductQuantity] = useState<string>('1');
  const [customUnitPrice, setCustomUnitPrice] = useState<string>('');
  const [saleAmount, setSaleAmount] = useState<string>('');
  const [paid, setPaid] = useState<string>('0');
  const [sacrifice, setSacrifice] = useState<string>('0');
  const [duePaymentDate, setDuePaymentDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7); // Default 7 days later
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Filter customers for dropdown
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      c.address.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      (c.reference && c.reference.toLowerCase().includes(customerSearchTerm.toLowerCase()))
  );

  // Selected customer object
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Handle choosing existing customer
  const handleSelectCustomer = (cust: ManagerCustomer) => {
    setSelectedCustomerId(cust.id);
    setCustomerName(cust.name);
    setCustomerOf(cust.reference || 'Direct Party');
    setAddress(cust.phone ? `${cust.address} · ${cust.phone}` : cust.address);
    setExDue(cust.dueAmount ? cust.dueAmount.toString() : '0');
    setIsCustomerDropdownOpen(false);
    setCustomerSearchTerm('');
  };

  // Switch to new customer mode
  const handleSwitchToNewCustomer = () => {
    setCustomerMode('new');
    setSelectedCustomerId('');
    setCustomerName('');
    setCustomerOf('');
    setAddress('');
    setExDue('0');
  };

  // Switch to existing customer mode
  const handleSwitchToExistingCustomer = () => {
    setCustomerMode('existing');
    if (customers.length > 0) {
      handleSelectCustomer(customers[0]);
    }
  };

  // Selected product object
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Filtered products list for search
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(productSearchTerm.toLowerCase()))
  );

  // When selected product changes or quantity changes, auto-calculate sale amount
  useEffect(() => {
    if (selectedProduct) {
      const price = customUnitPrice ? parseFloat(customUnitPrice) : selectedProduct.unitPrice;
      const qty = parseFloat(productQuantity) || 0;
      if (!isNaN(price) && !isNaN(qty) && qty > 0) {
        setSaleAmount(Math.round(qty * price).toString());
      }
    }
  }, [selectedProductId, productQuantity, customUnitPrice]);

  // Set default product & customer when opening if available
  useEffect(() => {
    if (isOpen) {
      if (products.length > 0 && !selectedProductId) {
        setSelectedProductId(products[0].id);
        setCustomUnitPrice(products[0].unitPrice.toString());
      }
      if (customers.length > 0 && customerMode === 'existing' && !selectedCustomerId) {
        handleSelectCustomer(customers[0]);
      }
    }
  }, [isOpen, products, customers]);

  if (!isOpen) return null;

  // Numerical calculations
  const numExDue = parseFloat(exDue) || 0;
  const numAmount = parseFloat(saleAmount) || 0;
  const numSacrifice = parseFloat(sacrifice) || 0;
  const numPaid = parseFloat(paid) || 0;

  // Payable Due = (Ex-Due + Amount - Sacrifice)
  const payableDue = Math.max(0, numExDue + numAmount - numSacrifice);

  // Running Due = (Payable Due - Paid) = (Ex-Due + Amount - Sacrifice - Paid)
  const runningDue = Math.max(0, payableDue - numPaid);

  const handleSelectProduct = (prod: UnitProduct) => {
    setSelectedProductId(prod.id);
    setCustomUnitPrice(prod.unitPrice.toString());
    setProductSearchTerm('');
    setIsProductDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('কাস্টমারের নাম প্রদান করুন (Customer Name is required).');
      return;
    }

    if (!address.trim()) {
      setError('ঠিকানা ও যোগাযোগ নম্বর প্রদান করুন (Address with Contact is required).');
      return;
    }

    if (!customerOf.trim()) {
      setError('"Customer of" (মার্কেট বা ক্লাস্টার) প্রদান করুন.');
      return;
    }

    if (!selectedProduct) {
      setError('বিক্রয়কৃত পণ্য সিলেক্ট করুন (Please select a sold product).');
      return;
    }

    const qty = parseFloat(productQuantity);
    if (isNaN(qty) || qty <= 0) {
      setError('পণ্য পরিমাণ সঠিকভাবে লিখুন (Valid product quantity is required).');
      return;
    }

    if (isNaN(numAmount) || numAmount < 0) {
      setError('বিক্রয় মূল্য সঠিকভাবে লিখুন (Valid sale amount is required).');
      return;
    }

    // Determine status
    let status: 'Full Paid' | 'Partial Due' | 'Overdue' | 'Unpaid' = 'Partial Due';
    const todayStr = new Date().toISOString().split('T')[0];
    if (runningDue === 0) {
      status = 'Full Paid';
    } else if (duePaymentDate && duePaymentDate < todayStr) {
      status = 'Overdue';
    } else if (numPaid === 0) {
      status = 'Unpaid';
    } else {
      status = 'Partial Due';
    }

    onAddRecord({
      businessId,
      date: todayStr,
      customerName: customerName.trim(),
      address: address.trim(),
      customerOf: customerOf.trim(),
      exDue: numExDue,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productUnit: selectedProduct.unit,
      unitPrice: customUnitPrice ? parseFloat(customUnitPrice) : selectedProduct.unitPrice,
      quantity: qty,
      amount: numAmount,
      paid: numPaid,
      sacrifice: numSacrifice,
      payableDue: payableDue,
      runningDue: runningDue,
      duePaymentDate: duePaymentDate || todayStr,
      notes: notes.trim(),
      status,
      createdAt: todayStr
    });

    // Reset & close
    setCustomerName('');
    setAddress('');
    setCustomerOf('');
    setExDue('0');
    setSelectedCustomerId('');
    setProductQuantity('1');
    setPaid('0');
    setSacrifice('0');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-['Inter',sans-serif]">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-[#E5EAE8] overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-[#0E5A4F] px-6 py-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <FileText className="w-5 h-5 text-[#22A06B]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">নতুন সেলস ও বকেয়া এন্ট্রি (Sales & Due Entry)</h2>
              <p className="text-xs text-[#A3B8B0]">{businessName} · Manager Sales Ledger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200/80 rounded-xl flex items-center gap-2 text-xs text-[#C93B37] font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E5EAE8] pb-2.5">
              <div className="text-xs font-bold text-[#18211F] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0E5A4F]/10 text-[#0E5A4F] text-[11px] flex items-center justify-center font-mono">1</span>
                <span>কাস্টমার ও পার্টি বিবরণ (Customer Details)</span>
              </div>

              {/* Mode Toggle: Existing vs New */}
              <div className="flex items-center bg-[#F6F8F7] p-1 rounded-lg border border-[#E5EAE8] text-xs">
                <button
                  type="button"
                  onClick={handleSwitchToExistingCustomer}
                  className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    customerMode === 'existing'
                      ? 'bg-white text-[#0E5A4F] shadow-xs font-bold'
                      : 'text-[#71807B] hover:text-[#18211F]'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>বিদ্যমান পার্টি ({customers.length})</span>
                </button>
                <button
                  type="button"
                  onClick={handleSwitchToNewCustomer}
                  className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    customerMode === 'new'
                      ? 'bg-white text-[#0E5A4F] shadow-xs font-bold'
                      : 'text-[#71807B] hover:text-[#18211F]'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন পার্টি</span>
                </button>
              </div>
            </div>

            {/* Existing Customer Combobox / Dropdown */}
            {customerMode === 'existing' && customers.length > 0 && (
              <div className="p-3.5 rounded-xl border border-[#0E5A4F]/20 bg-[#F6F8F7]/50 space-y-2">
                <label className="block text-xs font-bold text-[#18211F]">
                  কাস্টমার বেছে নিন <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <div
                    onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAE8] bg-white hover:border-[#0E5A4F] text-xs flex items-center justify-between cursor-pointer transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Users className="w-4 h-4 text-[#0E5A4F] shrink-0" />
                      <span className="font-semibold text-[#18211F] truncate">
                        {customerName ? (
                          <>
                            {customerName} <span className="text-[#71807B] font-normal">({customerOf || 'সাধারণ'})</span>
                          </>
                        ) : (
                          <span className="text-[#71807B]">তালিকা থেকে কাস্টমার বেছে নিন</span>
                        )}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#0E5A4F] font-semibold shrink-0 ml-2">খুঁজুন ▾</span>
                  </div>

                  {isCustomerDropdownOpen && (
                    <div className="absolute z-20 left-0 right-0 mt-1.5 bg-white border border-[#E5EAE8] rounded-xl shadow-xl max-h-56 overflow-y-auto p-2">
                      <div className="p-1 sticky top-0 bg-white border-b border-[#E5EAE8]">
                        <input
                          type="text"
                          placeholder="নাম, ফোন বা এলাকা দিয়ে খুঁজুন..."
                          value={customerSearchTerm}
                          onChange={(e) => setCustomerSearchTerm(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-[#E5EAE8] text-xs focus:outline-none focus:border-[#0E5A4F]"
                          autoFocus
                        />
                      </div>

                      <div className="divide-y divide-[#EBF0EE] mt-1">
                        {filteredCustomers.length === 0 ? (
                          <div className="p-4 text-center text-xs text-[#71807B]">
                            কোনো কাস্টমার পাওয়া যায়নি
                          </div>
                        ) : (
                          filteredCustomers.map((c) => (
                            <div
                              key={c.id}
                              onClick={() => handleSelectCustomer(c)}
                              className={`p-2.5 hover:bg-[#F6F8F7] rounded-lg cursor-pointer transition-colors flex items-center justify-between text-xs ${
                                selectedCustomerId === c.id ? 'bg-[#E6F4ED] text-[#0E5A4F]' : ''
                              }`}
                            >
                              <div>
                                <div className="font-bold text-[#18211F] flex items-center gap-1.5">
                                  <span>{c.name}</span>
                                  {c.reference && (
                                    <span className="text-[10px] bg-[#F0F4F2] text-[#0E5A4F] px-1.5 py-0.5 rounded font-normal">
                                      {c.reference}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-[#71807B] mt-0.5">
                                  {c.phone} {c.address ? `· ${c.address}` : ''}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className={`text-xs font-mono font-bold ${
                                  c.dueAmount > 0 ? 'text-[#C93B37]' : 'text-[#168051]'
                                }`}>
                                  {c.dueAmount > 0 ? `বকেয়া: ৳${c.dueAmount.toLocaleString()}` : 'ক্লিয়ার (৳০)'}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ex Due Preview */}
                {selectedCustomer && numExDue > 0 && (
                  <div className="px-3 py-2 rounded-lg bg-amber-50/80 border border-amber-200/70 text-xs flex items-center justify-between">
                    <span className="text-[#854D0E] font-medium">পূর্বের বকেয়া হিসাব (Previous Due):</span>
                    <span className="font-mono font-bold text-[#854D0E]">৳ {numExDue.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}

            {/* Customer Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#556963] mb-1.5">
                  কাস্টমারের নাম (Customer Name) <span className="text-red-500">*</span>
                </label>
                <input
                  id="sale-customer-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="যেমন: রাজ আলামিন / হাজী ট্রেডার্স"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAE8] bg-white text-xs font-semibold text-[#18211F] placeholder:text-[#9CA3AF] focus:border-[#0E5A4F] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#556963] mb-1.5">
                  মার্কেট / পার্টি / রেফারেন্স <span className="text-red-500">*</span>
                </label>
                <input
                  id="sale-customer-of"
                  type="text"
                  required
                  value={customerOf}
                  onChange={(e) => setCustomerOf(e.target.value)}
                  placeholder="যেমন: কাওরান বাজার আড়ত / বাদামতলী"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAE8] bg-white text-xs font-semibold text-[#18211F] placeholder:text-[#9CA3AF] focus:border-[#0E5A4F] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#556963] mb-1.5">
                  ঠিকানা ও মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  id="sale-address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="যেমন: দোকান নং-১২, কাওরান বাজার · ০১৭১২-৩৪৫৬৭৮"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAE8] bg-white text-xs text-[#18211F] placeholder:text-[#9CA3AF] focus:border-[#0E5A4F] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#556963] mb-1.5">
                  পূর্বের বকেয়া (Ex-Due ৳)
                </label>
                <input
                  id="sale-ex-due"
                  type="number"
                  min="0"
                  value={exDue}
                  onChange={(e) => setExDue(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAE8] bg-white text-xs font-mono font-bold text-[#18211F] focus:border-[#0E5A4F] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Product & Pricing */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-[#E5EAE8] pb-2.5">
              <div className="text-xs font-bold text-[#18211F] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0E5A4F]/10 text-[#0E5A4F] text-[11px] flex items-center justify-center font-mono">2</span>
                <span>বিক্রয়কৃত পণ্য ও পরিমাণ (Product & Pricing)</span>
              </div>
              {onOpenAddProductModal && (
                <button
                  type="button"
                  onClick={onOpenAddProductModal}
                  className="text-xs text-[#0E5A4F] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন পণ্য</span>
                </button>
              )}
            </div>

            {/* Product Search & Dropdown */}
            <div className="relative">
              <label className="block text-xs font-semibold text-[#556963] mb-1.5">
                পণ্য নির্বাচন করুন <span className="text-red-500">*</span>
              </label>

              <div
                onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAE8] bg-white text-xs flex items-center justify-between cursor-pointer hover:border-[#0E5A4F] transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Package className="w-4 h-4 text-[#0E5A4F] shrink-0" />
                  <span className="font-semibold text-[#18211F] truncate">
                    {selectedProduct ? (
                      <>
                        {selectedProduct.name} <span className="text-[#71807B] font-normal">({selectedProduct.unit}) · ৳{selectedProduct.unitPrice.toLocaleString()} / {selectedProduct.unit}</span>
                      </>
                    ) : (
                      <span className="text-[#71807B]">পণ্য বেছে নিন</span>
                    )}
                  </span>
                </div>
                <span className="text-[11px] text-[#0E5A4F] font-semibold shrink-0">বাছাই করুন ▾</span>
              </div>

              {isProductDropdownOpen && (
                <div className="absolute z-20 left-0 right-0 mt-1.5 bg-white border border-[#E5EAE8] rounded-xl shadow-xl max-h-56 overflow-y-auto p-2">
                  <div className="p-1 sticky top-0 bg-white border-b border-[#E5EAE8]">
                    <input
                      type="text"
                      placeholder="পণ্যের নাম লিখে সার্চ করুন..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#E5EAE8] text-xs focus:outline-none focus:border-[#0E5A4F]"
                      autoFocus
                    />
                  </div>

                  <div className="divide-y divide-[#EBF0EE] mt-1">
                    {filteredProducts.length === 0 ? (
                      <div className="p-4 text-center text-xs text-[#71807B]">
                        কোনো পণ্য পাওয়া যায়নি
                      </div>
                    ) : (
                      filteredProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleSelectProduct(p)}
                          className={`p-2.5 hover:bg-[#F6F8F7] rounded-lg cursor-pointer transition-colors flex items-center justify-between text-xs ${
                            selectedProductId === p.id ? 'bg-[#E6F4ED] text-[#0E5A4F] font-bold' : ''
                          }`}
                        >
                          <div>
                            <span className="font-semibold text-[#18211F]">{p.name}</span>
                            {p.category && (
                              <span className="text-[11px] text-[#71807B] ml-2">({p.category})</span>
                            )}
                          </div>
                          <span className="font-mono text-xs font-bold text-[#0E5A4F]">
                            ৳ {p.unitPrice.toLocaleString()} / {p.unit}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity & Unit Price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#556963] mb-1.5">
                  পরিমাণ (Quantity) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    id="sale-quantity"
                    type="number"
                    min="0.1"
                    step="any"
                    required
                    value={productQuantity}
                    onChange={(e) => setProductQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-l-xl border border-[#E5EAE8] bg-white text-xs font-mono font-bold text-[#18211F] focus:border-[#0E5A4F] focus:outline-none transition-colors"
                  />
                  <span className="px-3 py-2.5 bg-[#F6F8F7] border border-l-0 border-[#E5EAE8] rounded-r-xl text-xs font-semibold text-[#556963]">
                    {selectedProduct?.unit || 'Unit'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#556963] mb-1.5">
                  দর (Unit Price ৳)
                </label>
                <input
                  id="sale-unit-price"
                  type="number"
                  min="0"
                  step="any"
                  value={customUnitPrice}
                  onChange={(e) => setCustomUnitPrice(e.target.value)}
                  placeholder="রেট"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAE8] bg-white text-xs font-mono font-semibold text-[#18211F] focus:border-[#0E5A4F] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#556963] mb-1.5">
                  মোট মূল্য (Amount ৳) <span className="text-red-500">*</span>
                </label>
                <input
                  id="sale-amount"
                  type="number"
                  min="0"
                  required
                  value={saleAmount}
                  onChange={(e) => setSaleAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAE8] bg-white text-xs font-mono font-bold text-[#0E5A4F] focus:border-[#0E5A4F] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Financial Settlement */}
          <div className="space-y-4 pt-2">
            <div className="text-xs font-bold text-[#18211F] flex items-center gap-2 border-b border-[#E5EAE8] pb-2.5">
              <span className="w-5 h-5 rounded-full bg-[#0E5A4F]/10 text-[#0E5A4F] text-[11px] flex items-center justify-center font-mono">3</span>
              <span>আর্থিক জমা ও বকেয়া নিষ্পত্তি (Payment & Settlement)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#556963] mb-1.5">
                  ছাড় বা ডিসকাউন্ট (Sacrifice ৳)
                </label>
                <input
                  id="sale-sacrifice"
                  type="number"
                  min="0"
                  value={sacrifice}
                  onChange={(e) => setSacrifice(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAE8] bg-white text-xs font-mono font-semibold text-[#18211F] focus:border-[#0E5A4F] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#556963] mb-1.5">
                  নগদ জমা (Paid ৳) <span className="text-red-500">*</span>
                </label>
                <input
                  id="sale-paid"
                  type="number"
                  min="0"
                  value={paid}
                  onChange={(e) => setPaid(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAE8] bg-white text-xs font-mono font-bold text-[#168051] focus:border-[#0E5A4F] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Live Calculation Banner */}
            <div className="bg-[#F8FAFA] p-4 rounded-xl border border-[#E5EAE8] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <span className="text-[11px] text-[#71807B] block">পণ্য মূল্য</span>
                <span className="text-sm font-bold font-mono text-[#18211F] mt-0.5 block">৳ {numAmount.toLocaleString()}</span>
              </div>

              <div>
                <span className="text-[11px] text-[#71807B] block">মোট প্রদেয় (Payable)</span>
                <span className="text-sm font-bold font-mono text-[#18211F] mt-0.5 block">৳ {payableDue.toLocaleString()}</span>
              </div>

              <div>
                <span className="text-[11px] text-[#71807B] block">নগদ জমা (Paid)</span>
                <span className="text-sm font-bold font-mono text-[#168051] mt-0.5 block">৳ {numPaid.toLocaleString()}</span>
              </div>

              <div className="border-l border-[#E5EAE8] pl-2">
                <span className="text-[11px] text-[#71807B] block font-bold">অবশিষ্ট বকেয়া (Due)</span>
                <span className={`text-sm font-bold font-mono mt-0.5 block ${
                  runningDue === 0 ? 'text-[#168051]' : 'text-[#C93B37]'
                }`}>
                  ৳ {runningDue.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#556963] mb-1.5">
                  বকেয়া পরিশোধের তারিখ
                </label>
                <input
                  id="sale-due-date"
                  type="date"
                  value={duePaymentDate}
                  onChange={(e) => setDuePaymentDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAE8] bg-white text-xs text-[#18211F] focus:border-[#0E5A4F] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#556963] mb-1.5">
                  মন্তব্য / বিবরণ
                </label>
                <input
                  id="sale-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="যেমন: বাকির প্রতিশ্রুতি বা শর্ত"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5EAE8] bg-white text-xs text-[#18211F] placeholder:text-[#9CA3AF] focus:border-[#0E5A4F] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E5EAE8]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#E5EAE8] text-xs font-bold text-[#71807B] hover:bg-[#F6F8F7] transition-colors cursor-pointer"
            >
              বাতিল
            </button>

            <button
              id="submit-sale-record-btn"
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0E5A4F] hover:bg-[#073F37] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>চালান ও বকেয়া সেভ করুন</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
