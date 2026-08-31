import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { BusinessHealthItem, SaleDueRecord, UnitProduct, ManagerCustomer, PendingApproval } from '../../types';
import { ManagerSidebar, ManagerTab } from '../../components/layout/ManagerSidebar';
import { ManagerHeader } from '../../components/layout/ManagerHeader';
import { ManagerOverviewTab } from './tabs/ManagerOverviewTab';
import { ManagerSalesDueTab } from './tabs/ManagerSalesDueTab';
import { ManagerProductsTab } from './tabs/ManagerProductsTab';
import { ManagerCustomersTab } from './tabs/ManagerCustomersTab';
import { AddSaleDueModal } from '../../components/modals/AddSaleDueModal';
import { AddProductModal } from '../../components/modals/AddProductModal';
import { AddCustomerModal } from '../../components/modals/AddCustomerModal';
import { SaleVoucherModal } from '../../components/modals/SaleVoucherModal';
import { PayDueModal } from '../../components/modals/PayDueModal';
import { INITIAL_PRODUCTS_DATA, INITIAL_SALES_DUE_DATA, INITIAL_CUSTOMERS_DATA, BUSINESS_HEALTH_DATA } from '../../data/mockData';
import {
  seedInitialFirestoreData,
  subscribeToSalesRecords,
  subscribeToProducts,
  subscribeToCustomers,
  saveSaleRecordToFirestore,
  deleteSaleRecordFromFirestore,
  saveProductToFirestore,
  deleteProductFromFirestore,
  saveCustomerToFirestore,
  deleteCustomerFromFirestore,
  updateCustomerDueInFirestore,
  saveApprovalToFirestore
} from '../../services/firestoreService';

interface ManagerDashboardPageProps {
  businesses?: BusinessHealthItem[];
}

