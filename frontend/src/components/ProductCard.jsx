import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="card product-card">
      <img
        src={product.imageUrl ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${product.imageUrl}` : 'https://placehold.co/300x200?text=No+Image'}
        alt={product.name}
      />
      <h3>{product.name}</h3>
      <p>${product.price?.toFixed(2)}</p>
      {product.category?.name && <small>{product.category.name}</small>}
    </Link>
  );
}
