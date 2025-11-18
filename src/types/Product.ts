// src/types/Product.ts

export interface Product {
  // --- Campos Base (de tu db.json) ---
  id: number;
  codigo: string;
  categoria: string;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  icono: string;
  // (Los hacemos opcionales con '?' porque no todos los productos los tendrán)
  personalizable?: boolean;
  basePricePerPersona?: number;
  minPersonas?: number;
  maxPersonas?: number;
  coloresGlaseado?: string[];
  
}