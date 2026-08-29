import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  SaleDueRecord,
  UnitProduct,
  ManagerCustomer,
  BusinessHealthItem,
  BusinessManager,
  CriticalAlert,
  PendingApproval
} from '../types';
import {
  INITIAL_SALES_DUE_DATA,
  INITIAL_PRODUCTS_DATA,
  INITIAL_CUSTOMERS_DATA,
  BUSINESS_HEALTH_DATA,
  INITIAL_MANAGERS_DATA,
  CRITICAL_ALERTS_DATA,
  PENDING_APPROVALS_DATA
} from '../data/mockData';

const SALES_COLLECTION = 'salesDueRecords';
const PRODUCTS_COLLECTION = 'managerProducts';
const CUSTOMERS_COLLECTION = 'managerCustomers';
const BUSINESSES_COLLECTION = 'businessUnits';
const MANAGERS_COLLECTION = 'businessManagers';
const ALERTS_COLLECTION = 'criticalAlerts';
const APPROVALS_COLLECTION = 'pendingApprovals';

// Seed initial dataset if Firestore collections are empty
export async function seedInitialFirestoreData() {
  try {
    const salesSnap = await getDocs(collection(db, SALES_COLLECTION));
    const bizSnap = await getDocs(collection(db, BUSINESSES_COLLECTION));
    
    // Only seed if both sales and businesses are totally empty on fresh database start
    if (salesSnap.empty && bizSnap.empty) {
      console.log('Seeding initial system collections into Firestore...');
      
      const salesBatch = writeBatch(db);
      INITIAL_SALES_DUE_DATA.forEach((record) => {
        const ref = doc(db, SALES_COLLECTION, record.id);
        salesBatch.set(ref, record);
      });
      await salesBatch.commit();

      const prodBatch = writeBatch(db);
      INITIAL_PRODUCTS_DATA.forEach((prod) => {
        const ref = doc(db, PRODUCTS_COLLECTION, prod.id);
        prodBatch.set(ref, prod);
      });
      await prodBatch.commit();

      const custBatch = writeBatch(db);
      INITIAL_CUSTOMERS_DATA.forEach((cust) => {
        const ref = doc(db, CUSTOMERS_COLLECTION, cust.id);
        custBatch.set(ref, cust);
      });
      await custBatch.commit();

      const bizBatch = writeBatch(db);
      BUSINESS_HEALTH_DATA.forEach((b) => {
        const ref = doc(db, BUSINESSES_COLLECTION, b.id);
        bizBatch.set(ref, b);
      });
      await bizBatch.commit();

      const mgrBatch = writeBatch(db);
      INITIAL_MANAGERS_DATA.forEach((m) => {
        const ref = doc(db, MANAGERS_COLLECTION, m.id);
        mgrBatch.set(ref, m);
      });
      await mgrBatch.commit();

      const altBatch = writeBatch(db);
      CRITICAL_ALERTS_DATA.forEach((a) => {
        const ref = doc(db, ALERTS_COLLECTION, a.id);
        altBatch.set(ref, a);
      });
      await altBatch.commit();

      const appBatch = writeBatch(db);
      PENDING_APPROVALS_DATA.forEach((app) => {
        const ref = doc(db, APPROVALS_COLLECTION, app.id);
        appBatch.set(ref, app);
      });
      await appBatch.commit();
      console.log('Firestore successfully seeded with initial collections!');
    }
  } catch (err) {
    console.warn('Firestore seed warning (offline or permissions):', err);
  }
}

// ---------------- Realtime Subscriptions ----------------

export function subscribeToSalesRecords(
  callback: (records: SaleDueRecord[]) => void
) {
  const q = query(collection(db, SALES_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const records: SaleDueRecord[] = [];
      snapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() } as SaleDueRecord);
      });
      callback(records);
    },
    (error) => {
      console.warn('Sales Firestore listener error:', error);
    }
  );
}

export function subscribeToProducts(
  callback: (products: UnitProduct[]) => void
) {
  const q = query(collection(db, PRODUCTS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const products: UnitProduct[] = [];
      snapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as UnitProduct);
      });
      callback(products);
    },
    (error) => {
      console.warn('Products Firestore listener error:', error);
    }
  );
}

export function subscribeToCustomers(
  callback: (customers: ManagerCustomer[]) => void
) {
  const q = query(collection(db, CUSTOMERS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const customers: ManagerCustomer[] = [];
      snapshot.forEach((doc) => {
        customers.push({ id: doc.id, ...doc.data() } as ManagerCustomer);
      });
      callback(customers);
    },
    (error) => {
      console.warn('Customers Firestore listener error:', error);
    }
  );
}

export function subscribeToBusinesses(
  callback: (businesses: BusinessHealthItem[]) => void
) {
  const q = query(collection(db, BUSINESSES_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: BusinessHealthItem[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as BusinessHealthItem);
      });
      callback(list);
    },
    (error) => {
      console.warn('Businesses Firestore listener error:', error);
    }
  );
}

export function subscribeToManagers(
  callback: (managers: BusinessManager[]) => void
) {
  const q = query(collection(db, MANAGERS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: BusinessManager[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as BusinessManager);
      });
      callback(list);
    },
    (error) => {
      console.warn('Managers Firestore listener error:', error);
    }
  );
}

export function subscribeToAlerts(
  callback: (alerts: CriticalAlert[]) => void
) {
  const q = query(collection(db, ALERTS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: CriticalAlert[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as CriticalAlert);
      });
      callback(list);
    },
    (error) => {
      console.warn('Alerts Firestore listener error:', error);
    }
  );
}

