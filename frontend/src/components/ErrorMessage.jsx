export default function ErrorMessage({ message = 'Something went wrong.' }) {
  return <div className="error-box" role="alert">{message}</div>;
}
