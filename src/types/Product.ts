
export interface Product {
  // --- Campos Base ---
  id: number;
  codigo: string;
  categoria: string;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  icono: string;
  // --- Campos de Inventario y Calificación ---
  stock?: number;  
  rating?: number;    // Añadido como opcional (usado en ProductCard).

  // (Los hacemos opcionales con '?' porque no todos los productos los tendrán)
  personalizable?: boolean;
  basePricePerPersona?: number;
  minPersonas?: number;
  maxPersonas?: number;
  coloresGlaseado?: string[];

}