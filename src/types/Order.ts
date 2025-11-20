export interface Order {
    id: string | number; // Ahora acepta "ORD-001"
    cliente: string;
    fecha: string;
    total: number;
    itemsCount: number;
    // Aceptamos los estados de tu DB y los mapeamos a los de la UI
    estado: 'pendiente' | 'en-preparacion' | 'procesando' | 'entregado' | 'cancelado';
}