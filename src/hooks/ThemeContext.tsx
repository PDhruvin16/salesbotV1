import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import storage, { StorageKeys } from '../utils/Storage';
import type { ThemeType } from '../utils/colors';

export type { ThemeType };

export interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  //  Load theme synchronously from MMKV (no async needed!)
  const [theme, setTheme] = useState<ThemeType>(() => {
    const stored = storage.getString(StorageKeys.appTheme);
    return stored === 'dark' || stored === 'light' ? stored : 'light';
  });

  //  Persist theme synchronously when it changes
  useEffect(() => {
    storage.setString(StorageKeys.appTheme, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setThemeValue = useCallback((value: ThemeType) => {
    setTheme(value);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeValue }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
