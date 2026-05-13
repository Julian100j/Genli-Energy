import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/api';

const clienteAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Interceptor para agregar el header de autenticación
clienteAxios.interceptors.request.use((config) => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    const user = JSON.parse(userStr);
    config.headers['X-User'] = JSON.stringify(user);
  }
  return config;
});

export default clienteAxios;