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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-[#D9534F]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Customer Profile with Existing Customer Selector */}
          <div className="bg-[#F6F8F7] p-4 rounded-xl border border-[#E5EAE8] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#E5EAE8] pb-2.5">
              <div className="text-[11px] uppercase tracking-wider font-bold text-[#0E5A4F] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>১. কাস্টমার ও ক্লাস্টার পরিচিতি (Customer Details)</span>
              </div>

              {/* Mode Toggle: Existing vs New */}
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-[#E5EAE8] text-[11px] self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleSwitchToExistingCustomer}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    customerMode === 'existing'
                      ? 'bg-[#0E5A4F] text-white shadow-2xs'
                      : 'text-[#71807B] hover:text-[#18211F]'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>বিদ্যমান কাস্টমার ({customers.length})</span>
                </button>
                <button
                  type="button"
                  onClick={handleSwitchToNewCustomer}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    customerMode === 'new'
                      ? 'bg-[#0E5A4F] text-white shadow-2xs'
                      : 'text-[#71807B] hover:text-[#18211F]'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন কাস্টমার</span>
                </button>
              </div>
            </div>

            {/* Existing Customer Combobox / Dropdown */}
            {customerMode === 'existing' && customers.length > 0 && (
              <div className="bg-white p-3 rounded-xl border border-[#0E5A4F]/30 shadow-2xs space-y-2">
                <label className="block text-xs font-bold text-[#0E5A4F]">
                  কাস্টমার সিলেক্ট করুন (Select Existing Customer) <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <div
                    onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E5EAE8] bg-[#F6F8F7] hover:bg-white text-xs flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Users className="w-3.5 h-3.5 text-[#0E5A4F] shrink-0" />
                      <span className="font-bold text-[#18211F] truncate">
                        {customerName ? (
                          <>
                            {customerName} · <span className="text-[#D9534F] font-mono">বর্তমান ডিউ: ৳{numExDue.toLocaleString()}</span>
                          </>
                        ) : (
                          '-- তালিকা থেকে কাস্টমার বেছে নিন --'
                        )}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#71807B] font-semibold shrink-0 ml-2">পরিবর্তন করুন ▾</span>
                  </div>

                  {isCustomerDropdownOpen && (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-[#E5EAE8] rounded-xl shadow-xl max-h-56 overflow-y-auto p-1.5">
                      <div className="p-1 sticky top-0 bg-white border-b border-[#E5EAE8]">
                        <input
                          type="text"
                          placeholder="নাম, ফোন বা ঠিকানা দিয়ে খুঁজুন..."
                          value={customerSearchTerm}
                          onChange={(e) => setCustomerSearchTerm(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5EAE8] text-xs focus:outline-none focus:border-[#0E5A4F]"
                          autoFocus
                        />
                      </div>

                      <div className="divide-y divide-[#E5EAE8]/60 mt-1">
                        {filteredCustomers.length === 0 ? (
                          <div className="p-3 text-center text-xs text-[#71807B]">
                            কোনো কাস্টমার পাওয়া যায়নি
                          </div>
                        ) : (
                          filteredCustomers.map((c) => (
                            <div
                              key={c.id}
                              onClick={() => handleSelectCustomer(c)}
                              className={`p-2 hover:bg-[#E6F4ED] rounded-lg cursor-pointer transition-colors flex items-center justify-between text-xs ${
                                selectedCustomerId === c.id ? 'bg-[#E6F4ED] font-bold' : ''
                              }`}
                            >
                              <div>
                                <div className="font-bold text-[#18211F] flex items-center gap-1.5">
                                  <span>{c.name}</span>
                                  {c.reference && (
                                    <span className="text-[10px] bg-[#F6F8F7] text-[#0E5A4F] px-1.5 py-0.2 rounded font-normal">
                                      {c.reference}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-[#71807B]">
                                  {c.phone} · {c.address}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className={`text-[11px] font-mono font-bold ${
                                  c.dueAmount > 0 ? 'text-[#D9534F]' : 'text-[#22A06B]'
                                }`}>
                                  {c.dueAmount > 0 ? `ডিউ: ৳${c.dueAmount.toLocaleString()}` : 'ক্লিয়ার (৳0)'}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ex Due Alert Banner */}
                {selectedCustomer && (
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        <strong>{customerName}</strong> এর পূর্বের বকেয়া (Ex-Due):
                      </span>
                    </div>
                    <span className="font-mono font-bold text-amber-700 text-sm">
                      ৳ {numExDue.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Customer Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#18211F] mb-1">
                  Name (কাস্টমারের নাম) <span className="text-red-500">*</span>
                </label>
                <input
                  id="sale-customer-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Raj Alamin / Haji Traders"
                  className="w-full px-3 py-2 rounded-lg border border-[#E5EAE8] bg-white text-xs font-semibold text-[#18211F] focus:border-[#0E5A4F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18211F] mb-1">
                  Customer of (মার্কেট / পার্টি / এলাকা) <span className="text-red-500">*</span>
                </label>
                <input
                  id="sale-customer-of"
                  type="text"
                  required
                  value={customerOf}
                  onChange={(e) => setCustomerOf(e.target.value)}
                  placeholder="e.g. Kawran Bazar Wholesale / Badamtoli"
                  className="w-full px-3 py-2 rounded-lg border border-[#E5EAE8] bg-white text-xs font-semibold text-[#18211F] focus:border-[#0E5A4F] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#18211F] mb-1">
                  Address (area+Contact) <span className="text-red-500">*</span>
                </label>
                <input
                  id="sale-address"
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Kawran Bazar, Dhaka · 01712-445566"
                  className="w-full px-3 py-2 rounded-lg border border-[#E5EAE8] bg-white text-xs text-[#18211F] focus:border-[#0E5A4F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18211F] mb-1">
                  Ex-Due (পূর্বের বকেয়া ৳)
                </label>
                <input
                  id="sale-ex-due"
                  type="number"
                  min="0"
                  value={exDue}
                  onChange={(e) => setExDue(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-lg border border-[#E5EAE8] bg-white text-xs font-bold text-[#D9534F] focus:border-[#0E5A4F] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Product Selection & Pricing */}
          <div className="bg-[#F6F8F7] p-3.5 rounded-xl border border-[#E5EAE8] space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-wider font-bold text-[#0E5A4F] flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>২. বিক্রয়কৃত পণ্য ও পরিমাণ (Sold Product & Quantity)</span>
              </div>
              {onOpenAddProductModal && (
                <button
                  type="button"
                  onClick={onOpenAddProductModal}
                  className="text-[11px] text-[#0E5A4F] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ নতুন প্রোডাক্ট যোগ</span>
                </button>
              )}
            </div>

            {/* Product Search & Dropdown */}
            <div className="relative">
              <label className="block text-xs font-bold text-[#18211F] mb-1">
                Sold products ( product Search & Selection ) <span className="text-red-500">*</span>
              </label>

              <div
                onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                className="w-full px-3 py-2 rounded-lg border border-[#E5EAE8] bg-white text-xs flex items-center justify-between cursor-pointer hover:border-[#0E5A4F]"
              >
                <div className="flex items-center gap-2 truncate">
                  <Package className="w-3.5 h-3.5 text-[#0E5A4F]" />
                  <span className="font-semibold text-[#18211F] truncate">
                    {selectedProduct ? (
                      <>
                        {selectedProduct.name} ({selectedProduct.unit}) · ৳{selectedProduct.unitPrice.toLocaleString()}/{selectedProduct.unit}
                      </>
                    ) : (
                      '-- প্রোডাক্ট সিলেক্ট করুন --'
                    )}
                  </span>
                </div>
                <span className="text-[10px] text-[#71807B]">খুঁজুন ▾</span>
              </div>

              {isProductDropdownOpen && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-[#E5EAE8] rounded-xl shadow-xl max-h-56 overflow-y-auto p-1.5">
                  <div className="p-1 sticky top-0 bg-white border-b border-[#E5EAE8]">
                    <input
                      type="text"
                      placeholder="পণ্য বা ক্যাটাগরির নাম লিখে খুঁজুন..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5EAE8] text-xs focus:outline-none focus:border-[#0E5A4F]"
                      autoFocus
                    />
                  </div>

                  <div className="divide-y divide-[#E5EAE8]/60 mt-1">
                    {filteredProducts.length === 0 ? (
                      <div className="p-3 text-center text-xs text-[#71807B]">
                        কোনো পণ্য পাওয়া যায়নি
                      </div>
                    ) : (
                      filteredProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleSelectProduct(p)}
                          className={`p-2 hover:bg-[#E6F4ED] rounded-lg cursor-pointer transition-colors flex items-center justify-between text-xs ${
                            selectedProductId === p.id ? 'bg-[#E6F4ED] font-bold text-[#0E5A4F]' : ''
                          }`}
                        >
                          <div>
                            <span className="font-semibold text-[#18211F]">{p.name}</span>
                            {p.category && (
                              <span className="text-[10px] text-[#71807B] ml-2">({p.category})</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#18211F] mb-1">
                  Product quantity (পরিমাণ) <span className="text-red-500">*</span>
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
                    className="w-full px-3 py-2 rounded-l-lg border border-[#E5EAE8] bg-white text-xs font-mono font-bold text-[#18211F] focus:border-[#0E5A4F] focus:outline-none"
                  />
                  <span className="px-2.5 py-2 bg-[#E5EAE8] border border-l-0 border-[#E5EAE8] rounded-r-lg text-xs font-bold text-[#71807B]">
                    {selectedProduct?.unit || 'Unit'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18211F] mb-1">
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
                  className="w-full px-3 py-2 rounded-lg border border-[#E5EAE8] bg-white text-xs font-mono font-semibold text-[#18211F] focus:border-[#0E5A4F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18211F] mb-1">
                  Amount (মোট বিক্রয় মূল্য ৳) <span className="text-red-500">*</span>
                </label>
                <input
                  id="sale-amount"
                  type="number"
                  min="0"
                  required
                  value={saleAmount}
                  onChange={(e) => setSaleAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-lg border border-[#E5EAE8] bg-white text-xs font-mono font-bold text-[#0E5A4F] focus:border-[#0E5A4F] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Financial Settlement & Due Calculation */}
          <div className="bg-[#F6F8F7] p-3.5 rounded-xl border border-[#E5EAE8] space-y-3">
            <div className="text-[11px] uppercase tracking-wider font-bold text-[#0E5A4F] flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5" />
              <span>৩. আর্থিক হিসাব ও বকেয়া নিষ্পত্তি (Due & Payment Settlement)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#18211F] mb-1">
                  Sacrifice (ছাড় বা ডিসকাউন্ট ৳)
                </label>
                <input
                  id="sale-sacrifice"
                  type="number"
                  min="0"
                  value={sacrifice}
                  onChange={(e) => setSacrifice(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-lg border border-[#E5EAE8] bg-white text-xs font-bold text-[#D9A441] focus:border-[#0E5A4F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18211F] mb-1">
                  Paid (নগদ আদায় ৳) <span className="text-red-500">*</span>
                </label>
                <input
                  id="sale-paid"
                  type="number"
                  min="0"
                  value={paid}
                  onChange={(e) => setPaid(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-lg border border-[#E5EAE8] bg-white text-xs font-mono font-bold text-[#22A06B] focus:border-[#0E5A4F] focus:outline-none"
                />
              </div>
            </div>

            {/* Live Calculation Preview Banner */}
            <div className="bg-[#073F37] text-white p-3.5 rounded-xl border border-[#0E5A4F] grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div>
                <span className="text-[10px] text-[#A3B8B0] uppercase block">মোট পণ্য বিল</span>
                <span className="text-xs sm:text-sm font-bold font-mono text-white">৳ {numAmount.toLocaleString()}</span>
              </div>

              <div>
                <span className="text-[10px] text-[#A3B8B0] uppercase block">Payable Due</span>
                <span className="text-xs sm:text-sm font-bold font-mono text-[#D9A441]">৳ {payableDue.toLocaleString()}</span>
              </div>

              <div>
                <span className="text-[10px] text-[#A3B8B0] uppercase block">নগদ আদায় (Paid)</span>
                <span className="text-xs sm:text-sm font-bold font-mono text-[#22A06B]">৳ {numPaid.toLocaleString()}</span>
              </div>

              <div className="border-l border-white/20 pl-2">
                <span className="text-[10px] text-[#A3B8B0] uppercase block font-bold">Running Due (বকেয়া)</span>
                <span className={`text-xs sm:text-sm font-bold font-mono ${
                  runningDue === 0 ? 'text-[#22A06B]' : 'text-[#D9534F]'
                }`}>
                  ৳ {runningDue.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#18211F] mb-1">
                  Due Payment Date (পরিশোধের সম্ভাব্য তারিখ)
                </label>
                <div className="relative">
                  <input
                    id="sale-due-date"
                    type="date"
                    value={duePaymentDate}
                    onChange={(e) => setDuePaymentDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E5EAE8] bg-white text-xs text-[#18211F] focus:border-[#0E5A4F] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18211F] mb-1">
                  মন্তব্য / নোট (Notes)
                </label>
                <input
                  id="sale-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. বাকির প্রতিশ্রুতি, চালান বিবরণী"
                  className="w-full px-3 py-2 rounded-lg border border-[#E5EAE8] bg-white text-xs text-[#18211F] focus:border-[#0E5A4F] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E5EAE8] text-xs font-bold text-[#71807B] hover:bg-[#F6F8F7] transition-colors cursor-pointer"
            >
              বাতিল (Cancel)
            </button>

            <button
              id="submit-sale-record-btn"
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0E5A4F] hover:bg-[#073F37] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>চালান ও বকেয়া সেভ করুন (Save Record)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
