export default function Spinner({ size = 18, className = "" }) {
  return (
    <span
      style={{ width: size, height: size }}
      className={`inline-block rounded-full border-2 border-current border-t-transparent animate-spin ${className}`}
      role="status"
      aria-label="Chargement"
    />
  );
}