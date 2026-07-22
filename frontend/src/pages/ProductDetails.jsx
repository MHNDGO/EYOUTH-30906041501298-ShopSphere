import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProduct } from '../hooks/useProducts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [addMessage, setAddMessage] = useState('');

  const { data: product, isLoading, isError } = useProduct(id);

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => (await api.get(`/products/${id}/reviews`)).data,
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: () => api.post('/cart', { productId: id, quantity: 1 }),
    onSuccess: () => {
      setAddMessage('Added to cart!');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => setAddMessage('Could not add to cart.'),
  });

  const reviewMutation = useMutation({
    mutationFn: () => api.post(`/products/${id}/reviews`, { rating, comment }),
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
    },
  });

  if (isLoading) return <Loading label="Loading product..." />;
  if (isError || !product) return <ErrorMessage message="Product not found." />;

  return (
    <div className="container">
      <div className="card" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <img
          src={product.imageUrl ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${product.imageUrl}` : 'https://placehold.co/400x300?text=No+Image'}
          alt={product.name}
          style={{ width: 300, height: 220, objectFit: 'cover', borderRadius: 8 }}
        />
        <div>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p><strong>${product.price?.toFixed(2)}</strong> — {product.stock} in stock</p>
          {user ? (
            <button className="btn" onClick={() => addToCartMutation.mutate()}>Add to cart</button>
          ) : (
            <p><em>Log in to add this to your cart.</em></p>
          )}
          {addMessage && <p>{addMessage}</p>}
        </div>
      </div>

      <h2 style={{ marginTop: 30 }}>Reviews</h2>
      {user && (
        <div className="card" style={{ maxWidth: 400 }}>
          <div className="form-field">
            <label>Rating</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
            </select>
          </div>
          <div className="form-field">
            <label>Comment</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          <button className="btn" onClick={() => reviewMutation.mutate()}>Submit review</button>
        </div>
      )}
      {reviews?.length === 0 && <p>No reviews yet.</p>}
      {reviews?.map((r) => (
        <div key={r._id} className="card" style={{ marginTop: 10 }}>
          <strong>{r.rating} stars</strong> — {r.userName}
          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
