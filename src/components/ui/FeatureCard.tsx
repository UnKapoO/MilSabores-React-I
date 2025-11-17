import React from 'react';

// --- Definimos las Props que recibirá ---
interface FeatureCardProps {
    icon: string;    // El ícono de FontAwesome (ej: "fa-solid fa-shield-halved")
    title: string;   // El título (ej: "Garantía de frescura")
    subtitle: string; // El texto de abajo (ej: "100% productos frescos")
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, subtitle }) => {
    return (
        // 1. "Traducción" de tu .card-feature a Tailwind
        <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">

            {/* 2. Ícono (usamos tu color 'text-primary') */}
            <i className={`${icon} text-4xl text-primary`}></i>

            {/* 3. Contenido de texto */}
            <div>
                <span className="font-bold text-lg text-dark">
                    {title}
                </span>
                <p className="text-sm text-letra-cafe">
                    {subtitle}
                </p>
            </div>
        </div>
    );
};