export const ManagerDashboardPage: React.FC<ManagerDashboardPageProps> = ({
  businesses = BUSINESS_HEALTH_DATA
}) => {
  const { user } = useAuth();

  // Active Tab state
  const [activeTab, setActiveTab] = useState<ManagerTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Today');

  // Business context
  const currentBusinessId = user?.businessId || 'biz-1';
  const currentBusinessName = user?.businessName || 'Elenga Fruits';
  const currentBusiness: BusinessHealthItem = businesses.find((b) => b.id === currentBusinessId) || {
    id: currentBusinessId,
    name: currentBusinessName,
    sales: '৳ 12.5M',
    status: 'Healthy',
    collectionRate: '94%',
    margin: '18.2%',
    manager: user?.name || 'Unit Manager'
  };

  // 1. Products State with LocalStorage persistence
  const [products, setProducts] = useState<UnitProduct[]>(() => {
    try {
      const stored = localStorage.getItem('samura_unit_products_v2') || localStorage.getItem('samura_unit_products');
      if (stored) {
        const parsed: UnitProduct[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load products from storage', e);
    }
    return INITIAL_PRODUCTS_DATA;
  });

  // 2. Sales & Due State with LocalStorage persistence
  const [salesDueRecords, setSalesDueRecords] = useState<SaleDueRecord[]>(() => {
    try {
      const stored = localStorage.getItem('samura_sales_due_records_v2') || localStorage.getItem('samura_sales_due_records');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load sales due records from storage', e);
    }
    return INITIAL_SALES_DUE_DATA;
  });

  // 3. Customers State with LocalStorage persistence
  const [customers, setCustomers] = useState<ManagerCustomer[]>(() => {
    try {
      const stored = localStorage.getItem('samura_manager_customers_v2') || localStorage.getItem('samura_manager_customers');
      if (stored !== null) {
        const parsed: ManagerCustomer[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load customers from storage', e);
    }
    return INITIAL_CUSTOMERS_DATA;
  });

  // Realtime Firestore listeners & initial seeding
  useEffect(() => {
    // Seed initial dataset if database is fresh
    seedInitialFirestoreData();

    // Listen to realtime changes from Firestore
    const unsubSales = subscribeToSalesRecords((remoteRecords) => {
      setSalesDueRecords(remoteRecords);
    });

    const unsubProducts = subscribeToProducts((remoteProducts) => {
      setProducts(remoteProducts);
    });

    const unsubCustomers = subscribeToCustomers((remoteCustomers) => {
      setCustomers(remoteCustomers);
    });

    return () => {
      unsubSales();
      unsubProducts();
      unsubCustomers();
    };
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('samura_unit_products_v2', JSON.stringify(products));
      localStorage.setItem('samura_unit_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('samura_sales_due_records_v2', JSON.stringify(salesDueRecords));
      localStorage.setItem('samura_sales_due_records', JSON.stringify(salesDueRecords));
    } catch (e) {
      console.error('Failed to save sales due records', e);
    }
  }, [salesDueRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('samura_manager_customers_v2', JSON.stringify(customers));
      localStorage.setItem('samura_manager_customers', JSON.stringify(customers));
    } catch (e) {
      console.error('Failed to save customers', e);
    }
  }, [customers]);

  // Filter items for current business
  const unitProducts = products.filter((p) => p.businessId === currentBusinessId);
  const unitRecords = salesDueRecords.filter((r) => r.businessId === currentBusinessId);
  const unitCustomers = customers.filter((c) => c.businessId === currentBusinessId);

  // Filter unit records by selectedDate
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayObj = new Date();
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yesterdayStr = yesterdayObj.toISOString().split('T')[0];

  const last7DaysObj = new Date();
  last7DaysObj.setDate(last7DaysObj.getDate() - 7);
  const last7DaysStr = last7DaysObj.toISOString().split('T')[0];

  const currentMonthPrefix = todayStr.slice(0, 7);

  const filteredUnitRecords = useMemo(() => {
    if (selectedDate === 'All Records' || selectedDate === 'All Time') {
      return unitRecords;
    }
    if (selectedDate === 'Today') {
      return unitRecords.filter((r) => r.date === todayStr);
    }
    if (selectedDate === 'Yesterday') {
      return unitRecords.filter((r) => r.date === yesterdayStr);
    }
    if (selectedDate === 'Last 7 Days') {
      return unitRecords.filter((r) => !r.date || r.date >= last7DaysStr);
    }
    if (selectedDate === 'This Month') {
      return unitRecords.filter((r) => !r.date || r.date.startsWith(currentMonthPrefix));
    }
    // Specific date format like YYYY-MM-DD
    if (selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return unitRecords.filter((r) => r.date === selectedDate);
    }
    return unitRecords;
  }, [unitRecords, selectedDate, todayStr, yesterdayStr, last7DaysStr, currentMonthPrefix]);

  // Modals state
  const [isAddSaleModalOpen, setIsAddSaleModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [selectedVoucherRecord, setSelectedVoucherRecord] = useState<SaleDueRecord | null>(null);

  // Pay Due Modal state (can target a single sale record OR an entire customer balance)
  const [payDueRecordTarget, setPayDueRecordTarget] = useState<SaleDueRecord | null>(null);
  const [payDueCustomerTarget, setPayDueCustomerTarget] = useState<ManagerCustomer | null>(null);

  // Handlers
  const handleAddProduct = async (newProd: Omit<UnitProduct, 'id'>) => {
    const productWithId: UnitProduct = {
      ...newProd,
      id: `prod-${Date.now()}`
    };
    setProducts((prev) => [productWithId, ...prev]);
    try {
      await saveProductToFirestore(productWithId);
    } catch (err) {
      console.error('Failed to save product to Firestore:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await deleteProductFromFirestore(id);
    } catch (err) {
      console.error('Failed to delete product from Firestore:', err);
    }
  };

  const handleUpdateProductPrice = async (id: string, newPrice: number) => {
    const targetProduct = products.find((p) => p.id === id);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, unitPrice: newPrice } : p))
    );
    if (targetProduct) {
      try {
        await saveProductToFirestore({ ...targetProduct, unitPrice: newPrice });
      } catch (err) {
        console.error('Failed to update product price in Firestore:', err);
      }
    }
  };

  const handleAddCustomer = async (newCust: Omit<ManagerCustomer, 'id'>) => {
    const custWithId: ManagerCustomer = {
      ...newCust,
      id: `cust-${Date.now()}`
    };
    setCustomers((prev) => [custWithId, ...prev]);
    try {
      await saveCustomerToFirestore(custWithId);
    } catch (err) {
      console.error('Failed to save customer to Firestore:', err);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    try {
      await deleteCustomerFromFirestore(id);
    } catch (err) {
      console.error('Failed to delete customer from Firestore:', err);
    }
  };

  const handleUpdateCustomerDue = async (id: string, newDue: number) => {
    const targetCustomer = customers.find((c) => c.id === id);
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              dueAmount: newDue,
              totalPaid: (c.totalPaid || 0) + (c.dueAmount - newDue),
              status: newDue === 0 ? 'Clear' : newDue > 100000 ? 'Defaulter' : 'Active'
            }
          : c
      )
    );
    if (targetCustomer) {
      try {
        await updateCustomerDueInFirestore(id, newDue);
      } catch (err) {
        console.error('Failed to update customer due in Firestore:', err);
      }
    }
  };

  // Pay Now Confirmation Handler
  const handleConfirmPayment = async ({
    recordId,
    customerId,
    customerName,
    amount,
    paymentMethod,
    paymentDate,
    note
  }: {
    recordId?: string;
    customerId?: string;
    customerName: string;
    amount: number;
    paymentMethod: string;
    paymentDate: string;
    note?: string;
  }) => {
    // 1. If paying against a specific record:
    if (recordId) {
      const targetRecord = salesDueRecords.find((r) => r.id === recordId);
      if (targetRecord) {
        const newPaid = targetRecord.paid + amount;
        const newRunningDue = Math.max(0, targetRecord.runningDue - amount);
        const newStatus: SaleDueRecord['status'] =
          newRunningDue === 0 ? 'Full Paid' : 'Partial Due';
        const updatedRec: SaleDueRecord = {
          ...targetRecord,
          paid: newPaid,
          runningDue: newRunningDue,
          status: newStatus,
          notes: note ? (targetRecord.notes ? `${targetRecord.notes} | ${note}` : note) : targetRecord.notes
        };

        setSalesDueRecords((prev) =>
          prev.map((r) => (r.id === recordId ? updatedRec : r))
        );

        try {
          await saveSaleRecordToFirestore(updatedRec);
        } catch (err) {
          console.error('Failed to sync payment record to Firestore:', err);
        }
      }
    } else {
      // If paying customer balance generally, allocate payment to customer's open records (oldest first)
      let unallocated = amount;
      const recordsToUpdate: SaleDueRecord[] = [];

      setSalesDueRecords((prev) => {
        return prev.map((r) => {
          const isMatch =
            r.customerName.toLowerCase().trim() === customerName.toLowerCase().trim();
          if (isMatch && r.runningDue > 0 && unallocated > 0) {
            const deduct = Math.min(r.runningDue, unallocated);
            unallocated -= deduct;
            const newPaid = r.paid + deduct;
            const newRunningDue = Math.max(0, r.runningDue - deduct);
            const updated: SaleDueRecord = {
              ...r,
              paid: newPaid,
              runningDue: newRunningDue,
              status: newRunningDue === 0 ? ('Full Paid' as const) : ('Partial Due' as const)
            };
            recordsToUpdate.push(updated);
            return updated;
          }
          return r;
        });
      });

      // Save updated records to Firestore
      for (const rec of recordsToUpdate) {
        try {
          await saveSaleRecordToFirestore(rec);
        } catch (err) {
          console.error('Failed to sync batch sale update to Firestore:', err);
        }
      }
    }

    // 2. Update customer record in customers list
    let updatedCustomerObj: ManagerCustomer | null = null;
    setCustomers((prev) =>
      prev.map((c) => {
        const isMatch =
          (customerId && c.id === customerId) ||
          c.name.toLowerCase().trim() === customerName.toLowerCase().trim();
        if (isMatch) {
          const newDue = Math.max(0, (c.dueAmount || 0) - amount);
          const newPaid = (c.totalPaid || 0) + amount;
          const updated: ManagerCustomer = {
            ...c,
            dueAmount: newDue,
            totalPaid: newPaid,
            lastTransactionDate: paymentDate,
            status: newDue === 0 ? ('Clear' as const) : newDue > 100000 ? ('Defaulter' as const) : ('Active' as const)
          };
          updatedCustomerObj = updated;
          return updated;
        }
        return c;
      })
    );

    if (updatedCustomerObj) {
      try {
        await saveCustomerToFirestore(updatedCustomerObj);
      } catch (err) {
        console.error('Failed to sync customer payment to Firestore:', err);
      }
    }

    // Close modals
    setPayDueRecordTarget(null);
    setPayDueCustomerTarget(null);
  };

  const handleAddSaleRecord = async (newRec: Omit<SaleDueRecord, 'id' | 'invoiceNo'>) => {
    const datePrefix = new Date().getFullYear();
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const invoiceNo = `INV-${currentBusinessName.slice(0, 3).toUpperCase()}-${datePrefix}-${randomSeq}`;

    const recordWithId: SaleDueRecord = {
      ...newRec,
      id: `sale-${Date.now()}`,
      invoiceNo
    };

    setSalesDueRecords((prev) => [recordWithId, ...prev]);

    try {
      await saveSaleRecordToFirestore(recordWithId);
    } catch (err) {
      console.error('Failed to save sale record to Firestore:', err);
    }

    // Also sync or create customer in customers list
    const existing = customers.find(
      (c) => c.name.toLowerCase().trim() === newRec.customerName.toLowerCase().trim()
    );

    if (existing) {
      const updatedCustomer: ManagerCustomer = {
        ...existing,
        dueAmount: newRec.runningDue,
        totalSales: (existing.totalSales || 0) + newRec.amount,
        totalPaid: (existing.totalPaid || 0) + newRec.paid,
        lastTransactionDate: newRec.date,
        status: newRec.runningDue === 0 ? 'Clear' : 'Active'
      };

      setCustomers((prev) =>
        prev.map((c) => (c.id === existing.id ? updatedCustomer : c))
      );

      try {
        await saveCustomerToFirestore(updatedCustomer);
      } catch (err) {
        console.error('Failed to update customer in Firestore:', err);
      }
    } else {
      const newCustomer: ManagerCustomer = {
        id: `cust-${Date.now()}`,
        businessId: currentBusinessId,
        name: newRec.customerName,
        phone: newRec.address.includes('·') ? newRec.address.split('·')[1].trim() : '01700-000000',
        address: newRec.address.includes('·') ? newRec.address.split('·')[0].trim() : newRec.address,
        reference: newRec.customerOf,
        dueAmount: newRec.runningDue,
        totalSales: newRec.amount,
        totalPaid: newRec.paid,
        lastTransactionDate: newRec.date,
        status: newRec.runningDue === 0 ? 'Clear' : 'Active',
        createdAt: new Date().toISOString()
      };

      setCustomers((prev) => [newCustomer, ...prev]);

      try {
        await saveCustomerToFirestore(newCustomer);
      } catch (err) {
        console.error('Failed to save new customer to Firestore:', err);
      }
    }
  };

  const handleDeleteSaleRecord = async (id: string) => {
    const targetRecord = salesDueRecords.find((r) => r.id === id);
    if (!targetRecord) return;

    // 1. Mark sale record as void requested / Void Pending
    const updatedRecord: SaleDueRecord = {
      ...targetRecord,
      status: 'Void Pending',
      voidRequested: true
    };

    setSalesDueRecords((prev) =>
      prev.map((r) => (r.id === id ? updatedRecord : r))
    );

    try {
      await saveSaleRecordToFirestore(updatedRecord);
    } catch (err) {
      console.error('Failed to update sale record void status in Firestore:', err);
    }

    // 2. Create a pending void approval request for Admin
    const voidApproval: PendingApproval = {
      id: `app-void-${id}-${Date.now()}`,
      title: `Void Sale Request - ${targetRecord.invoiceNo}`,
      description: `Manager ${user?.name || currentBusinessName} requested to void sale invoice ${targetRecord.invoiceNo} for ${targetRecord.customerName} (${targetRecord.productName}, ৳${targetRecord.amount.toLocaleString()}).`,
      amount: `৳${targetRecord.amount.toLocaleString()}`,
      type: 'void',
      age: 'Just now',
      requester: user?.name || currentBusinessName,
      department: currentBusinessName,
      status: 'pending',
      business: currentBusinessName,
      saleId: id
    };

    try {
      await saveApprovalToFirestore(voidApproval);
    } catch (err) {
      console.error('Failed to save void request approval to Firestore:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8F7] text-[#18211F] flex font-['Inter',sans-serif]">
      {/* 1. Dark Emerald Persistent Manager Sidebar - Matching Admin Sidebar exactly */}
      <ManagerSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        businessName={currentBusinessName}
        salesDueCount={unitRecords.length}
        productCount={unitProducts.length}
        customerCount={unitCustomers.length}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <ManagerHeader
          activeTab={activeTab}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          businessName={currentBusinessName}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Dynamic Route/Tab View */}
        <main className="flex-1 p-4 sm:p-6 space-y-4 max-w-[1600px] w-full mx-auto">
          {activeTab === 'overview' && (
            <ManagerOverviewTab
              business={currentBusiness}
              records={filteredUnitRecords}
              products={unitProducts}
              onOpenAddSaleModal={() => setIsAddSaleModalOpen(true)}
              onOpenAddProductModal={() => setIsAddProductModalOpen(true)}
              onNavigateToSalesDue={() => setActiveTab('sales_due')}
              onNavigateToProducts={() => setActiveTab('products')}
              onNavigateToCustomers={() => setActiveTab('customers')}
            />
          )}

          {activeTab === 'sales_due' && (
            <ManagerSalesDueTab
              business={currentBusiness}
              records={filteredUnitRecords}
              products={unitProducts}
              onOpenAddSaleModal={() => setIsAddSaleModalOpen(true)}
              onDeleteRecord={handleDeleteSaleRecord}
              onViewVoucher={(rec) => setSelectedVoucherRecord(rec)}
              onOpenPayModal={(rec) => setPayDueRecordTarget(rec)}
            />
          )}

          {activeTab === 'customers' && (
            <ManagerCustomersTab
              business={currentBusiness}
              customers={unitCustomers}
              records={unitRecords}
              onOpenAddCustomerModal={() => setIsAddCustomerModalOpen(true)}
              onOpenAddSaleModal={() => setIsAddSaleModalOpen(true)}
              onDeleteCustomer={handleDeleteCustomer}
              onUpdateCustomerDue={handleUpdateCustomerDue}
              onOpenPayCustomerModal={(cust) => setPayDueCustomerTarget(cust)}
            />
          )}

          {activeTab === 'products' && (
            <ManagerProductsTab
              business={currentBusiness}
              products={unitProducts}
              onOpenAddProductModal={() => setIsAddProductModalOpen(true)}
              onDeleteProduct={handleDeleteProduct}
              onUpdateProductPrice={handleUpdateProductPrice}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        businessId={currentBusinessId}
        businessName={currentBusinessName}
        onAddProduct={handleAddProduct}
      />

      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        businessId={currentBusinessId}
        businessName={currentBusinessName}
        onAddCustomer={handleAddCustomer}
      />

      <AddSaleDueModal
        isOpen={isAddSaleModalOpen}
        onClose={() => setIsAddSaleModalOpen(false)}
        businessId={currentBusinessId}
        businessName={currentBusinessName}
        products={unitProducts}
        customers={unitCustomers}
        onAddRecord={handleAddSaleRecord}
        onOpenAddProductModal={() => {
          setIsAddSaleModalOpen(false);
          setIsAddProductModalOpen(true);
        }}
      />

      <SaleVoucherModal
        isOpen={!!selectedVoucherRecord}
        onClose={() => setSelectedVoucherRecord(null)}
        record={selectedVoucherRecord}
        businessName={currentBusinessName}
      />

      {/* Pay Due Modal - From Sales Record */}
      <PayDueModal
        isOpen={!!payDueRecordTarget}
        onClose={() => setPayDueRecordTarget(null)}
        record={payDueRecordTarget || undefined}
        businessName={currentBusinessName}
        onConfirmPayment={handleConfirmPayment}
      />

      {/* Pay Due Modal - From Customer Profile */}
      <PayDueModal
        isOpen={!!payDueCustomerTarget}
        onClose={() => setPayDueCustomerTarget(null)}
        customer={payDueCustomerTarget || undefined}
        businessName={currentBusinessName}
        onConfirmPayment={handleConfirmPayment}
      />
    </div>
  );
};
