import React from 'react';

// --- Definimos las Propiedades (Props) que recibirá ---
interface InputFieldProps {
    label: string; // El texto que va arriba (ej: "Correo electrónico")
    type: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'month'; // Tipos de input que aceptará
    placeholder?: string; // El texto de ejemplo (opcional)
    name: string; // El 'name' del input, importante para los formularios

    // Estas dos son las más importantes para que sea un "componente controlado"
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    className?: string; // Para clases extra (opcional)
    min?: string; 
    max?: string;
    error?: string;
    maxLength?: number;
}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    type,
    placeholder,
    name,
    value,
    onChange,
    className = '',
    min,
    max,
    error,
    maxLength
}) => {
    return (
        // 1. Reemplazamos el <div class="form-group">
        // 'w-full' (ocupa el 100% del ancho) y 'mb-4' (margen abajo)
        <div className={`w-full mb-4 ${className}`}>

            {/* 2. Reemplazamos el <label class="form-label"> */}
            <label
                htmlFor={name} // 'htmlFor' conecta el label con el input
                className="block text-letra-cafe font-bold mb-1" // ¡Usamos tus colores del config!
            >
                {label}
            </label>

            {/* 3. Reemplazamos el <input class="form-control"> */}
            <input
                type={type}
                id={name} // El 'id' debe coincidir con el 'htmlFor' del label
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                min={min}
                max={max}
                maxLength={maxLength}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-letra-cafe
                ${error ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-primary"}`}
                />
                {error && <small className='text-red-500 text-sm mt-1'>{error}</small>}
        </div>
    );
};