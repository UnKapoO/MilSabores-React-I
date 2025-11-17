import React from 'react';

// --- Definimos las Props que recibirá ---
interface PageHeaderProps {
    title: string;
    subtitle: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
    return (
        // 1. "Traducción" de tu .blog-hero o .catalogo-hero a Tailwind
        <section className="text-center mb-12 mt-4">

            {/* 2. Título principal */}
            <h1 className="font-secundaria text-5xl text-dark">
                {title}
            </h1>

            {/* 3. Subtítulo */}
            <p className="text-lg text-letra-cafe mt-4 max-w-2xl mx-auto">
                {subtitle}
            </p>

        </section>
    );
};