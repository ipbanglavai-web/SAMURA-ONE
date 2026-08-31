import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { LogoProvider } from './context/LogoContext';
import { RoutePath, CriticalAlert, PendingApproval, BusinessHealthItem, BusinessManager, SaleDueRecord } from './types';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LoginPage } from './pages/Login/LoginPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { BusinessesPage } from './pages/Businesses/BusinessesPage';
import { ManagersPage } from './pages/Managers/ManagersPage';
import { FinancePage } from './pages/Finance/FinancePage';
import { SalesCollectionPage } from './pages/SalesCollection/SalesCollectionPage';
import { InventoryPage } from './pages/Inventory/InventoryPage';
import { DhakaMaalMahajanPage } from './pages/DhakaMaalMahajan/DhakaMaalMahajanPage';
import { ImportShipmentsPage } from './pages/ImportShipments/ImportShipmentsPage';
import { ColdStoragePage } from './pages/ColdStorage/ColdStoragePage';
import { PackagingPage } from './pages/Packaging/PackagingPage';
import { HospitalSummaryPage } from './pages/HospitalSummary/HospitalSummaryPage';
import { ApprovalsPage } from './pages/Approvals/ApprovalsPage';
import { AskSamuraPage } from './pages/AskSamura/AskSamuraPage';
import { SettingsPage } from './pages/Settings/SettingsPage';
import { ManagerDashboardPage } from './pages/Manager/ManagerDashboardPage';
import { ApprovalDetailModal } from './components/modals/ApprovalDetailModal';
import { AlertDetailModal } from './components/modals/AlertDetailModal';
import { BusinessUnitDetailsModal } from './components/modals/BusinessUnitDetailsModal';
import { calculateDerivedBusinessData, computeDynamicBusinesses } from './utils/businessCalculations';
import {
  KPI_DATA,
  SALES_COLLECTION_CHART_DATA,
  CRITICAL_ALERTS_DATA,
  BUSINESS_HEALTH_DATA,
  RECEIVABLE_AGING_DATA,
  PENDING_APPROVALS_DATA,
  INITIAL_MANAGERS_DATA,
  INITIAL_SALES_DUE_DATA
} from './data/mockData';
import {
  seedInitialFirestoreData,
  subscribeToBusinesses,
  subscribeToManagers,
  subscribeToAlerts,
  subscribeToApprovals,
  subscribeToSalesRecords,
  saveBusinessToFirestore,
  deleteBusinessFromFirestore,
  saveManagerToFirestore,
  deleteManagerFromFirestore,
  updateAlertStatusInFirestore,
  updateApprovalStatusInFirestore,
  deleteSaleRecordFromFirestore,
  saveSaleRecordToFirestore
} from './services/firestoreService';

