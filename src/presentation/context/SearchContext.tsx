import React, { useState } from 'react';
import { Product } from '../../core/domain/entities/Product';
import { searchContext } from '../hooks/useSearch';

export function SearchContextProvider({ children }: { children: React.ReactNode }) {
  const [lastSearchResults, setLastSearchResults] = useState<Product[]>([]);

  return (
    <searchContext.Provider value={{ lastSearchResults, setLastSearchResults }}>
      {children}
    </searchContext.Provider>
  );
}