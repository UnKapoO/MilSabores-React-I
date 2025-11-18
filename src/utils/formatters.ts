// src/utils/formatters.ts

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
    // Agregamos + 'T00:00:00' para evitar problemas de zona horaria
    return new Date(fechaISO + 'T00:00:00').toLocaleDateString('es-CL', opciones);
}

export function obtenerNombreCategoriaBlog(categoria: string): string {
    if (categoria === 'todas') {
    return 'Todas';
    }
    const categorias: { [key: string]: string } = {
        recetas: 'Recetas',
        noticias: 'Noticias',
        consejos: 'Consejos',
        eventos: 'Eventos',
    };
    return categorias[categoria] || 'General';
}