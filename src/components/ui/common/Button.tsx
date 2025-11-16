import React from 'react';

// --- Definimos las Propiedades (Props) que recibirá ---
interface ButtonProps {
    children: React.ReactNode; // El texto o ícono que va dentro
    onClick?: () => void;       // Una función de clic (opcional)
    type?: 'button' | 'submit' | 'reset'; // Para usarlo en formularios

    // ¡La prop clave! Para cambiar los colores
    variant?: 'primary' | 'secondary' | 'outline';

    className?: string; // Para añadir clases extra si es necesario
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary', // El estilo por defecto será 'primary'
    className = ''
}) => {

    // --- 1. Definimos los Estilos Base (Comunes a todos los botones) ---
    // Traducido de tus .css: (fuente, bordes redondeados, transición)
    const baseStyle = "py-2 px-6 rounded-full font-principal font-bold transition-all duration-300 shadow hover:-translate-y-0.5";

    // --- 2. Definimos los Estilos de las Variantes (Colores) ---
    // Aquí usamos los colores de tu tailwind.config.js
    let variantStyle = '';
    switch (variant) {
        case 'primary':
            // Tu color --primary-color de home.css
            variantStyle = 'bg-primary text-white hover:opacity-80';
            break;
        case 'secondary':
            // Tu color --color-acento-rosa
            variantStyle = 'bg-acento-rosa text-letra-cafe hover:bg-acento-cafe hover:text-white';
            break;
        case 'outline':
            // Un estilo de borde (útil para botones secundarios)
            variantStyle = 'border-2 border-primary text-primary hover:bg-primary hover:text-white';
            break;
    }

    // --- 3. Renderizamos el botón ---
    return (
        <button
            type={type}
            onClick={onClick}
            // Combinamos todas las clases: base + variante + clases extra
            className={`${baseStyle} ${variantStyle} ${className}`}
        >
            {children}
        </button>
    );
};