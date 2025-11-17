import React from 'react';
import { Link } from 'react-router-dom';

// --- Definimos la "forma" de una miga ---
export interface BreadcrumbLink {
    to: string;   // La URL (ej: "/catalogo")
    label: string; // El texto (ej: "Catálogo")
}

// --- Definimos las Props que recibirá ---
interface BreadcrumbProps {
    // Recibirá un array de "migas"
    links: BreadcrumbLink[];
    // Y el nombre de la página actual (que no es un link)
    currentPage: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ links, currentPage }) => {
    return (
        // Usamos 'flex' y 'items-center' para alinear todo
        // 'text-sm' para texto pequeño y 'text-letra-cafe' para el color
        <nav className="flex items-center gap-2 text-sm text-letra-cafe py-3 px-4 rounded-md">

            {/* 1. Usamos .map() para crear los links (ej: "Inicio /") */}
            {links.map((link) => (
                // Usamos el "Fragmento" <> para agrupar el Link y el separador
                <React.Fragment key={link.to}>
                    <Link
                        to={link.to}
                        className="hover:text-primary hover:underline"
                    >
                        {link.label}
                    </Link>
                    {/* El separador */}
                    <span className="text-letra-gris">/</span>
                </React.Fragment>
            ))}

            {/* 2. Mostramos la página actual (sin link y en un color diferente) */}
            <span className="font-bold text-primary">
                {currentPage}
            </span>
        </nav>
    );
};