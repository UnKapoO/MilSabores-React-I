import React from 'react';

// --- Definimos la "forma" de una opción ---
// Cada <option> tendrá un 'value' (lo que se guarda) y un 'label' (lo que se ve)
export interface SelectOption {
    value: string | number;
    label: string;
}

// --- Definimos las Propiedades (Props) que recibirá ---
interface SelectFieldProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;

    // La prop más importante: un array de opciones para mostrar
    options: SelectOption[];

    className?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    label,
    name,
    value,
    onChange,
    options,
    className = ''
}) => {
    return (
        // 1. Contenedor (igual que InputField)
        <div className={`w-full mb-4 ${className}`}>

            {/* 2. Label (igual que InputField) */}
            <label
                htmlFor={name}
                className="block text-letra-cafe font-bold mb-1"
            >
                {label}
            </label>

            {/* 3. Reemplazamos el <select class="form-select"> */}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                // "Traducción" a Tailwind. Le damos la misma apariencia que el InputField
                className="w-full px-4 py-2 border border-gray-300 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    text-letra-cafe"
            >
                {/* 4. Usamos .map() para crear todas las <option> */}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};