export function subscribeToApprovals(
  callback: (approvals: PendingApproval[]) => void
) {
  const q = query(collection(db, APPROVALS_COLLECTION));
  return onSnapshot(
    q,
    (snapshot) => {
      const list: PendingApproval[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as PendingApproval);
      });
      callback(list);
    },
    (error) => {
      console.warn('Approvals Firestore listener error:', error);
    }
  );
}

// ---------------- Sales Records CRUD ----------------

export async function saveSaleRecordToFirestore(record: SaleDueRecord) {
  try {
    const ref = doc(db, SALES_COLLECTION, record.id);
    await setDoc(ref, record, { merge: true });
  } catch (err) {
    console.warn('Failed to save sale record to Firestore:', err);
  }
}

export async function deleteSaleRecordFromFirestore(recordId: string) {
  try {
    const ref = doc(db, SALES_COLLECTION, recordId);
    await deleteDoc(ref);
  } catch (err) {
    console.warn('Failed to delete sale record from Firestore:', err);
  }
}

export async function updateSalePaymentInFirestore(
  recordId: string,
  updatedData: Partial<SaleDueRecord>
) {
  try {
    const ref = doc(db, SALES_COLLECTION, recordId);
    await updateDoc(ref, updatedData);
  } catch (err) {
    console.warn('Failed to update sale payment in Firestore:', err);
  }
}

// ---------------- Products CRUD ----------------

export async function saveProductToFirestore(product: UnitProduct) {
  try {
    const ref = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(ref, product, { merge: true });
  } catch (err) {
    console.warn('Failed to save product to Firestore:', err);
  }
}

export async function deleteProductFromFirestore(productId: string) {
  try {
    const ref = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(ref);
  } catch (err) {
    console.warn('Failed to delete product from Firestore:', err);
  }
}

// ---------------- Customers CRUD ----------------

export async function saveCustomerToFirestore(customer: ManagerCustomer) {
  try {
    const ref = doc(db, CUSTOMERS_COLLECTION, customer.id);
    await setDoc(ref, customer, { merge: true });
  } catch (err) {
    console.warn('Failed to save customer to Firestore:', err);
  }
}

export async function deleteCustomerFromFirestore(customerId: string) {
  try {
    const ref = doc(db, CUSTOMERS_COLLECTION, customerId);
    await deleteDoc(ref);
  } catch (err) {
    console.warn('Failed to delete customer from Firestore:', err);
  }
}

export async function updateCustomerDueInFirestore(
  customerId: string,
  newDueAmount: number,
  additionalSales: number = 0,
  additionalPaid: number = 0,
  lastDate?: string
) {
  try {
    const ref = doc(db, CUSTOMERS_COLLECTION, customerId);
    const dataToUpdate: any = {
      dueAmount: newDueAmount
    };
    if (lastDate) dataToUpdate.lastTransactionDate = lastDate;
    await updateDoc(ref, dataToUpdate);
  } catch (err) {
    console.warn('Failed to update customer due in Firestore:', err);
  }
}

// ---------------- Businesses CRUD ----------------

export async function saveBusinessToFirestore(business: BusinessHealthItem) {
  try {
    const ref = doc(db, BUSINESSES_COLLECTION, business.id);
    await setDoc(ref, business, { merge: true });
  } catch (err) {
    console.warn('Failed to save business to Firestore:', err);
  }
}

export async function deleteBusinessFromFirestore(businessId: string) {
  try {
    const ref = doc(db, BUSINESSES_COLLECTION, businessId);
    await deleteDoc(ref);
  } catch (err) {
    console.warn('Failed to delete business from Firestore:', err);
  }
}

// ---------------- Managers CRUD ----------------

export async function saveManagerToFirestore(manager: BusinessManager) {
  try {
    const ref = doc(db, MANAGERS_COLLECTION, manager.id);
    await setDoc(ref, manager, { merge: true });
  } catch (err) {
    console.warn('Failed to save manager to Firestore:', err);
  }
}

export async function deleteManagerFromFirestore(managerId: string) {
  try {
    const ref = doc(db, MANAGERS_COLLECTION, managerId);
    await deleteDoc(ref);
  } catch (err) {
    console.warn('Failed to delete manager from Firestore:', err);
  }
}

// ---------------- Alerts CRUD ----------------

export async function saveAlertToFirestore(alert: CriticalAlert) {
  try {
    const ref = doc(db, ALERTS_COLLECTION, alert.id);
    await setDoc(ref, alert, { merge: true });
  } catch (err) {
    console.warn('Failed to save alert to Firestore:', err);
  }
}

export async function updateAlertStatusInFirestore(alertId: string, status: CriticalAlert['status']) {
  try {
    const ref = doc(db, ALERTS_COLLECTION, alertId);
    await updateDoc(ref, { status });
  } catch (err) {
    console.warn('Failed to update alert status in Firestore:', err);
  }
}

// ---------------- Approvals CRUD ----------------

export async function saveApprovalToFirestore(approval: PendingApproval) {
  try {
    const ref = doc(db, APPROVALS_COLLECTION, approval.id);
    await setDoc(ref, approval, { merge: true });
  } catch (err) {
    console.warn('Failed to save approval to Firestore:', err);
  }
}

export async function updateApprovalStatusInFirestore(approvalId: string, status: PendingApproval['status']) {
  try {
    const ref = doc(db, APPROVALS_COLLECTION, approvalId);
    await updateDoc(ref, { status });
  } catch (err) {
    console.warn('Failed to update approval status in Firestore:', err);
  }
}
