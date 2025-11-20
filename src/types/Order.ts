
export type OrderStatus = 'pendiente' | 'en-preparacion' | 'entregado' | 'cancelado';

export interface OrderItem {
    id?: number | string;
    nombre: string;
    cantidad: number;
    precio: number;
    imagen?: string;
}

export interface Order {
    id: number | string;
    cliente: string;
    fecha: string;
    total: number;
    itemsCount: number;
    estado: OrderStatus;
    items?: OrderItem[];
    
    // 🚨 ¡ESTA LÍNEA ES LA CLAVE! 🚨
    // Si esta línea falta o no está guardada, saldrá el error rojo.
    originalDate?: string; 
}