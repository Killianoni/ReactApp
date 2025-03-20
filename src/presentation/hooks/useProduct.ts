import { useState, useEffect } from 'react';
import { Product } from '../../core/domain/entities/Product';
import { ProductRepository } from '../../data/repositories/ProductRepository';

export function useProduct(barcode: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productRepo = ProductRepository.getInstance();
        const result = await productRepo.getProductByBarcode(barcode);
        if (!result) {
          throw new Error('Product not found');
        }
        setProduct(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product details');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [barcode]);

  return { product, loading, error };
} 