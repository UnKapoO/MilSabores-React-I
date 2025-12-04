export const API_BASE_URL = 'http://localhost:8080';

export const ENDPOINTS = {
    PRODUCTOS: `${API_BASE_URL}/productos`,
    PEDIDOS: `${API_BASE_URL}/pedidos`,
    USUARIOS: `${API_BASE_URL}/usuarios`, // Solo para el Admin (Listar)
    
    AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
    AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
};