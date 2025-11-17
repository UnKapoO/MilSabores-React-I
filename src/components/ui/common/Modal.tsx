import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
    size?: 'md' | 'lg' | '2xl'; // <-- 1. ¡NUEVA PROP!
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md' // <-- Valor por defecto
}) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // 2. Lógica para cambiar el tamaño
    let sizeClass = 'max-w-md'; // Por defecto
    if (size === 'lg') sizeClass = 'max-w-lg';
    if (size === '2xl') sizeClass = 'max-w-2xl'; // Más ancho para el blog

    return ReactDOM.createPortal(
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-70 z-50 transition-opacity"
                onClick={onClose}
            />

            {/* 3. ¡Usamos la nueva 'sizeClass' aquí! */}
            <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            bg-white rounded-lg shadow-xl z-50 w-11/12 ${sizeClass}
            flex flex-col`}>

                <header className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-letra-cafe">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <i className="fa-solid fa-xmark fa-xl"></i>
                    </button>
                </header>

                {/* 4. ¡AQUÍ ESTÁ EL ARREGLO DEL SCROLL! */}
                <main className="p-6 max-h-[70vh] overflow-y-auto">
                    {children}
                </main>
            </div>
        </>,
        document.body
    );
};