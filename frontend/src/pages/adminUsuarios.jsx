import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clienteAxios from "../api/axios";
import { useTheme } from "../hooks/useTheme";
import { Layout } from "../components/Layout";
import { Toast, showToast } from "../components/Toast";
import { TableSkeleton } from "../components/Loading";
import { Plus, Edit3, Trash2, ArrowLeft, X, Save } from "lucide-react";

export default function AdminUsuarios() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "", rol: "tecnico", estado: "activo" });

  const getUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  };

  const user = getUser();

  const cargarUsuarios = async () => {
    try {
      const res = await clienteAxios.get("/usuarios");
      setUsuarios(res.data);
    } catch (err) {
      showToast(err.response?.data?.error || "Error al cargar usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.rol !== 'admin') {
      navigate("/index");
    } else {
      cargarUsuarios();
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await clienteAxios.put(`/usuarios/${editando}`, formData);
        showToast("Usuario actualizado", "success");
      } else {
        await clienteAxios.post("/usuarios", formData);
        showToast("Usuario creado", "success");
      }
      setShowModal(false);
      setEditando(null);
      setFormData({ nombre: "", email: "", password: "", rol: "tecnico", estado: "activo" });
      cargarUsuarios();
    } catch { showToast("Error al guardar", "error"); }
  };

  const handleEdit = (usuario) => {
    setEditando(usuario.id);
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      password: "",
      rol: usuario.rol,
      estado: usuario.estado
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await clienteAxios.delete(`/usuarios/${id}`);
      showToast("Usuario eliminado", "success");
      cargarUsuarios();
    } catch { showToast("Error al eliminar", "error"); }
  };

  return (
    <Layout role="admin" showNewReport={false}>
      <Toast />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/index" className="p-2 text-slate-400 hover:text-emerald-500">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-black uppercase">Administración de Usuarios</h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gestión de usuarios del sistema</p>
            </div>
          </div>
          <button
            onClick={() => { setEditando(null); setFormData({ nombre: "", email: "", password: "", rol: "tecnico", estado: "activo" }); setShowModal(true); }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-md text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Plus size={16} /> Nuevo Usuario
          </button>
        </div>

        {loading ? (
          <TableSkeleton rows={5} />
        ) : (
          <div className={`${theme.card} border rounded-md overflow-hidden shadow-2xl`}>
            <table className="w-full text-left">
              <thead>
                <tr className={`${theme.tableHead} border-b font-bold text-[10px] uppercase tracking-[0.15em]`}>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rol</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/10">
                {usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-all">
                    <td className="px-6 py-4 font-bold">{u.nombre}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-black px-3 py-1 rounded ${
                        u.rol === 'admin' ? 'bg-purple-500/20 text-purple-600' :
                        u.rol === 'gerente' ? 'bg-blue-500/20 text-blue-600' :
                        'bg-gray-500/20 text-gray-600'
                      }`}>
                        {u.rol.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-black px-3 py-1 rounded ${
                        u.estado === 'activo' ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'
                      }`}>
                        {u.estado.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => handleEdit(u)} className="p-2 text-slate-400 hover:text-emerald-500">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="p-2 text-slate-400 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`${theme.card} border p-8 rounded-md shadow-2xl w-full max-w-md`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase">{editando ? "Editar" : "Nuevo"} Usuario</h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-sm text-sm font-bold ${theme.input}`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-sm text-sm font-bold ${theme.input}`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">
                    Contraseña {editando && "(dejar vacío para mantener)"}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-sm text-sm font-bold ${theme.input}`}
                    placeholder={editando ? "••••••••" : "Mín. 6 caracteres"}
                    required={!editando}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Rol</label>
                    <select
                      value={formData.rol}
                      onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-sm text-sm font-bold ${theme.input}`}
                    >
                      <option value="tecnico">Técnico</option>
                      <option value="gerente">Gerente</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Estado</label>
                    <select
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      className={`w-full px-4 py-3 border rounded-sm text-sm font-bold ${theme.input}`}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-sm"
                >
                  <Save size={16} className="inline mr-2" />
                  Guardar
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}