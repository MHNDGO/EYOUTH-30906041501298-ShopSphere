import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useProducts, useCategories } from '../hooks/useProducts';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', categoryId: '' });
  const [message, setMessage] = useState('');

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => (await api.get('/stats')).data,
  });

  const { data: categories } = useCategories();
  const { data: productsData, isLoading, isError } = useProducts({ limit: 50 });

  const createMutation = useMutation({
    mutationFn: () => api.post('/products', {
      name: form.name,
      description: form.description,
      price: form.price,
      stock: form.stock,
      categoryId: form.categoryId,
    }),
    onSuccess: () => {
      setMessage('Product created.');
      setForm({ name: '', description: '', price: '', stock: '', categoryId: '' });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => setMessage('Could not create product.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });

  return (
    <div className="container">
      <h1 className="page-header">Admin Dashboard</h1>

      {stats && (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          <div className="card"><strong>{stats.totalUsers}</strong><p>Users</p></div>
          <div className="card"><strong>{stats.totalProducts}</strong><p>Products</p></div>
          <div className="card"><strong>{stats.totalCategories}</strong><p>Categories</p></div>
          <div className="card"><strong>{stats.totalReviews}</strong><p>Reviews</p></div>
          <div className="card"><strong>{stats.totalStockUnits}</strong><p>Stock units</p></div>
        </div>
      )}

      <h2 style={{ marginTop: 30 }}>Add product</h2>
      <div className="card" style={{ maxWidth: 500 }}>
        {message && <p>{message}</p>}
        <div className="form-field">
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-field">
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="form-field">
          <label>Price</label>
          <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>
        <div className="form-field">
          <label>Stock</label>
          <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        </div>
        <div className="form-field">
          <label>Category</label>
          <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">Select category</option>
            {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button className="btn" onClick={() => createMutation.mutate()}>Create product</button>
      </div>

      <h2 style={{ marginTop: 30 }}>All products</h2>
      {isLoading && <Loading label="Loading products..." />}
      {isError && <ErrorMessage message="Could not load products." />}
      {productsData && (
        <table>
          <thead>
            <tr><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th></th></tr>
          </thead>
          <tbody>
            {productsData.items.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>{p.category?.name}</td>
                <td><button className="btn btn-danger" onClick={() => deleteMutation.mutate(p.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
