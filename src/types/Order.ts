export type OrderStatus = 'pendiente' | 'en-preparacion' | 'entregado' | 'cancelado';

export interface OrderItem {
    id?: number | string;
    nombre: string;
    cantidad: number;
    precio: number;
    imagen?: string;

    cantidadPersonas?: string;
    mensajeEspecial?: string;
    colorGlaseado?: string;
}

export interface Order {
    id: number | string;
    cliente: string;
    fecha: string;
    total: number;
    itemsCount: number;
    estado: OrderStatus;
    items?: OrderItem[];
    
    originalDate?: string; 

    // Necesario para mostrar dirección, teléfono y email en el Modal de Detalle
    datosClienteCompleto?: {
        nombre: string;
        email: string;
        telefono: string;
        direccion: string;
        comuna: string;
    };
}