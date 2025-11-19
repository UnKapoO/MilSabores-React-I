export interface User {
    id: number | string;
    nombre?: string; // Opcional porque al inicio solo teníamos email/pass en db.json
    email: string;
    password?: string; // (En un sistema real, esto no se guarda en el frontend, pero aquí sí)
    rol: 'admin' | 'cliente';
}