const MainApp: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Navigation Route State
  const [currentPath, setCurrentPath] = useState<RoutePath>(() => {
    const hash = window.location.hash.replace('#', '') as RoutePath;
    if (hash && hash.startsWith('/')) {
      return hash;
    }
    return '/dashboard';
  });

  // Mobile sidebar drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global filters
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedBusiness, setSelectedBusiness] = useState('All Businesses');

  // Sales Due Records State (Persisted in Firestore & localStorage)
  const [salesRecords, setSalesRecords] = useState<SaleDueRecord[]>(() => {
    try {
      const stored = localStorage.getItem('samura_sales_due_records_v2') || localStorage.getItem('samura_sales_due_records');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load sales records from storage', e);
    }
    return INITIAL_SALES_DUE_DATA;
  });

  // Business Units State (Persisted in Firestore & localStorage)
  const [rawBusinesses, setRawBusinesses] = useState<BusinessHealthItem[]>(() => {
    try {
      const stored = localStorage.getItem('samura_businesses_data');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load businesses from storage', e);
    }
    return BUSINESS_HEALTH_DATA;
  });

  // Compute live dynamic businesses from active sales records
  const businesses = useMemo(() => {
    return computeDynamicBusinesses(rawBusinesses, salesRecords);
  }, [rawBusinesses, salesRecords]);

  // Dynamic Derived Financial States
  const initialDerived = calculateDerivedBusinessData(businesses, salesRecords);
  const [kpis, setKpis] = useState(initialDerived.kpis);
  const [chartData, setChartData] = useState(initialDerived.chartData);
  const [agingData, setAgingData] = useState(initialDerived.agingData);

  // Alerts & Approvals States (Persisted in Firestore & localStorage)
  const [alerts, setAlerts] = useState<CriticalAlert[]>(() => {
    try {
      const stored = localStorage.getItem('samura_alerts_data');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load alerts from storage', e);
    }
    return CRITICAL_ALERTS_DATA;
  });

  const [approvals, setApprovals] = useState<PendingApproval[]>(() => {
    try {
      const stored = localStorage.getItem('samura_approvals_data');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load approvals from storage', e);
    }
    return PENDING_APPROVALS_DATA;
  });

  // Managers State (Persisted in Firestore & localStorage)
  const [managers, setManagers] = useState<BusinessManager[]>(() => {
    try {
      const stored = localStorage.getItem('samura_managers_data');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load managers from storage', e);
    }
    return INITIAL_MANAGERS_DATA;
  });

  // Realtime Firestore listeners & initial seeding
  useEffect(() => {
    seedInitialFirestoreData();

    const unsubSales = subscribeToSalesRecords((remoteSales) => {
      setSalesRecords(remoteSales);
    });

    const unsubBiz = subscribeToBusinesses((remoteBiz) => {
      if (remoteBiz && remoteBiz.length > 0) {
        setRawBusinesses(remoteBiz);
      }
    });

    const unsubMgrs = subscribeToManagers((remoteMgrs) => {
      if (remoteMgrs) {
        setManagers(remoteMgrs);
      }
    });

    const unsubAlerts = subscribeToAlerts((remoteAlerts) => {
      if (remoteAlerts) {
        setAlerts(remoteAlerts);
      }
    });

    const unsubApps = subscribeToApprovals((remoteApps) => {
      if (remoteApps) {
        setApprovals(remoteApps);
      }
    });

    return () => {
      unsubSales();
      unsubBiz();
      unsubMgrs();
      unsubAlerts();
      unsubApps();
    };
  }, []);

  // Sync state changes to localStorage and recalculate financial data
  useEffect(() => {
    try {
      localStorage.setItem('samura_businesses_data', JSON.stringify(businesses));
    } catch (e) {
      console.error('Failed to save businesses to storage', e);
    }

    // Automatically recalculate sales, collections, receivables, chart points and aging
    const derived = calculateDerivedBusinessData(businesses, salesRecords);
    setKpis(derived.kpis);
    setChartData(derived.chartData);
    setAgingData(derived.agingData);
  }, [businesses, salesRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('samura_alerts_data', JSON.stringify(alerts));
    } catch (e) {
      console.error('Failed to save alerts to storage', e);
    }
  }, [alerts]);

  useEffect(() => {
    try {
      localStorage.setItem('samura_approvals_data', JSON.stringify(approvals));
    } catch (e) {
      console.error('Failed to save approvals to storage', e);
    }
  }, [approvals]);

  useEffect(() => {
    try {
      localStorage.setItem('samura_managers_data', JSON.stringify(managers));
    } catch (e) {
      console.error('Failed to save managers to storage', e);
    }
  }, [managers]);

  // Business Unit Handlers (Add & Cascading Delete)
  const handleAddBusiness = async (newBizData: Omit<BusinessHealthItem, 'id'>) => {
    const newUnit: BusinessHealthItem = {
      id: `bh-${Date.now()}`,
      ...newBizData
    };
    setRawBusinesses(prev => [newUnit, ...prev]);
    try {
      await saveBusinessToFirestore(newUnit);
    } catch (e) {
      console.error('Failed to save business to Firestore:', e);
    }
  };

  const handleDeleteBusiness = async (id: string) => {
    const targetBiz = businesses.find(b => b.id === id);
    if (!targetBiz) return;
    const targetName = targetBiz.name.toLowerCase();

    // 1. Remove business unit
    setRawBusinesses(prev => prev.filter(b => b.id !== id));
    try {
      await deleteBusinessFromFirestore(id);
    } catch (e) {
      console.error('Failed to delete business from Firestore:', e);
    }

    // 2. Cascade Delete: Remove all alerts associated with this business
    setAlerts(prev => prev.filter(a => {
      if (a.business && a.business.toLowerCase() === targetName) return false;
      const titleLower = a.title.toLowerCase();
      const descLower = a.description.toLowerCase();
      if (titleLower.includes(targetName) || descLower.includes(targetName)) return false;
      return true;
    }));

    // 3. Cascade Delete: Remove all pending approvals associated with this business
    setApprovals(prev => prev.filter(app => {
      if (app.business && app.business.toLowerCase() === targetName) return false;
      const reqLower = app.requester.toLowerCase();
      const descLower = app.description.toLowerCase();
      if (reqLower.includes(targetName) || descLower.includes(targetName)) return false;
      return true;
    }));

    // 4. Cascade Delete/Unassign Managers for this business
    setManagers(prev =>
      prev.filter(m => m.businessId !== id && m.businessName.toLowerCase() !== targetName)
    );

    // 5. Reset selected business filter if it was the deleted one
    if (selectedBusiness.toLowerCase() === targetName) {
      setSelectedBusiness('All Businesses');
    }
  };

  // Manager Handlers (Add & Delete)
  const handleAddManager = async (newMgrData: {
    name: string;
    phone: string;
    email: string;
    password: string;
    nid: string;
    businessId: string;
    businessName: string;
  }) => {
    const newManager: BusinessManager = {
      id: `mgr-${Date.now()}`,
      ...newMgrData,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setManagers(prev => [newManager, ...prev]);
    try {
      await saveManagerToFirestore(newManager);
    } catch (e) {
      console.error('Failed to save manager to Firestore:', e);
    }

    // Update business's assigned manager field
    setRawBusinesses(prev =>
      prev.map(b =>
        b.id === newMgrData.businessId || b.name.toLowerCase() === newMgrData.businessName.toLowerCase()
          ? { ...b, manager: newMgrData.name }
          : b
      )
    );
  };

  const handleDeleteManager = async (id: string) => {
    const target = managers.find(m => m.id === id);
    setManagers(prev => prev.filter(m => m.id !== id));
    if (target) {
      try {
        await deleteManagerFromFirestore(id);
      } catch (e) {
        console.error('Failed to delete manager from Firestore:', e);
      }
      setRawBusinesses(prev =>
        prev.map(b =>
          (b.id === target.businessId || b.name.toLowerCase() === target.businessName.toLowerCase() || b.manager === target.name)
            ? { ...b, manager: 'None' }
            : b
        )
      );
    }
  };

  // Active Modals
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<CriticalAlert | null>(null);
  const [selectedBusinessForDetails, setSelectedBusinessForDetails] = useState<BusinessHealthItem | null>(null);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as RoutePath;
      if (hash && hash.startsWith('/')) {
        setCurrentPath(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (path: RoutePath) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Approval Handlers
  const handleApprove = async (id: string, remarks?: string) => {
    const targetApproval = approvals.find(a => a.id === id);
    setApprovals(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'approved' } : item
      )
    );
    try {
      await updateApprovalStatusInFirestore(id, 'approved');
    } catch (e) {
      console.error('Failed to update approval in Firestore:', e);
    }

    // If it's a void request, delete the target sale record
    if (targetApproval && (targetApproval.type === 'void' || targetApproval.saleId || id.startsWith('app-void-'))) {
      const targetSaleId = targetApproval.saleId || (id.startsWith('app-void-') ? id.split('-')[2] || id.replace('app-void-', '') : null);
      
      let actualSaleId = targetSaleId;
      if (!actualSaleId) {
        const found = salesRecords.find(s => targetApproval.description.includes(s.invoiceNo) || targetApproval.title.includes(s.invoiceNo));
        if (found) actualSaleId = found.id;
      }

      if (actualSaleId) {
        setSalesRecords(prev => prev.filter(r => r.id !== actualSaleId));
        try {
          await deleteSaleRecordFromFirestore(actualSaleId);
        } catch (e) {
          console.error('Failed to delete voided sale record from Firestore:', e);
        }
      }
    }
  };

  const handleReject = async (id: string, remarks?: string) => {
    const targetApproval = approvals.find(a => a.id === id);
    setApprovals(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'rejected' } : item
      )
    );
    try {
      await updateApprovalStatusInFirestore(id, 'rejected');
    } catch (e) {
      console.error('Failed to update approval in Firestore:', e);
    }

    // If it's a void request, unmark voidRequested on sale record
    if (targetApproval && (targetApproval.type === 'void' || targetApproval.saleId || id.startsWith('app-void-'))) {
      const targetSaleId = targetApproval.saleId || (id.startsWith('app-void-') ? id.split('-')[2] || id.replace('app-void-', '') : null);
      
      let actualSaleId = targetSaleId;
      if (!actualSaleId) {
        const found = salesRecords.find(s => targetApproval.description.includes(s.invoiceNo) || targetApproval.title.includes(s.invoiceNo));
        if (found) actualSaleId = found.id;
      }

      if (actualSaleId) {
        const targetSale = salesRecords.find(s => s.id === actualSaleId);
        if (targetSale) {
          const restoredStatus: SaleDueRecord['status'] =
            targetSale.runningDue === 0 ? 'Full Paid' : targetSale.paid > 0 ? 'Partial Due' : 'Unpaid';
          
          const restoredSale: SaleDueRecord = {
            ...targetSale,
            status: restoredStatus,
            voidRequested: false
          };

          setSalesRecords(prev => prev.map(s => s.id === actualSaleId ? restoredSale : s));
          try {
            await saveSaleRecordToFirestore(restoredSale);
          } catch (e) {
            console.error('Failed to restore sale record in Firestore:', e);
          }
        }
      }
    }
  };

  // Alert Handlers
  const handleResolveAlert = async (id: string) => {
    setAlerts(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: 'resolved' } : item
      )
    );
    try {
      await updateAlertStatusInFirestore(id, 'resolved');
    } catch (e) {
      console.error('Failed to update alert in Firestore:', e);
    }
  };

  const handleAlertNavigate = (type: CriticalAlert['type']) => {
    if (type === 'receivable') {
      handleNavigate('/sales-collection');
    } else if (type === 'shipment') {
      handleNavigate('/import-shipments');
    } else if (type === 'coldroom') {
      handleNavigate('/cold-storage');
    }
  };

  // Unauthenticated user -> show dedicated login page
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => handleNavigate('/dashboard')} />;
  }

  // Manager Role -> Render the dedicated Manager Portal Dashboard for their assigned unit
  if (user?.userType === 'manager') {
    return <ManagerDashboardPage businesses={businesses} />;
  }

  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#F6F8F7] text-[#18211F] flex font-['Inter',sans-serif]">
      {/* 1. Dark Emerald Persistent Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        pendingApprovalsCount={pendingApprovalsCount}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          currentPath={currentPath}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          selectedBusiness={selectedBusiness}
          onSelectBusiness={setSelectedBusiness}
          businesses={businesses}
        />

        {/* Dynamic Route View */}
        <main className="flex-1 p-4 sm:p-6 space-y-4 max-w-[1600px] w-full mx-auto">
          {currentPath === '/dashboard' && (
            <DashboardPage
              userName="Sabuz"
              kpis={kpis}
              chartData={chartData}
              alerts={alerts}
              businesses={businesses}
              agingData={agingData}
              approvals={approvals}
              onNavigate={handleNavigate}
              onSelectAlert={(alt) => setSelectedAlert(alt)}
              onSelectApproval={(app) => setSelectedApproval(app)}
              onSelectBusiness={(biz) => setSelectedBusinessForDetails(biz)}
            />
          )}

          {currentPath === '/businesses' && (
            <BusinessesPage
              businesses={businesses}
              managers={managers}
              onAddBusiness={handleAddBusiness}
              onDeleteBusiness={handleDeleteBusiness}
              onAddManager={handleAddManager}
            />
          )}

          {currentPath === '/managers' && (
            <ManagersPage
              managers={managers}
              businesses={businesses}
              onAddManager={handleAddManager}
              onDeleteManager={handleDeleteManager}
              onNavigate={handleNavigate}
            />
          )}

          {currentPath === '/finance' && (
            <FinancePage />
          )}

          {currentPath === '/sales-collection' && (
            <SalesCollectionPage
              kpis={kpis}
              chartData={chartData}
              agingData={agingData}
              businesses={businesses}
            />
          )}

          {currentPath === '/inventory' && (
            <InventoryPage />
          )}

          {currentPath === '/dhaka-maal-mahajan' && (
            <DhakaMaalMahajanPage />
          )}

          {currentPath === '/import-shipments' && (
            <ImportShipmentsPage />
          )}

          {currentPath === '/cold-storage' && (
            <ColdStoragePage />
          )}

          {currentPath === '/packaging' && (
            <PackagingPage />
          )}

          {currentPath === '/hospital-summary' && (
            <HospitalSummaryPage />
          )}

          {currentPath === '/approvals' && (
            <ApprovalsPage
              approvals={approvals}
              onApprove={handleApprove}
              onReject={handleReject}
              onSelectApproval={(app) => setSelectedApproval(app)}
            />
          )}

          {currentPath === '/ask-samura' && (
            <AskSamuraPage />
          )}

          {currentPath === '/settings' && (
            <SettingsPage />
          )}
        </main>
      </div>

      {/* Global Modals */}
      {selectedBusinessForDetails && (
        <BusinessUnitDetailsModal
          isOpen={!!selectedBusinessForDetails}
          onClose={() => setSelectedBusinessForDetails(null)}
          business={selectedBusinessForDetails}
          managers={managers}
        />
      )}

      {selectedApproval && (
        <ApprovalDetailModal
          approval={selectedApproval}
          onClose={() => setSelectedApproval(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onResolve={handleResolveAlert}
          onNavigateToModule={handleAlertNavigate}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LogoProvider>
        <MainApp />
      </LogoProvider>
    </AuthProvider>
  );
}
