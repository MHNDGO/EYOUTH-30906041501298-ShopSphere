export default function Loading({ label = 'Loading...' }) {
  return <div className="loading-box" role="status">{label}</div>;
}
