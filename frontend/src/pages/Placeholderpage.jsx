export default function PlaceholderPage({ title }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-10 flex flex-col items-center justify-center text-center min-h-[300px]">
      <h2 className="text-lg font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-sm text-slate-400">
        Cette page est en cours de construction.
      </p>
    </div>
  );
}