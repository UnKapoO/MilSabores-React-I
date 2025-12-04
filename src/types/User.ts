export interface User {
    id: number | string;
    nombre?: string; // Opcional porque al inicio solo teníamos email/pass en db.json
    email: string;
    password?: string; 
    rol: 'admin' | 'cliente';
    activo: boolean;
    fechaNacimiento?: string;
}