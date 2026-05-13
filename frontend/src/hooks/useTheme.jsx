/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const theme = {
    bg: darkMode ? "bg-[#0F172A]" : "bg-[#F1F5F9]",
    card: darkMode ? "bg-[#1E293B] border-[#334155]" : "bg-white border-slate-200",
    textMain: darkMode ? "text-slate-100" : "text-slate-800",
    textSub: darkMode ? "text-slate-400" : "text-slate-500",
    tableHead: darkMode ? "bg-[#161E2E] text-slate-500" : "bg-slate-100 text-slate-500",
    input: darkMode ? "bg-[#0F172A] border-[#334155] text-white" : "bg-white border-slate-200 text-slate-800",
    nav: darkMode ? "bg-[#1E293B] border-emerald-500/30" : "bg-[#064E3B] border-emerald-900"
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}