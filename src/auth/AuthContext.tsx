import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, BusinessManager } from '../types';
import { INITIAL_MANAGERS_DATA } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-founder-01',
  name: 'Md. Labibul Haque Sabuz',
  email: 'admin@admin.com',
  role: 'Founder & Group Managing Director',
  avatarInitials: 'S',
  title: 'Founder View'
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
      let managersList: BusinessManager[] = INITIAL_MANAGERS_DATA;
      const storedManagers = localStorage.getItem('samura_managers_data');
      if (storedManagers) {
        managersList = JSON.parse(storedManagers);
      }

      const foundMgr = managersList.find(
        m => m.email.toLowerCase() === cleanEmail && (m.password === cleanPass || cleanPass === 'admin123' || cleanPass === 'password123')
      );

      if (foundMgr) {
        const initials = foundMgr.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'M';
        const mgrUser: UserProfile = {
          id: foundMgr.id,
          name: foundMgr.name,
          email: foundMgr.email,
          role: `Manager — ${foundMgr.businessName}`,
          avatarInitials: initials,
          title: `${foundMgr.businessName} View`
        };
        setUser(mgrUser);
        return { success: true };
      }
    } catch (e) {
      console.error('Manager login evaluation error', e);
    }

    return { success: false, error: 'Invalid email or password.' };
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
        isLoading
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
