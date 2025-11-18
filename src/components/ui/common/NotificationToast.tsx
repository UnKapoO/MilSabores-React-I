import { useState, useEffect, useRef } from 'react';
import { useCart } from '../../../context/CartContext';

function NotificationToast() {
    // 1. Lee el toast (singular) del "cerebro"
    const { toastNotification } = useCart();

    // 2. Estados locales para controlar la animación y el contenido
    const [isVisible, setIsVisible] = useState(false);
    const [currentMessage, setCurrentMessage] = useState('');
    const [currentType, setCurrentType] = useState<'success' | 'info' | 'error'>('info');

    const timerRef = useRef<number | null>(null); // Ref para el timer de reemplazo

    useEffect(() => {
        if (toastNotification) {
            // Si llega un toast nuevo...
            // 1. Inicia el "fade out apresurado" (si ya había uno)
            setIsVisible(false);

            // 2. Limpia cualquier timer de "fade-in" anterior
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            // 3. Espera 150ms (para que el fade-out se vea) y luego cambia el contenido
            timerRef.current = window.setTimeout(() => {
                setCurrentMessage(toastNotification.message);
                setCurrentType(toastNotification.type);
                setIsVisible(true); // 4. Inicia el fade-in
            }, 150); // 150ms es un buen tiempo de "reemplazo"

        } else {
            // Si el context borra el toast (después de 3s), solo haz fade-out
            setIsVisible(false);
        }

        // Limpieza al desmontar el componente
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [toastNotification]); // Reacciona al 'toastNotification' del cerebro

    // Lógica de estilos
    let bgColor = 'bg-acento-cafe';
    let icon = 'fa-info-circle';
    if (currentType === 'success') {
        bgColor = 'bg-green-600';
        icon = 'fa-check-circle';
    } else if (currentType === 'error') {
        bgColor = 'bg-red-600';
        icon = 'fa-exclamation-circle';
    }

    return (
        <div
            className={`
        fixed top-32 right-6 z-[100] py-3 px-6 rounded-lg shadow-lg 
        flex items-center gap-3 text-white
        transition-all duration-300 ease-in-out
        ${bgColor}
        ${isVisible
                    ? 'opacity-100 translate-x-0' // Estado Visible (Fade-in)
                    : 'opacity-0 translate-x-full' // Estado Oculto (Fade-out)
                }
                `}
            // Ponemos un 'key' que cambia para forzar el reinicio de la animación si es necesario
            key={toastNotification?.id || 'empty'}
        >
            <i className={`fa-solid ${icon}`}></i>
            <span className="font-bold">{currentMessage}</span>
        </div>
    );
}

export default NotificationToast;