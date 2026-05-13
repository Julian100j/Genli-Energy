import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, AreaChart, Area,
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Zap, MapPin, Calendar, ArrowUp, ArrowDown, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import clienteAxios from "../api/axios";
import { useTheme } from "../hooks/useTheme";

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
const PRIORITY_COLORS = { 'Critica': '#ef4444', 'Alta': '#f97316', 'Media': '#3b82f6', 'Baja': '#94a3b8' };
const STATUS_COLORS = { 'Resuelto': '#10b981', 'En proceso': '#f59e0b', 'Pendiente': '#94a3b8' };

export default function Analisis() {
    const { darkMode, theme } = useTheme();
    const [data, setData] = useState({ porBarrio: [], porTipo: [], porPrioridad: [], porEstado: [], tendencia: [], topSectores: [], resumen: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarEstadisticas = async () => {
            try {
                const res = await clienteAxios.get('/analisis-tendencia');
                console.log("Datos recibidos:", res.data);
                setData({
                    porBarrio: res.data.porBarrio || [],
                    porTipo: res.data.porTipo || [],
                    porPrioridad: res.data.porPrioridad || [],
                    porEstado: res.data.porEstado || [],
                    tendencia: res.data.porMes || [],
                    topSectores: res.data.topSectores || [],
                    resumen: res.data.resumen || {}
                });
            } catch (error) {
                console.error("Error cargando estadísticas:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarEstadisticas();
    }, []);

    const calcularTendencia = () => {
        if (data.tendencia.length < 2) return null;
        const ultimo = data.tendencia[data.tendencia.length - 1].total;
        const anterior = data.tendencia[data.tendencia.length - 2]?.total || ultimo;
        const cambio = anterior > 0 ? ((ultimo - anterior) / anterior) * 100 : 0;
        return { ultimo, anterior, cambio };
    };

    const tendencia = calcularTendencia();

    const StatCard = ({ icon: IconEl, label, value, sub, colorClass }) => (
        <div className={`${theme.card} border p-6 rounded-md shadow-sm`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${colorClass}`}>
                    {IconEl}
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                    <h3 className="text-xl font-black">{value}</h3>
                    {sub && <p className="text-[10px] text-slate-400 mt-1">{sub}</p>}
                </div>
            </div>
        </div>
    );

    if (loading) return (
        <div className="p-10 text-center font-black animate-pulse text-slate-400">
            CARGANDO SISTEMA DE ANÁLISIS...
        </div>
    );

    return (
        <div className="space-y-8">
            {/* ENCABEZADO */}
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-900/20">
                    <TrendingUp className="text-white" size={28} />
                </div>
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic">Análisis Estratégico</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Genli Energy Data Intelligence</p>
                </div>
            </div>

            {/* KPIs DE RESUMEN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<div className="p-3 rounded-xl bg-emerald-600"><Zap size={24} className="text-white" /></div>}
                    label="Total Pérdida"
                    value={`${(data.resumen.totalPerdida || 0).toLocaleString()} kWh`}
                    sub={`${data.resumen.totalRegistros || 0} registros`}
                    colorClass=""
                />
                <StatCard
                    icon={<div className="p-3 rounded-xl bg-blue-600"><MapPin size={24} className="text-white" /></div>}
                    label="Sectores Afectados"
                    value={data.porBarrio.length}
                    sub="Barrios con pérdida"
                    colorClass=""
                />
                <StatCard
                    icon={<div className="p-3 rounded-xl bg-orange-600"><AlertTriangle size={24} className="text-white" /></div>}
                    label="Prioridad Alta"
                    value={data.porPrioridad.find(p => p.name === 'Alta' || p.name === 'Critica')?.value || 0}
                    sub="Casos críticos"
                    colorClass=""
                />
                <StatCard
                    icon={<div className="p-3 rounded-xl bg-purple-600"><CheckCircle size={24} className="text-white" /></div>}
                    label="Resueltos"
                    value={data.porEstado.find(e => e.name === 'Resuelto')?.value || 0}
                    sub={`de ${data.resumen.totalRegistros || 0} total`}
                    colorClass=""
                />
            </div>

            {/* KPIs DE TENDENCIA */}
            {tendencia && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`${theme.card} border p-6 rounded-md shadow-sm`}>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Último Mes</p>
                        <h3 className="text-2xl font-black">{tendencia.ultimo.toLocaleString()} <span className="text-xs font-normal">kWh</span></h3>
                    </div>
                    <div className={`${theme.card} border p-6 rounded-md shadow-sm`}>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mes Anterior</p>
                        <h3 className="text-2xl font-black">{tendencia.anterior.toLocaleString()} <span className="text-xs font-normal">kWh</span></h3>
                    </div>
                    <div className={`${theme.card} border p-6 rounded-md shadow-sm`}>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Variación</p>
                        <div className="flex items-center gap-2">
                            {tendencia.cambio >= 0 ? (
                                <ArrowUp className="text-red-500" size={24} />
                            ) : (
                                <ArrowDown className="text-emerald-500" size={24} />
                            )}
                            <h3 className={`text-2xl font-black ${tendencia.cambio >= 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                {Math.abs(tendencia.cambio).toFixed(1)}%
                            </h3>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-8">

                {/* GRÁFICO DE TENDENCIA (LÍNEA) */}
                {data.tendencia.length > 0 && (
                    <div className={`${theme.card} border p-8 rounded-sm shadow-2xl border-l-4 border-l-purple-500`}>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={14} className="text-purple-500" /> Evolución de Pérdidas por Mes
                            </h3>
                            <span className="bg-purple-500/10 text-purple-500 text-[10px] font-black px-3 py-1 rounded-full">EVOLUCIÓN</span>
                        </div>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.tendencia}>
                                    <defs>
                                        <linearGradient id="gradPerdida" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#f1f5f9"} />
                                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: darkMode ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: darkMode ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ background: darkMode ? '#1e293b' : '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}
                                        labelStyle={{ color: darkMode ? '#94a3b8' : '#64748b' }}
                                    />
                                    <Area type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} fill="url(#gradPerdida)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* RANKING DE BARRIOS + TOP 5 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className={`${theme.card} border p-8 rounded-sm shadow-2xl border-l-4 border-l-emerald-500`}>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <MapPin size={14} className="text-emerald-500" /> Sectores con Mayor Pérdida (kWh)
                            </h3>
                            <span className="bg-emerald-500/10 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full">TOP SECTORES</span>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.porBarrio.slice(0, 10)} layout="vertical" margin={{ left: 40, right: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={darkMode ? "#334155" : "#f1f5f9"} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="zona" type="category" width={100} tick={{ fontSize: 10, fontWeight: 'bold', fill: darkMode ? '#cbd5e1' : '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        cursor={{ fill: darkMode ? '#ffffff05' : '#f8fafc' }}
                                        contentStyle={{ background: darkMode ? '#0f172a' : '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="perdida" radius={[0, 5, 5, 0]} barSize={20}>
                                        {data.porBarrio.slice(0, 10).map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className={`${theme.card} border p-8 rounded-sm shadow-2xl border-l-4 border-l-blue-500`}>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Zap size={14} className="text-blue-500" /> Top 5 — Mayor Pérdida
                        </h3>
                        <ul className="space-y-3">
                            {data.topSectores.map((s, i) => (
                                <li key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                                    <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                                        i === 0 ? 'bg-red-500 text-white' :
                                        i === 1 ? 'bg-orange-500 text-white' :
                                        i === 2 ? 'bg-yellow-500 text-white' :
                                        'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                                    }`}>
                                        {i + 1}
                                    </span>
                                    <span className="flex-1 font-bold text-sm">{s.zona}</span>
                                    <span className="text-sm font-mono font-bold text-emerald-600">{s.perdida.toLocaleString()} kWh</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* POR TIPO + POR PRIORIDAD + POR ESTADO */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className={`${theme.card} border p-8 rounded-sm shadow-2xl border-l-4 border-l-orange-500`}>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Activity size={14} className="text-orange-500" /> Tipo de Pérdida (%)
                        </h3>
                        <div className="flex flex-col items-center">
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.porTipo}
                                            cx="50%" cy="50%"
                                            innerRadius={50} outerRadius={80}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {data.porTipo.map((_, i) => (
                                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(v) => `${v}%`} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <ul className="mt-4 space-y-2 w-full">
                                {data.porTipo.map((t, i) => (
                                    <li key={i} className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                                            <span className="text-slate-500">{t.name}</span>
                                        </span>
                                        <span className="font-bold">{t.value}%</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className={`${theme.card} border p-8 rounded-sm shadow-2xl border-l-4 border-l-yellow-500`}>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <AlertTriangle size={14} className="text-yellow-500" /> Por Prioridad
                        </h3>
                        <div className="space-y-3">
                            {data.porPrioridad.map((p, i) => {
                                const total = data.porPrioridad.reduce((s, x) => s + x.value, 0);
                                const pct = total > 0 ? (p.value / total) * 100 : 0;
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-bold">{p.name}</span>
                                            <span className="text-slate-400">{p.value}</span>
                                        </div>
                                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full transition-all"
                                                style={{ width: `${pct}%`, background: PRIORITY_COLORS[p.name] || '#94a3b8' }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={`${theme.card} border p-8 rounded-sm shadow-2xl border-l-4 border-l-green-500`}>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <CheckCircle size={14} className="text-green-500" /> Por Estado
                        </h3>
                        <div className="space-y-3">
                            {data.porEstado.map((e, i) => {
                                const total = data.porEstado.reduce((s, x) => s + x.value, 0);
                                const pct = total > 0 ? (e.value / total) * 100 : 0;
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-bold">{e.name}</span>
                                            <span className="text-slate-400">{e.value}</span>
                                        </div>
                                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full transition-all"
                                                style={{ width: `${pct}%`, background: STATUS_COLORS[e.name] || '#94a3b8' }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* COMPARATIVA POR TIPO */}
                <div className={`${theme.card} border p-8 rounded-sm shadow-2xl border-l-4 border-l-cyan-500`}>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                        <Zap size={14} className="text-cyan-500" /> Resumen por Naturaleza de Pérdida (kWh)
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.porTipo}>
                                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#f1f5f9"} />
                                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: darkMode ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ background: darkMode ? '#1e293b' : '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}
                                    formatter={(v) => [`${v} kWh`, 'Total']}
                                />
                                <Bar dataKey="total" name="Total" fill="#0ea5e9" radius={[5, 5, 0, 0]} barSize={80} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}