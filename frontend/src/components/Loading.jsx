import { Loader2 } from "lucide-react";

export function Spinner({ size = 24, className = "" }) {
  return <Loader2 className={`animate-spin ${className}`} size={size} />;
}

export function TableSkeleton({ rows = 5, darkMode = false }) {
  const bg = darkMode ? "bg-[#334155]" : "bg-slate-200";
  return (
    <div className={`${darkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-slate-200"} border rounded-md overflow-hidden`}>
      <table className="w-full">
        <thead>
          <tr className={`${darkMode ? "bg-[#161E2E]" : "bg-slate-100"} border-b`}>
            <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-widest text-slate-400">Barrio</th>
            <th className="px-8 py-5 text-center text-xs font-bold uppercase tracking-widest text-slate-400">Magnitud</th>
            <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-widest text-slate-400">Tipo</th>
            <th className="px-8 py-5 text-left text-xs font-bold uppercase tracking-widest text-slate-400">Fecha</th>
            <th className="px-8 py-5 text-right text-xs font-bold uppercase tracking-widest text-slate-400">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/10">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="px-8 py-6">
                <div className={`h-4 ${bg} rounded w-3/4`}></div>
              </td>
              <td className="px-8 py-6 text-center">
                <div className={`h-4 ${bg} rounded w-1/3 mx-auto`}></div>
              </td>
              <td className="px-8 py-6">
                <div className={`h-6 ${bg} rounded w-20`}></div>
              </td>
              <td className="px-8 py-6">
                <div className={`h-4 ${bg} rounded w-24`}></div>
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex justify-end gap-2">
                  <div className={`h-8 ${bg} rounded w-8`}></div>
                  <div className={`h-8 ${bg} rounded w-8`}></div>
                  <div className={`h-8 ${bg} rounded w-8`}></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function KPISkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-slate-200 p-6 rounded-md shadow-sm animate-pulse">
          <div className="h-3 bg-slate-200 rounded w-24 mb-2"></div>
          <div className="h-8 bg-slate-200 rounded w-32"></div>
        </div>
      ))}
    </div>
  );
}

export function PageLoader({ text = "CARGANDO..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Spinner size={40} className="text-emerald-500" />
      <span className="text-xs font-black uppercase tracking-widest text-slate-400 animate-pulse">{text}</span>
    </div>
  );
}