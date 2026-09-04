import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, BusinessManager } from '../types';
import { INITIAL_MANAGERS_DATA } from '../data/mockData';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  selectBusiness: (businessId: string, businessName: string) => void;
  clearSelectedBusiness: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-founder-01',
  name: 'Md. Labibul Haque Sabuz',
  email: 'admin@admin.com',
  role: 'Founder & Group Managing Director',
  avatarInitials: 'S',
  title: 'Founder View',
  userType: 'admin'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('samura_one_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    // Default to null so user MUST log in with admin credentials to access dashboard
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('samura_one_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('samura_one_user');
    }
  }, [user]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    // Simulate realistic fast authentication handshake
    await new Promise((resolve) => setTimeout(resolve, 350));
    setIsLoading(false);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (cleanEmail === 'admin@admin.com' && cleanPass === 'admin123') {
      const authUser: UserProfile = {
        ...DEFAULT_USER,
        email: cleanEmail
      };
      setUser(authUser);
      return { success: true };
    }

    // Check manager logins
    try {
      let managersList: BusinessManager[] = [...INITIAL_MANAGERS_DATA];
      
      const storedManagers = localStorage.getItem('samura_managers_data');
      if (storedManagers) {
        try {
          const parsed = JSON.parse(storedManagers);
          if (Array.isArray(parsed)) {
            managersList = [...parsed, ...managersList];
          }
        } catch {
          // ignore
        }
      }

      // Try fetching live managers list from Firestore
      try {
        const snap = await getDocs(collection(db, 'businessManagers'));
        if (!snap.empty) {
          const fsList: BusinessManager[] = [];
          snap.forEach(doc => {
            fsList.push({ id: doc.id, ...doc.data() } as BusinessManager);
          });
          if (fsList.length > 0) {
            managersList = [...fsList, ...managersList];
          }
        }
      } catch (fsErr) {
        console.warn('Firestore manager login lookup note:', fsErr);
      }

      const foundMgr = managersList.find(m => {
        if (!m || !m.email) return false;
        const mEmail = m.email.toLowerCase().trim();
        const emailMatch = mEmail === cleanEmail || mEmail.split('@')[0] === cleanEmail || cleanEmail.includes(mEmail.split('@')[0]);
        // Support password set by admin (or fallback password123 / admin123 for convenience)
        const passMatch = !m.password || m.password === cleanPass || cleanPass === 'password123' || cleanPass === 'admin123';
        return emailMatch && passMatch;
      });

      if (foundMgr) {
        const initials = (foundMgr.name || 'M').split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'M';
        const isGM = foundMgr.managerType === 'general_manager' ||
          (foundMgr.businessId === 'all') ||
          (foundMgr.businessName && foundMgr.businessName.toLowerCase().includes('all')) ||
          (foundMgr.name && foundMgr.name.toLowerCase().includes('(gm)'));

        const assignedIds = foundMgr.assignedBusinessIds && foundMgr.assignedBusinessIds.length > 0
          ? foundMgr.assignedBusinessIds
          : isGM
          ? ['all']
          : [foundMgr.businessId || 'bh-1'];

        const assignedNames = foundMgr.assignedBusinessNames && foundMgr.assignedBusinessNames.length > 0
          ? foundMgr.assignedBusinessNames
          : [foundMgr.businessName || 'Elenga Fruits'];

        const mgrUser: UserProfile = {
          id: foundMgr.id,
          name: foundMgr.name,
          email: foundMgr.email,
          role: isGM ? 'General Manager' : 'Business Unit Manager',
          avatarInitials: initials,
          title: isGM ? 'General Manager Command' : `${foundMgr.businessName || 'Business Unit'} · Manager Command`,
          userType: isGM ? 'general_manager' : 'manager',
          managerType: isGM ? 'general_manager' : 'unit_manager',
          businessId: isGM ? undefined : (foundMgr.businessId || 'bh-1'),
          businessName: isGM ? undefined : (foundMgr.businessName || 'Elenga Fruits'),
          phone: foundMgr.phone,
          nid: foundMgr.nid,
          assignedBusinessIds: assignedIds,
          assignedBusinessNames: assignedNames,
          selectedBusinessId: undefined,
          selectedBusinessName: undefined
        };
        setUser(mgrUser);
        return { success: true };
      }
    } catch (e) {
      console.error('Manager login evaluation error', e);
    }

    return { success: false, error: 'Invalid email or password.' };
  };

  const selectBusiness = (businessId: string, businessName: string) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        businessId,
        businessName,
        selectedBusinessId: businessId,
        selectedBusinessName: businessName,
        title: `${businessName} · Manager Command`
      };
    });
  };

  const clearSelectedBusiness = () => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        businessId: undefined,
        businessName: undefined,
        selectedBusinessId: undefined,
        selectedBusinessName: undefined,
        title: 'General Manager Command'
      };
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('samura_one_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
        selectBusiness,
        clearSelectedBusiness
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
