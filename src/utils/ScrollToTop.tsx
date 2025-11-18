import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Este es un "Hook" personalizado que detecta cambios de ruta
function ScrollToTop() {
    // Obtiene el 'pathname' (ej: "/catalogo" o "/producto/1")
    const { pathname } = useLocation();

    // Esto se ejecuta CADA VEZ que el 'pathname' cambia
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]); // La dependencia es el pathname

    return null; // No renderiza nada en el HTML
}

export default ScrollToTop;