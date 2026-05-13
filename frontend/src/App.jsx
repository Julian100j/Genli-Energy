import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/index";
import Create from "./pages/create";
import Edit from "./pages/edit";
import Login from "./pages/login";
import AdminUsuarios from "./pages/adminUsuarios";

function App() {
  const getUser = () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  };

  const isAuthenticated = () => getUser() !== null;
  const getUserRole = () => getUser()?.rol || null;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={!isAuthenticated() ? <Login /> : <Navigate to="/index" />}
        />
        <Route
          path="/index"
          element={isAuthenticated() ? <Index role={getUserRole()} /> : <Navigate to="/" />}
        />
        <Route
          path="/create"
          element={isAuthenticated() ? <Create role={getUserRole()} /> : <Navigate to="/" />}
        />
        <Route
          path="/edit/:id"
          element={isAuthenticated() ? <Edit role={getUserRole()} /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/usuarios"
          element={isAuthenticated() && getUserRole() === 'admin' ? <AdminUsuarios /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;