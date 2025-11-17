import React from 'react';

// --- Definimos las Props que recibirá ---
interface EmptyStateProps {
    icon: string;    // El ícono de FontAwesome (ej: "fa-solid fa-cart-shopping")
    title: string;   // El título (ej: "Tu carrito está vacío")
    message: string; // El subtítulo (ej: "Agrega productos para verlos aquí.")
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
    return (
        // 1. Contenedor centrado con padding y borde
        <div className="flex flex-col items-center justify-center text-center p-12 
                    border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">

            {/* 2. Ícono grande y con color suave */}
            <i className={`${icon} text-6xl text-gray-300 mb-6`}></i>

            {/* 3. Título (usamos tu color 'text-dark') */}
            <h2 className="text-2xl font-bold text-dark mb-2">
                {title}
            </h2>

            {/* 4. Mensaje (usamos tu color 'text-letra-cafe') */}
            <p className="text-letra-cafe">
                {message}
            </p>

            {/* (Opcionalmente, podríamos pasar un <Button> aquí, 
          como "Ir al Catálogo", pero lo dejamos simple por ahora) */}
        </div>
    );
};