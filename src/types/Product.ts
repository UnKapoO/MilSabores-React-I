export interface Product {
  id: number;
  codigo: string;
  categoria: string;
  nombre: string; // <-- Usamos 'nombre'
  precio: number; // <-- Usamos 'precio'
  descripcion: string;
  imagen: string; // <-- Usamos 'imagen'
  icono: string;
}