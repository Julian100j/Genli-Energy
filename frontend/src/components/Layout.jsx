import { Link } from "react-router-dom";
import { LogOut, Sun, Moon, LayoutDashboard, BarChart3, PlusCircle, Users } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export function Layout({ children, showTabs = false, activeTab = "dashboard", onTabChange, showNewReport = true, role = null }) {
  const { darkMode, setDarkMode, theme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className={`${theme.bg} ${theme.textMain} min-h-screen transition-colors duration-300`}>
      <nav className={`${theme.nav} border-b-4 sticky top-0 z-50 shadow-xl`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <img
              src="https://www.genli.com.co/assets/images/logo.svg"
              className="h-14 w-auto brightness-0 invert"
              alt="Genli Logo"
            />
            {showTabs && (
              <div className="hidden md:flex gap-8 text-[12px] font-black uppercase tracking-tighter">
                <button
                  onClick={() => onTabChange && onTabChange("dashboard")}
                  className={`flex items-center gap-2 pb-1 transition-all ${activeTab === 'dashboard' ? 'text-white border-b-2 border-emerald-400' : 'text-emerald-50/70 hover:text-white'}`}
                >
                  <LayoutDashboard size={14} /> Dashboard
                </button>
                <button
                  onClick={() => onTabChange && onTabChange("analisis")}
                  className={`flex items-center gap-2 pb-1 transition-all ${activeTab === 'analisis' ? 'text-white border-b-2 border-emerald-400' : 'text-emerald-50/70 hover:text-white'}`}
                >
                  <BarChart3 size={14} /> Análisis
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {role === 'admin' && (
              <Link to="/admin/usuarios" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-md text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg flex items-center gap-2">
                <Users size={14} /> Usuarios
              </Link>
            )}
            {showNewReport && (
              <Link to="/create" className="bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-md text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg">
                Nuevo Reporte
              </Link>
            )}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-black/20 text-emerald-100 hover:bg-black/40 transition-all"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 ml-2 px-3 py-2 text-emerald-100 hover:text-white hover:bg-red-600/20 rounded-md transition-all text-xs font-bold uppercase"
            >
              <LogOut size={16} /> Salir
            </button>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}