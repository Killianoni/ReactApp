import React, { useState, useCallback, useContext } from 'react';
import { Product } from '../../core/domain/entities/Product';
import { ProductRepository } from '../../data/repositories/ProductRepository';
import { useDebounce } from './useDebounce';

export const searchContext = React.createContext<{
  lastSearchResults: Product[];
  setLastSearchResults: (products: Product[]) => void;
}>({
  lastSearchResults: [],
  setLastSearchResults: () => {},
});

export function useSearch() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLastSearchResults } = useContext(searchContext);

  const search = useCallback(async (query: string) => {
    if (query.length < 2) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const productRepo = ProductRepository.getInstance();
      const results = await productRepo.searchProducts(query);
      
      setProducts(results);
      setLastSearchResults(results);
      setError(null);
    } catch (err) {
      setError('Failed to search products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProducts = useDebounce(search, 300);

  return { products, loading, error, searchProducts };
}
