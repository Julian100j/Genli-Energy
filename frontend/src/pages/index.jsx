import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../api/axios";
import { useTheme } from "../hooks/useTheme";
import { Layout } from "../components/Layout";
import { Toast, showToast } from "../components/Toast";
import { TableSkeleton, KPISkeleton, PageLoader } from "../components/Loading";
import {
  PlusCircle,
  RefreshCw,
  FileText,
  Edit3,
  Trash2,
  Search,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Analisis from "./analisis";

export default function Index({ role = null }) {
  const { darkMode, theme } = useTheme();
  
  const puedeEditar = role === 'gerente' || role === 'admin';
  const puedeEliminar = role === 'gerente' || role === 'admin';
  const puedeCrear = role === 'tecnico' || role === 'gerente' || role === 'admin';
  const [genlienergy, setGenlienergy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tabActiva, setTabActiva] = useState("dashboard");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const API_URL = import.meta.env.VITE_API_URL || "";

  const obtenerRegistros = async () => {
    setLoading(true);
    try {
      const res = await clienteAxios.get("/registros");
      const dataLimpia = Array.isArray(res.data) ? res.data : res.data.data || [];
      setGenlienergy(dataLimpia);
    } catch (error) {
      console.error("Error cargando datos", error);
      showToast("Error al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  };

  const eliminarRegistro = async (id) => {
    if (!window.confirm("¿Desea eliminar este registro permanentemente?")) return;
    try {
      await clienteAxios.delete(`/registros/${id}`);
      setGenlienergy(genlienergy.filter((item) => item.idRegistro !== id));
      showToast("Registro eliminado correctamente", "success");
    } catch (error) {
      console.error("Error al eliminar", error);
      showToast("Error al eliminar el registro", "error");
    }
  };

  const registrosFiltrados = genlienergy.filter((item) => {
    const busqueda = searchTerm.toLowerCase();
    const coincideTexto = item.barrio.toLowerCase().includes(busqueda) || item.idRegistro.toString().includes(busqueda);
    const coincideTipo = tipoFiltro === "" || item.tipo === tipoFiltro;
    const coincideFecha = (!fechaInicio || item.fecha >= fechaInicio) && (!fechaFin || item.fecha <= fechaFin);
    return coincideTexto && coincideTipo && coincideFecha;
  });

  const totalPages = Math.ceil(registrosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = registrosFiltrados.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    obtenerRegistros();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, tipoFiltro, fechaInicio, fechaFin]);

  const totalKwh = registrosFiltrados.reduce((acc, curr) => acc + parseFloat(curr.pEnergia || 0), 0);

  const clearFilters = () => {
    setSearchTerm("");
    setTipoFiltro("");
    setFechaInicio("");
    setFechaFin("");
  };

  return (
    <Layout showTabs activeTab={tabActiva} onTabChange={setTabActiva} role={role} showNewReport={puedeCrear}>
      <Toast />
      <main className="max-w-7xl mx-auto px-6 py-10">
        {tabActiva === "dashboard" ? (
          <>
            {loading ? (
              <>
                <KPISkeleton />
                <div className={`${theme.card} border p-6 rounded-md mb-8 shadow-md`}>
                  <div className="h-12 bg-slate-200 animate-pulse rounded"></div>
                </div>
                <TableSkeleton rows={5} darkMode={darkMode} />
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className={`${theme.card} border p-6 rounded-md shadow-sm`}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Energía Total</p>
                    <h3 className="text-2xl font-black">{totalKwh.toLocaleString()} <span className="text-xs font-normal">kWh</span></h3>
                  </div>
                  <div className={`${theme.card} border p-6 rounded-md shadow-sm`}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Registros</p>
                    <h3 className="text-2xl font-black">{registrosFiltrados.length}</h3>
                  </div>
                  <div className={`${theme.card} border p-6 rounded-md shadow-sm`}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Barrios</p>
                    <h3 className="text-2xl font-black">{new Set(registrosFiltrados.map(r => r.barrio)).size}</h3>
                  </div>
                </div>

                <div className={`${theme.card} border p-6 rounded-md mb-8 shadow-md`}>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="relative lg:col-span-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="BUSCAR BARRIO..."
                        className={`w-full pl-10 pr-4 py-2.5 rounded border text-[11px] font-bold uppercase tracking-wider outline-none ${theme.input} focus:border-emerald-500`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      className={`px-4 py-2.5 border rounded text-[11px] font-bold uppercase tracking-wider outline-none ${theme.input}`}
                      value={tipoFiltro}
                      onChange={(e) => setTipoFiltro(e.target.value)}
                    >
                      <option value="">TODOS LOS TIPOS</option>
                      <option value="Tecnica">PÉRDIDA TÉCNICA</option>
                      <option value="No Tecnica">PÉRDIDA NO TÉCNICA</option>
                    </select>
                    <div className="flex gap-2 lg:col-span-2">
                      <div className="flex-1 relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                        <input
                          type="date"
                          className={`w-full pl-8 pr-4 py-2.5 border rounded text-[11px] font-bold uppercase ${theme.input}`}
                          value={fechaInicio}
                          onChange={(e) => setFechaInicio(e.target.value)}
                        />
                      </div>
                      <div className="flex-1 relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                        <input
                          type="date"
                          className={`w-full pl-8 pr-4 py-2.5 border rounded text-[11px] font-bold uppercase ${theme.input}`}
                          value={fechaFin}
                          onChange={(e) => setFechaFin(e.target.value)}
                        />
                      </div>
                      <button onClick={clearFilters} className="p-2.5 text-slate-400 hover:text-emerald-500 transition-all">
                        <RefreshCw size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`${theme.card} border rounded-md overflow-hidden shadow-2xl`}>
                  <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className={`${theme.tableHead} border-b font-bold text-[10px] uppercase tracking-[0.15em]`}>
                        <th className="px-4 py-5">Barrio</th>
                        <th className="px-4 py-5 text-center">kWh</th>
                        <th className="px-4 py-5">Tipo</th>
                        <th className="px-4 py-5">Estado</th>
                        <th className="px-4 py-5">Prioridad</th>
                        <th className="px-4 py-5 text-center">Users</th>
                        <th className="px-4 py-5">Fecha</th>
                        <th className="px-4 py-5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/10">
                      {paginatedData.map((item) => (
                        <tr key={item.idRegistro} className={`${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"} transition-all`}>
                          <td className="px-4 py-4">
                            <div className="text-sm font-bold uppercase">{item.barrio}</div>
                            <div className="text-[9px] text-emerald-600 font-mono">#{item.idRegistro}</div>
                          </td>
                          <td className="px-4 py-4 text-center font-mono text-sm font-bold text-slate-600">
                            {item.pEnergia}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-[8px] font-black px-2 py-1 border rounded ${item.tipo === "Tecnica"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              }`}>
                              {item.tipo === "Tecnica" ? "TÉC" : "NO TÉC"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-[8px] font-black px-2 py-1 rounded ${
                              item.estado === 'Resuelto' ? 'bg-green-500/20 text-green-600' :
                              item.estado === 'En proceso' ? 'bg-yellow-500/20 text-yellow-600' :
                              'bg-gray-500/20 text-gray-600'
                            }`}>
                              {item.estado || 'Pendiente'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-[8px] font-black px-2 py-1 rounded ${
                              item.prioridad === 'Critica' ? 'bg-red-500/20 text-red-600' :
                              item.prioridad === 'Alta' ? 'bg-orange-500/20 text-orange-600' :
                              item.prioridad === 'Media' ? 'bg-blue-500/20 text-blue-600' :
                              'bg-gray-500/20 text-gray-600'
                            }`}>
                              {item.prioridad || 'Media'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center text-xs font-mono">
                            {item.usuarios_afectados || 0}
                          </td>
                          <td className="px-4 py-4 text-[10px] text-slate-400">
                            {item.fecha?.substring(0, 10)}
                          </td>
                          <td className="px-4 py-4 text-right flex justify-end gap-2">
                            <a href={`${API_URL}/reporte-pdf/${item.idRegistro}`} target="_blank" rel="noreferrer" className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-all">
                              <FileText size={16} />
                            </a>
                            {puedeEditar && (
                              <Link to={`/edit/${item.idRegistro}`} className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-all">
                                <Edit3 size={16} />
                              </Link>
                            )}
                            {puedeEliminar && (
                              <button onClick={() => eliminarRegistro(item.idRegistro)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>

                  {totalPages > 1 && (
                    <div className={`flex items-center justify-between px-8 py-4 border-t ${darkMode ? "border-[#334155]" : "border-slate-200"}`}>
                      <span className="text-xs text-slate-400">
                        Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, registrosFiltrados.length)} de {registrosFiltrados.length}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="p-2 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded text-xs font-bold ${currentPage === page ? "bg-emerald-500 text-white" : "hover:bg-slate-100"}`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        ) : (
          <Analisis darkMode={darkMode} />
        )}
      </main>
    </Layout>
  );
}