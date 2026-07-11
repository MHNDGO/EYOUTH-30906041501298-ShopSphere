import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function Cart() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => (await api.get('/cart')).data,
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }) => api.put(`/cart/${itemId}`, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const removeMutation = useMutation({
    mutationFn: (itemId) => api.delete(`/cart/${itemId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  if (isLoading) return <Loading label="Loading cart..." />;
  if (isError) return <ErrorMessage message="Could not load your cart." />;

  return (
    <div className="container">
      <h1 className="page-header">Your Cart</h1>
      {data.items.length === 0 && <p>Your cart is empty.</p>}
      {data.items.map((item) => (
        <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <strong>{item.product.name}</strong>
            <p>${item.product.price.toFixed(2)} each</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="number"
              min="1"
              value={item.quantity}
              style={{ width: 60 }}
              onChange={(e) => updateMutation.mutate({ itemId: item.id, quantity: Number(e.target.value) })}
            />
            <button className="btn btn-danger" onClick={() => removeMutation.mutate(item.id)}>Remove</button>
          </div>
        </div>
      ))}
      {data.items.length > 0 && <h2>Total: ${data.total.toFixed(2)}</h2>}
    </div>
  );
}
