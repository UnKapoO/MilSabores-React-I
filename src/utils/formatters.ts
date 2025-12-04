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

// 2. NUEVA FUNCIÓN: Genera la URL correcta para las imágenes del Backend
export const getImageUrl = (imagenPath: string | undefined | null) => {
    // A. Si no hay ruta, retornamos una imagen gris por defecto
    if (!imagenPath) return 'https://via.placeholder.com/150?text=Sin+Imagen';

    // B. Si la imagen ya tiene "http" (ej: viene de Google), la dejamos igual
    if (imagenPath.startsWith('http')) return imagenPath;

    // C. Si es una ruta local (ej: "images/foto.jpg"), le pegamos la dirección del Backend
    // Resultado final: "${API_BASE_URL}/images/foto.jpg"
    return `${API_BASE_URL}/${imagenPath}`;
};