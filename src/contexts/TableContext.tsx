import React, { createContext, useContext, useEffect, useState } from 'react';

interface TableContextType {
  tableNumber: number | null;
  setTableNumber: (table: number | null) => void;
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
  const [tableNumber, setTableNumberState] = useState<number | null>(null);

  // Load table number from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tableNumber');
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed)) {
        setTableNumberState(parsed);
      }
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

  const setTableNumber = (table: number | null) => {
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

