import React, { createContext, useContext, useEffect, useState } from 'react';

interface TableContextType {
  tableNumber: string | null;
  setTableNumber: (table: string | null) => void;
  clearTableNumber: () => void;
}

const TableContext = createContext<TableContextType | undefined>(undefined);

export const useTable = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};

interface TableProviderProps {
  children: React.ReactNode;
}

export const TableProvider: React.FC<TableProviderProps> = ({ children }) => {
  const [tableNumber, setTableNumberState] = useState<string | null>(null);

  // Load table number from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tableNumber');
    if (stored) {
      setTableNumberState(stored);
    }
  }, []);

  // Save to localStorage whenever table number changes
  useEffect(() => {
    if (tableNumber !== null) {
      localStorage.setItem('tableNumber', tableNumber.toString());
    } else {
      localStorage.removeItem('tableNumber');
    }
  }, [tableNumber]);

  const setTableNumber = (table: string | null) => {
    setTableNumberState(table);
  };

  const clearTableNumber = () => {
    setTableNumberState(null);
    localStorage.removeItem('tableNumber');
  };

  const value = {
    tableNumber,
    setTableNumber,
    clearTableNumber,
  };

  return (
    <TableContext.Provider value={value}>
      {children}
    </TableContext.Provider>
  );
};

