// src/config/api.ts

/**
 * CONFIGURACIÓN CENTRALIZADA DE LA API
 * ---------------------------------------------------
 * Aquí definimos la URL base de nuestro backend.
 * * - Puerto 8080: Backend Real (Spring Boot)
 * - Puerto 3001: Backend Simulado (json-server)
 */

// 1. Selecciona tu entorno (Descomenta el que vayas a usar)

// A. MODO BACKEND JAVA (Spring Boot)
export const API_BASE_URL = 'http://localhost:8080'; 

// B. MODO MOCK (json-server) -- Úsalo si el backend falla
// export const API_BASE_URL = 'http://localhost:3001';


// 2. Endpoints centralizados
// Usamos estos en los fetch para no escribir las URLs a mano cada vez
export const ENDPOINTS = {
    PRODUCTOS: `${API_BASE_URL}/productos`, // GET, POST, PUT, DELETE
    PEDIDOS: `${API_BASE_URL}/pedidos`,     // GET, POST
    USUARIOS: `${API_BASE_URL}/usuarios`,   // GET (Login), POST (Registro)
    
    // Futuro: Endpoint de autenticación real
    // LOGIN: `${API_BASE_URL}/auth/login`,
};