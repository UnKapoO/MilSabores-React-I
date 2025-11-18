import React, { createContext, useState, useContext, useRef } from 'react';
import type { Product } from '../types/Product';

// --- 1. Definimos la "forma" de un item en el carrito ---
export interface CartItem extends Product {
    cantidad: number;
    // Campos opcionales para personalización
    cantidadPersonas?: string;
    mensajeEspecial?: string;
    colorGlaseado?: string;
}

// --- 2. Definimos la "forma" del Toast ---
export interface ToastNotification {
    id: string; // ID único para forzar el re-renderizado
    message: string;
    type: 'success' | 'info' | 'error';
}

// --- 3. Definimos la "forma" del Cerebro (Context) ---
interface CartContextType {
    cart: CartItem[];
    // ¡CAMBIO! Ya no es un array, es UN solo objeto (o null)
    toastNotification: ToastNotification | null;
    addToCart: (product: Product, cantidad: number, personalizacion?: Omit<CartItem, 'id' | 'nombre' | 'descripcion' | 'imagen' | 'categoria' | 'codigo' | 'personalizable' | 'basePricePerPersona' | 'minPersonas' | 'maxPersonas' | 'coloresGlaseado' | 'cantidad'>) => void;
    removeFromCart: (productId: number) => void;
    updateCantidad: (productId: number, nuevaCantidad: number) => void;
    clearCart: () => void;
    addToast: (message: string, type?: ToastNotification['type']) => void; // Aún exportamos esto
}

// --- 4. Creamos el Context ---
const CartContext = createContext<CartContextType | undefined>(undefined);

// --- 5. Creamos el "Proveedor" (La Mochila) ---
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // --- ¡CAMBIO! El estado del Toast ahora es singular ---
    const [toastNotification, setToastNotification] = useState<ToastNotification | null>(null);
    // Ref para guardar el ID del timer (para poder cancelarlo)
    const toastTimerRef = useRef<number | null>(null);

    // --- ¡CAMBIO! Lógica de 'addToast' (Ahora "reemplaza") ---
    const addToast = (message: string, type: ToastNotification['type'] = 'success') => {
        // 1. Si ya hay un timer corriendo, lo cancelamos
        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current);
        }

        // 2. Creamos el nuevo toast
        const id = Date.now().toString();
        setToastNotification({ id, message, type });

        // 3. Creamos un NUEVO timer para borrar este toast
        toastTimerRef.current = window.setTimeout(() => { // Usamos 'window.setTimeout' para ser explícitos
            setToastNotification(null);
            toastTimerRef.current = null;
        }, 3000);
    };

    // --- Lógica del Carrito (Ahora usa 'addToast') ---
    const addToCart = (product: Product, cantidad: number, personalizacion?: Omit<CartItem, 'id' | 'nombre' | 'descripcion' | 'imagen' | 'categoria' | 'codigo' | 'personalizable' | 'basePricePerPersona' | 'minPersonas' | 'maxPersonas' | 'coloresGlaseado' | 'cantidad'>) => {
        const newItem: CartItem = {
            ...product,
            cantidad: cantidad,
            ...personalizacion
        };

        setCart(prevCart => {
            const itemExistente = prevCart.find(item =>
                item.id === newItem.id &&
                item.cantidadPersonas === newItem.cantidadPersonas &&
                item.mensajeEspecial === newItem.mensajeEspecial &&
                item.colorGlaseado === newItem.colorGlaseado
            );
            if (itemExistente) {
                return prevCart.map(item =>
                    item.id === itemExistente.id &&
                        item.cantidadPersonas === itemExistente.cantidadPersonas &&
                        item.mensajeEspecial === itemExistente.mensajeEspecial &&
                        item.colorGlaseado === itemExistente.colorGlaseado
                        ? { ...item, cantidad: item.cantidad + cantidad }
                        : item
                );
            } else {
                return [...prevCart, newItem];
            }
        });

        // ¡AQUÍ ESTÁ EL ARREGLO! 'product.nombre' ya viene modificado.
        const toastMsg = `${cantidad} x ${product.nombre} añadido(s)!`;
        addToast(toastMsg, 'success');
    };

    const removeFromCart = (productId: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
        addToast('Producto eliminado del carrito', 'info');
    };

    const updateCantidad = (productId: number, nuevaCantidad: number) => {
        if (nuevaCantidad <= 0) {
            removeFromCart(productId);
        } else {
            setCart(prevCart =>
                prevCart.map(item =>
                    item.id === productId ? { ...item, cantidad: nuevaCantidad } : item
                )
            );
            addToast('Cantidad actualizada', 'info');
        }
    };

    const clearCart = () => {
        setCart([]);
        addToast('Carrito vaciado', 'info');
    };

    // 6. Entregamos los valores (ahora 'toastNotification' singular)
    const value = {
        cart,
        toastNotification, // <-- ¡singular!
        addToCart,
        removeFromCart,
        updateCantidad,
        clearCart,
        addToast
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// --- 7. Hook (sin cambios) ---
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
};