// src/utils/formatters.ts

// 1. IMPORTANTE: Importamos la configuración del Backend
import { API_BASE_URL } from '../config/api'; 

export function formatearPrecio(precio: number): string {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
    }).format(precio);
}

export function obtenerNombreCategoria(categoria: string): string {
    if (categoria === 'todas') {
        return 'Todas';
    }
    const categorias: { [key: string]: string } = {
        "tortas-cuadradas": "Tortas Cuadradas",
        "tortas-circulares": "Tortas Circulares",
        "postres-individuales": "Postres Individuales",
        "sin-azucar": "Sin Azúcar",
        "tradicional": "Tradicional",
        "sin-gluten": "Sin Gluten",
        "vegana": "Vegana",
        "especiales": "Especiales",
    };
    return categorias[categoria] || categoria;
}

export function formatearFecha(fechaISO: string): string {
    const opciones: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    
    if(!fechaISO) return '';

    const fechaAParsear = fechaISO.includes('T') 
    ? fechaISO 
    : fechaISO + 'T00:00:00';
    // Agregamos + 'T00:00:00' para evitar problemas de zona horaria
    return new Date(fechaAParsear).toLocaleDateString('es-CL', opciones);
}

export function obtenerNombreCategoriaBlog(categoria: string): string {
    if (categoria === 'todas') {
        return 'Todas';
    }
    const categorias: { [key: string]: string } = {
        "recetas": 'Recetas',
        "noticias": 'Noticias',
        "consejos": 'Consejos',
        "eventos": 'Eventos',
    };
    return categorias[categoria] || 'General';
}

export const getImageUrl = (imagenPath: string | undefined) => {
    if (!imagenPath) return '/img/placeholder.jpg';
    
    // 1. Si es una imagen de internet o Base64, úsala tal cual
    if (imagenPath.startsWith('http') || imagenPath.startsWith('data:')) {
        return imagenPath;
    }

    if (imagenPath.startsWith('img/')) {
        return `/${imagenPath}`; // Ej: "/img/torta.jpg" -> Busca en localhost:5173
    }

    // 3. Si es una imagen subida al backend (futuro), usa el backend
    return `${API_BASE_URL}/${imagenPath}`;
};
