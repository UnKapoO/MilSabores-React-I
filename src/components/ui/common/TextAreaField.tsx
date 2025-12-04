import React from 'react';

interface TextAreaFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    className?: string;
    error?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
    label, name, value, onChange, placeholder, rows = 3, className = '', error
}) => {
    return (
        <div className={`w-full mb-4 ${className}`}>
            <label htmlFor={name} className="block text-letra-cafe font-bold mb-1">
                {label}
            </label>
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={rows}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 text-letra-cafe resize-none
                    ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary'}`}
            />
            {error && <small className="text-red-500 text-sm mt-1">{error}</small>}
        </div>
    );
};