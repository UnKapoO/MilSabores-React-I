import React from 'react';
import { useCart } from '../../../context/CartContext';

function NotificationToast() {
    // 1. Solo leemos el estado.
    const { toastNotification } = useCart();

    // 2. Si es null, no renderizamos nada.
    if (!toastNotification) return null;

    // 3. Estilos dinámicos
    let bgColor = 'bg-acento-cafe';
    let icon = 'fa-info-circle';
    
    if (toastNotification.type === 'success') {
        bgColor = 'bg-green-600';
        icon = 'fa-check-circle';
    } else if (toastNotification.type === 'error') {
        bgColor = 'bg-red-600';
        icon = 'fa-exclamation-circle';
    }

    return (
        <div 
            
            key={toastNotification.id}
            className={`
                fixed top-32 right-6 z-[100] py-3 px-6 rounded-lg shadow-lg 
                flex items-center gap-3 text-white
                animate-fade-in-down  
                ${bgColor}
            `}
        >
            <i className={`fa-solid ${icon}`}></i>
            <span className="font-bold">{toastNotification.message}</span>
            
            {/* Animación CSS simple (Agrégala a tu index.css si no existe) */}
            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fadeInDown 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

export default NotificationToast;