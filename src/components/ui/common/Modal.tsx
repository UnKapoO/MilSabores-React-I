import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

// --- Definimos las Propiedades (Props) que recibirá ---
interface ModalProps {
    isOpen: boolean; // El "estado" que dice si el modal se ve o no
    onClose: () => void; // La función que se llama para CERRAR el modal
    children: React.ReactNode; // El CONTENIDO que irá dentro del modal
    title: string; // El título para el encabezado
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {

    // --- Efecto para bloquear el scroll del body ---
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Bloquea el scroll
        } else {
            document.body.style.overflow = 'auto'; // Desbloquea el scroll
        }

        // Función de limpieza (se ejecuta cuando el componente se destruye)
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]); // Este efecto se ejecuta cada vez que 'isOpen' cambia

    // Si el modal no está abierto, no renderiza nada (null)
    if (!isOpen) return null;

    // --- Renderizado del Modal usando un Portal ---
    // El portal renderiza el modal fuera de la jerarquía normal de React,
    // directamente en el 'document.body' para evitar problemas de z-index.
    return ReactDOM.createPortal(
        <>
            {/* 1. El Fondo Oscuro (Overlay) */}
            <div
                className="fixed inset-0 bg-black bg-opacity-70 z-50 transition-opacity"
                onClick={onClose} // Cierra el modal si se hace clic en el fondo
            />

            {/* 2. El Contenedor del Modal (La caja blanca) */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     bg-white rounded-lg shadow-xl z-50 w-full max-w-md
                     flex flex-col overflow-hidden">

                {/* 3. Encabezado (Título y Botón de Cerrar) */}
                <header className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-letra-cafe">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <i className="fa-solid fa-xmark fa-xl"></i>
                    </button>
                </header>

                {/* 4. Cuerpo (El contenido que le pasemos) */}
                <main className="p-6">
                    {children}
                </main>

                {/* (Podríamos agregar un footer aquí con botones de "Aceptar" / "Cancelar") */}
            </div>
        </>,
        document.body // Aquí le decimos al portal dónde renderizarse
    );
};