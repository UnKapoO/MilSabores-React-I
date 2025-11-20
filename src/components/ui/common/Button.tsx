import React from 'react';

// --- Definimos las Propiedades (Props) ---
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
    // 1. ¡NUEVA PROP!
    disabled?: boolean;
    title?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    className = '',
    disabled = false, // 2. Valor por defecto
    title,
}) => {

    // --- Estilos Base ---
    // 3. AÑADIMOS ESTILOS DE DISABLED:
    // 'disabled:opacity-50' (se ve transparente)
    // 'disabled:cursor-not-allowed' (el cursor muestra prohibido)
    const baseStyle = "py-2 px-6 rounded-full font-principal font-bold transition-all duration-300 shadow hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0";

    // --- Estilos de Variantes ---
    let variantStyle = '';
    switch (variant) {
        case 'primary':
            variantStyle = 'bg-primary text-white hover:opacity-80';
            break;
        case 'secondary':
            variantStyle = 'bg-acento-rosa text-letra-cafe hover:bg-acento-cafe hover:text-white';
            break;
        case 'outline':
            variantStyle = 'border-2 border-primary text-primary hover:bg-primary hover:text-white';
            break;
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled} // 4. Pasamos la prop al HTML real
            title={title}
            className={`${baseStyle} ${variantStyle} ${className}`}
        >
            {children}
        </button>
    );
};