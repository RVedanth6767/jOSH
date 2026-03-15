import { createContext, useContext, useMemo, useState } from 'react';
import { mockEmployees } from '../constants/mockData';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [employees] = useState(mockEmployees);

  const value = useMemo(() => ({ employees }), [employees]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
