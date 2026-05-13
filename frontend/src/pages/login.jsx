import { useState } from "react";
import { ShieldCheck, Lock, LogIn } from "lucide-react";
import clienteAxios from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await clienteAxios.post("/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      window.location.href = "/index";
    } catch (err) {
      setError(err.response?.data?.error || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#064E3B] relative overflow-hidden font-sans">

      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-black/20 rounded-full blur-[120px]"></div>

      <div className="relative z-10 bg-white p-12 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-center max-w-md w-full border-t-8 border-emerald-500">

        <img
          src="https://www.genli.com.co/assets/images/logo.svg"
          alt="Genli Energy"
          className="h-16 mx-auto mb-8 transition-transform hover:scale-105 duration-300"
        />

        <div className="flex justify-center mb-4">
          <div className="bg-emerald-50 p-3 rounded-full">
            <ShieldCheck className="text-emerald-600 w-8 h-8" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-3">
          Genli Energy SAS
        </h1>

        <p className="text-slate-500 mb-8 text-[11px] font-bold uppercase tracking-[0.15em] leading-relaxed">
          Sistema de Control de Pérdidas Energéticas <br />
          <span className="text-emerald-600">Ingresa con tus credenciales</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-sm text-sm outline-none focus:border-emerald-500"
              placeholder="correo@genli.com"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-sm text-sm outline-none focus:border-emerald-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-sm font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${loading ? "bg-slate-400" : "bg-emerald-600 hover:bg-emerald-500"} text-white`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn size={16} /> Ingresar al Sistema
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-slate-400 mt-6">
          <Lock size={12} />
          <span className="text-[9px] font-black uppercase tracking-widest">
            Acceso Restringido y Encriptado
          </span>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            Genli Energy Solutions S.A.S — 2026
          </p>
        </div>
      </div>
    </div>
  );
}