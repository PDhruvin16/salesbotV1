import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TabContextType {
  activeUtility: string;
  setActiveUtility: (id: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider = ({ children }: { children: ReactNode }) => {
  const [activeUtility, setActiveUtility] = useState('Conversations');
  return (
    <TabContext.Provider value={{ activeUtility, setActiveUtility }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
};
