import { useState } from 'react';
import { useProducts, useCategories } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function ProductListing() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const { data: categories } = useCategories();
  const { data, isLoading, isError } = useProducts({ q, category, sortBy, order, page, limit: 8 });

  return (
    <div className="container">
      <h1 className="page-header">Products</h1>

      <div className="toolbar">
        <input
          placeholder="Search products..."
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
        />
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Newest</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {isLoading && <Loading label="Loading products..." />}
      {isError && <ErrorMessage message="Could not load products right now." />}

      {data && (
        <>
          <div className="grid">
            {data.items.length === 0 && <p>No products match your search.</p>}
            {data.items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          <div className="toolbar">
            <button
              className="btn btn-outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span>Page {data.page} of {data.totalPages}</span>
            <button
              className="btn btn-outline"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
