import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export function useProducts(filters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const res = await api.get('/products', { params: filters });
      return res.data;
    },
    keepPreviousData: true,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });
}
