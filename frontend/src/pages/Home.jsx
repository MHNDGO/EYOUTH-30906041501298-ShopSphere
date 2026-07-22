import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function Home() {
  const { data, isLoading, isError } = useProducts({ limit: 4, sortBy: 'createdAt', order: 'desc' });

  return (
    <div className="container">
      <div className="page-header">
        <h1>Welcome to ShopEasy</h1>
        <p>Everything you need, all in one place.</p>
        <Link to="/products" className="btn">Browse all products</Link>
      </div>

      <h2 style={{ marginTop: 30 }}>New arrivals</h2>
      {isLoading && <Loading label="Loading products..." />}
      {isError && <ErrorMessage message="Could not load products right now." />}
      {data && (
        <div className="grid">
          {data.items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
