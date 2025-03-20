import { Product } from '../../core/domain/entities/Product';
import { ApiService } from '../services/ApiService';

export class ProductRepository {
  private static instance: ProductRepository;
  private apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  static getInstance(): ProductRepository {
    if (!ProductRepository.instance) {
      ProductRepository.instance = new ProductRepository();
    }
    return ProductRepository.instance;
  }

  async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      const response = await this.apiService.get(`/products/code/${barcode}`);
      if (!response) {
        console.warn('No response from API');
        return null;
      }
      
      // Handle both possible API response formats
      const productData = response.product || response;
      if (!productData) {
        console.warn('Product not found:', response?.status_verbose);
        return null;
      }
      
      return this.mapToProduct(productData);
    } catch (error) {
      console.error('Error fetching product:', error);
      return null; // Return null instead of throwing
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await this.apiService.get(`/products/search?query=${query}&lang=fr`);
      if (!response || !Array.isArray(response)) {
        console.warn('Unexpected API response format:', response);
        return [];
      }
      const mappedProducts = response
        .filter(item => item && item.code)
        .map(item => this.mapToProduct(item));
      return mappedProducts;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  private mapToProduct(data: any): Product {
    return {
      code: data.code || '',
      product_name_fr: data.product_name_fr || '',
      product_name_en: data.product_name_en || 'Unknown Product',
      calories: parseFloat(data.calories?.toString() || '0'),
      sugars: parseFloat(data.sugars?.toString() || '0'),
      fat: parseFloat(data.fat?.toString() || '0'),
      carbohydrates: parseFloat(data.carbohydrates?.toString() || '0'),
      proteins: parseFloat(data.proteins?.toString() || '0'),
      salt: parseFloat(data.salt?.toString() || '0'),
      saturated_fat: parseFloat(data.saturated_fat?.toString() || '0'),
      fiber: parseFloat(data.fiber?.toString() || '0'),
      portion: data.portion || '100g',
    };
  }
}