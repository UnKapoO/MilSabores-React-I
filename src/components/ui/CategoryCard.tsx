import React from 'react';
import { Link } from 'react-router-dom';

// --- Definimos las Props que recibirá ---
interface CategoryCardProps {
    title: string;
    imageUrl: string; // La ruta a la imagen de fondo
    linkTo: string;  // La URL a la que navegará (ej: "/catalogo?categoria=tortas")
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ title, imageUrl, linkTo }) => {

    // 1. Estilos para la imagen de fondo
    // Usamos 'style' para poder poner la URL de la imagen dinámicamente
    const cardStyle = {
        backgroundImage: `linear-gradient(#00000070, #00000070), url(${imageUrl})`
    };

    return (
        // 2. "Traducción" de tu .card-category a Tailwind
        // Usamos 'group' para que el botón "Ver más" reaccione cuando pasas el mouse sobre la TARJETA
        <Link
            to={linkTo}
            className='group relative flex flex-col justify-end items-center p-6 h-80 
            rounded-2xl overflow-hidden shadow-md cursor-pointer 
            bg-cover bg-center transition-all duration-300 
            hover:scale-105 hover:shadow-xl'
            style={cardStyle}
        >

            {/* 3. Título (con la línea de abajo) */}
            <h3
                className="font-secundaria text-4xl text-white text-center relative 
                mb-4 pb-2"
            >
                {title}
                {/* La línea decorativa de abajo */}
                <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-12 
                    bg-primary transition-all duration-300 
                    group-hover:w-20"
                ></span>
            </h3>

            {/* 4. Botón "Ver más" (traducido de tu <span>) */}
            <span
                className="text-white text-sm font-bold py-2 px-5 
                border-2 border-white rounded-full
                transition-all duration-300 
                group-hover:bg-primary group-hover:border-primary"
            >
                Ver más
            </span>
        </Link>
    );
};