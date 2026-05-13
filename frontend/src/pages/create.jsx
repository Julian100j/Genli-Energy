import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import clienteAxios from "../api/axios";
import { useTheme } from "../hooks/useTheme";
import { Layout } from "../components/Layout";
import { Toast, showToast } from "../components/Toast";
import { Spinner } from "../components/Loading";
import { 
  Zap, MapPin, Layers, ArrowLeft, LogOut, Save, 
  FileText, AlertTriangle, CheckCircle,
  Users, MessageSquare, Activity, AlertCircle
} from "lucide-react";

export default function Create() {
  const navigate = useNavigate();
  const { darkMode, theme } = useTheme();
  const [barrios, setBarrios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    barrio: "",
    pEnergia: "",
    tipo: "Tecnica",
    descripcion: "",
    prioridad: "Media",
    estado: "Pendiente",
    tipo_instalacion: "",
    causa: "",
    usuarios_afectados: ""
  });

  const prioridades = ["Baja", "Media", "Alta", "Critica"];
  const estados = ["Pendiente", "En proceso", "Resuelto"];
  const tiposInstalacion = ["Transformador", "Poste", "Medidor", "Línea", "Subestación", "Otro"];
  const causas = ["Fraude", "Daño físico", "Error de medición", "Conexión illegal", "Obsolescencia", "Otro"];

  useEffect(() => {
    const cargarBarrios = async () => {
      try {
        const res = await clienteAxios.get("/barrios");
        setBarrios(res.data);
      } catch (error) {
        console.error("Error al obtener barrios:", error);
      }
    };
    cargarBarrios();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.barrio.trim()) newErrors.barrio = "El nombre del barrio es requerido";
    if (!formData.pEnergia || parseFloat(formData.pEnergia) <= 0) newErrors.pEnergia = "La energía debe ser mayor a 0";
    if (!formData.descripcion.trim()) newErrors.descripcion = "La descripción es requerida";
    if (formData.usuarios_afectados && parseInt(formData.usuarios_afectados) < 0) {
      newErrors.usuarios_afectados = "No puede ser negativo";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        pEnergia: parseFloat(formData.pEnergia),
        usuarios_afectados: formData.usuarios_afectados ? parseInt(formData.usuarios_afectados) : 0
      };
      
      const response = await clienteAxios.post("/registros", dataToSend);
      if (response.status === 201 || response.status === 200) {
        showToast("Registro creado exitosamente", "success");
        setTimeout(() => navigate("/index"), 1500);
      }
    } catch (error) {
      console.error("ERROR:", error.response?.data);
      const msg = error.response?.data?.message || "Error al crear el registro";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showNewReport={false}>
      <Toast />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <Link
          to="/index"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600 hover:gap-3 transition-all mb-8"
        >
          <ArrowLeft size={16} /> Volver al Dashboard
        </Link>

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Nuevo Reporte Técnico</h1>
          <p className={`${darkMode ? "text-slate-400" : "text-slate-500"} text-xs font-bold mt-2 uppercase tracking-widest`}>
            Sistema de Integridad de Datos Genli Energy
          </p>
        </div>

        <div className={`${theme.card} border p-10 rounded-sm shadow-2xl relative overflow-hidden`}>
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* FILA 1: Barrio y Energía */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                  <MapPin size={12} className="inline mr-1" /> Sector (Barrio)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    list="lista-barrios"
                    name="barrio"
                    value={formData.barrio}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-sm border text-xs font-bold tracking-widest outline-none transition-all ${theme.input} ${errors.barrio ? "border-red-500" : ""} focus:border-emerald-500`}
                    placeholder="NOMBRE DEL BARRIO"
                  />
                  <datalist id="lista-barrios">
                    {barrios.map((nombre, index) => (
                      <option key={index} value={nombre} />
                    ))}
                  </datalist>
                </div>
                {errors.barrio && <p className="text-red-500 text-xs mt-1 font-bold">{errors.barrio}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                  <Zap size={12} className="inline mr-1" /> Magnitud de Pérdida (kWh)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    name="pEnergia"
                    value={formData.pEnergia}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 rounded-sm border text-sm font-mono font-bold outline-none transition-all ${theme.input} ${errors.pEnergia ? "border-red-500" : ""} focus:border-emerald-500`}
                    placeholder="0.00"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">kWh</span>
                </div>
                {errors.pEnergia && <p className="text-red-500 text-xs mt-1 font-bold">{errors.pEnergia}</p>}
              </div>
            </div>

            {/* FILA 2: Tipo y Prioridad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                  <Layers size={12} className="inline mr-1" /> Clasificación de Pérdida
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-sm border text-[11px] font-black uppercase tracking-widest outline-none appearance-none ${theme.input} focus:border-emerald-500`}
                >
                  <option value="Tecnica">⚙️ PÉRDIDA TÉCNICA</option>
                  <option value="No Tecnica">⚠️ PÉRDIDA NO TÉCNICA</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                  <AlertTriangle size={12} className="inline mr-1" /> Prioridad
                </label>
                <select
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-sm border text-[11px] font-black uppercase tracking-widest outline-none appearance-none ${theme.input} focus:border-emerald-500`}
                >
                  {prioridades.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* FILA 3: Descripción */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                <MessageSquare size={12} className="inline mr-1" /> Descripción del Problema
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-3 rounded-sm border text-xs font-bold outline-none transition-all ${theme.input} ${errors.descripcion ? "border-red-500" : ""} focus:border-emerald-500`}
                placeholder="Describa detalladamente el problema encontrado..."
              />
              {errors.descripcion && <p className="text-red-500 text-xs mt-1 font-bold">{errors.descripcion}</p>}
            </div>

            {/* FILA 4: Tipo instalación y Causa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                  <Activity size={12} className="inline mr-1" /> Tipo de Instalación
                </label>
                <select
                  name="tipo_instalacion"
                  value={formData.tipo_instalacion}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-sm border text-[11px] font-black uppercase tracking-widest outline-none appearance-none ${theme.input} focus:border-emerald-500`}
                >
                  <option value="">SELECCIONAR...</option>
                  {tiposInstalacion.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                  <AlertCircle size={12} className="inline mr-1" /> Causa de la Pérdida
                </label>
                <select
                  name="causa"
                  value={formData.causa}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-sm border text-[11px] font-black uppercase tracking-widest outline-none appearance-none ${theme.input} focus:border-emerald-500`}
                >
                  <option value="">SELECCIONAR...</option>
                  {causas.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* FILA 5: Usuarios afectados y Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                  <Users size={12} className="inline mr-1" /> Usuarios Afectados
                </label>
                <input
                  type="number"
                  min="0"
                  name="usuarios_afectados"
                  value={formData.usuarios_afectados}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-sm border text-sm font-mono font-bold outline-none transition-all ${theme.input} ${errors.usuarios_afectados ? "border-red-500" : ""} focus:border-emerald-500`}
                  placeholder="0"
                />
                {errors.usuarios_afectados && <p className="text-red-500 text-xs mt-1 font-bold">{errors.usuarios_afectados}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                  <CheckCircle size={12} className="inline mr-1" /> Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-sm border text-[11px] font-black uppercase tracking-widest outline-none appearance-none ${theme.input} focus:border-emerald-500`}
                >
                  {estados.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* BOTÓN SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-sm font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl ${loading
                ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20"
                }`}
            >
              {loading ? (
                <Spinner className="w-4 h-4" />
              ) : (
                <>
                  <Save size={16} /> Confirmar y Guardar Registro
                </>
              )}
            </button>
          </form>
        </div>

        <footer className="mt-12 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          © {new Date().getFullYear()} Genli Energy Solutions S.A.S — Pasto, Nariño
        </footer>
      </main>
    </Layout>
  );
}