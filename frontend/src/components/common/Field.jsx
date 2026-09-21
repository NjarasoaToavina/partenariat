export default function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium text-slate-600"> 
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}