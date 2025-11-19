import React from 'react';
import { Link } from 'react-router-dom';

interface AuthCardProps {
    title: string;
    subtitle: string;
    children: React.ReactNode; // Aquí irán los inputs y botones
    footerText: string;
    footerLinkText: string;
    footerLinkTo: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
    title,
    subtitle,
    children,
    footerText,
    footerLinkText,
    footerLinkTo
}) => {
    return (
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mx-auto">

            {/* 1. Header */}
            <div className="p-8 pb-0 text-center">
                <h1 className="font-secundaria text-4xl text-dark mb-2">{title}</h1>
                <p className="text-letra-cafe">{subtitle}</p>
            </div>

            {/* 2. Formulario (Contenido) */}
            <div className="p-8">
                {children}
            </div>

            {/* 3. Footer */}
            <div className="bg-gray-50 px-8 py-4 text-center text-sm text-letra-cafe border-t border-gray-200">
                <p>
                    {footerText}{' '}
                    <Link to={footerLinkTo} className="text-primary font-bold hover:underline">
                        {footerLinkText}
                    </Link>
                </p>
            </div>

            {/* 4. Info Promociones (Copiado de tu HTML) */}
            <div className="bg-amber-50 px-8 py-4 border-t border-amber-100">
                <h4 className="text-acento-cafe font-bold mb-2 flex items-center gap-2 text-sm">
                    <i className="fa-solid fa-gift"></i> Ofertas especiales
                </h4>
                <ul className="text-xs text-letra-cafe space-y-1 list-disc list-inside">
                    <li><strong>Mayores de 50 años:</strong> 50% de descuento</li>
                    <li><strong>Código "FELICES50":</strong> 10% descuento de por vida</li>
                    <li><strong>Estudiantes Duoc:</strong> Torta gratis en cumpleaños</li>
                </ul>
            </div>
        </div>
    );
};