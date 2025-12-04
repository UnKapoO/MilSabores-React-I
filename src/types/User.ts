export interface User {
    id: number | string;
    nombre?: string; 
    email: string;
    password?: string; 
    rol: 'admin' | 'cliente';
    activo: boolean;
    fechaNacimiento?: string;
}