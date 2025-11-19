import React, { createContext, useState, useContext, useEffect } from 'react';
import type { User } from '../types/User';

interface AuthContextType {
    user: User | null;           // El usuario actual (o null si no hay nadie)
    isAuthenticated: boolean;    // ¿Está logueado?
    login: (user: User) => void; // Función para guardar el usuario al entrar
    logout: () => void;          // Función para salir
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Estado del usuario
    const [user, setUser] = useState<User | null>(null);

    // 1. Al cargar la app, revisamos si hay una sesión guardada en localStorage
    // (Para que no se desconecte al recargar la página)
    useEffect(() => {
        const savedUser = localStorage.getItem('milSabores_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // 2. Función de Login (Guarda en estado y en localStorage)
    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('milSabores_user', JSON.stringify(userData));
    };

    // 3. Función de Logout (Limpia todo)
    const logout = () => {
        setUser(null);
        localStorage.removeItem('milSabores_user');
    };

    const value = {
        user,
        isAuthenticated: !!user, // Es true si user existe, false si es null
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};