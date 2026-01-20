import api from './api';
import { Product, ApiResponse, ProductFilters } from '../types';

export const productService = {
  getProducts: async (filters?: ProductFilters): Promise<ApiResponse<Product[]>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data.data;
  },

  getFeaturedProducts: async (limit?: number): Promise<Product[]> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/products/featured${params}`);
    return response.data.data;
  },

  getRelatedProducts: async (id: string, limit?: number): Promise<Product[]> => {
    const params = limit ? `?limit=${limit}` : '';
    const response = await api.get(`/products/${id}/related${params}`);
    return response.data.data;
  },

  createProduct: async (data: Partial<Product>): Promise<Product> => {
    const response = await api.post('/products', data);
    return response.data.data;
  },

  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  }
};
