import React, { createContext, useContext, useState, useEffect } from 'react';

interface LogoContextType {
  customLogo: string | null;
  loginLogo: string | null;
  setCustomLogo: (logoUrl: string | null) => void;
  setLoginLogo: (logoUrl: string | null) => void;
  uploadLogoFile: (file: File, target?: 'system' | 'login') => Promise<string>;
  uploadLoginLogoFile: (file: File) => Promise<string>;
  resetLogo: () => void;
  resetLoginLogo: () => void;
  resetAllLogos: () => void;
}

const LogoContext = createContext<LogoContextType | undefined>(undefined);

const SYSTEM_STORAGE_KEY = 'samura_custom_logo_url';
const SYSTEM_BACKUP_STORAGE_KEY = 'samura_custom_logo';
const LOGIN_STORAGE_KEY = 'samura_login_logo_url';
const LOGIN_BACKUP_STORAGE_KEY = 'samura_login_logo';

export const LogoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customLogo, setCustomLogoState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(SYSTEM_STORAGE_KEY) || localStorage.getItem(SYSTEM_BACKUP_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  const [loginLogo, setLoginLogoState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOGIN_STORAGE_KEY) || localStorage.getItem(LOGIN_BACKUP_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  // Sync System Logo to localStorage
  useEffect(() => {
    try {
      if (customLogo) {
        localStorage.setItem(SYSTEM_STORAGE_KEY, customLogo);
        localStorage.setItem(SYSTEM_BACKUP_STORAGE_KEY, customLogo);
      } else {
        localStorage.removeItem(SYSTEM_STORAGE_KEY);
        localStorage.removeItem(SYSTEM_BACKUP_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync system logo to local storage', e);
    }
  }, [customLogo]);

  // Sync Login Logo to localStorage
  useEffect(() => {
    try {
      if (loginLogo) {
        localStorage.setItem(LOGIN_STORAGE_KEY, loginLogo);
        localStorage.setItem(LOGIN_BACKUP_STORAGE_KEY, loginLogo);
      } else {
        localStorage.removeItem(LOGIN_STORAGE_KEY);
        localStorage.removeItem(LOGIN_BACKUP_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync login logo to local storage', e);
    }
  }, [loginLogo]);

  const setCustomLogo = (logoUrl: string | null) => {
    setCustomLogoState(logoUrl);
  };

  const setLoginLogo = (logoUrl: string | null) => {
    setLoginLogoState(logoUrl);
  };

  const uploadLogoFile = (file: File, target: 'system' | 'login' = 'system'): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please select a valid image file (PNG, JPG, SVG, WebP).'));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('Image size should be under 5MB.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          if (target === 'login') {
            setLoginLogoState(result);
          } else {
            setCustomLogoState(result);
          }
          resolve(result);
        } else {
          reject(new Error('Failed to read image file.'));
        }
      };
      reader.onerror = () => reject(new Error('File reader error.'));
      reader.readAsDataURL(file);
    });
  };

  const uploadLoginLogoFile = (file: File): Promise<string> => {
    return uploadLogoFile(file, 'login');
  };

  const resetLogo = () => {
    setCustomLogoState(null);
  };

  const resetLoginLogo = () => {
    setLoginLogoState(null);
  };

  const resetAllLogos = () => {
    setCustomLogoState(null);
    setLoginLogoState(null);
  };

  return (
    <LogoContext.Provider
      value={{
        customLogo,
        loginLogo,
        setCustomLogo,
        setLoginLogo,
        uploadLogoFile,
        uploadLoginLogoFile,
        resetLogo,
        resetLoginLogo,
        resetAllLogos
      }}
    >
      {children}
    </LogoContext.Provider>
  );
};

export const useLogo = () => {
  const context = useContext(LogoContext);
  if (!context) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
};

