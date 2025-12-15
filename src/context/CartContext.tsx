import React, { createContext, useState, useContext, useRef, useCallback } from 'react';
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

    const [toastNotification, setToastNotification] = useState<ToastNotification | null>(null);
    const toastTimerRef = useRef<number | null>(null);

    const addToast = useCallback((message: string, type: ToastNotification['type'] = 'success') => {
        // 1. Limpiamos cualquier timer pendiente
        if (toastTimerRef.current) {
            window.clearTimeout(toastTimerRef.current);
        }

        // 2. Establecemos el nuevo mensaje (ID único para forzar refresco visual)
        const id = Date.now().toString();
        setToastNotification({ id, message, type });

        // 3. Programamos su destrucción en 3 segundos
        toastTimerRef.current = window.setTimeout(() => {
            setToastNotification(null);
            toastTimerRef.current = null;
        }, 3000);
    }, []);

    // --- Lógica del Carrito (Ahora usa 'addToast') ---
    // --- Lógica del Carrito con VALIDACIÓN CENTRALIZADA ---
    const addToCart = (product: Product, cantidad: number, personalizacion?: Omit<CartItem, 'id' | 'nombre' | 'descripcion' | 'imagen' | 'categoria' | 'codigo' | 'personalizable' | 'basePricePerPersona' | 'minPersonas' | 'maxPersonas' | 'coloresGlaseado' | 'cantidad'>) => {

        // 1. Obtener Stock Máximo (Si es undefined, asumimos 0)
        const stockMaximo = product.stock || 0;

        // 2. Verificar Stock Inicial (Si el producto ya está agotado de entrada)
        if (stockMaximo <= 0) {
            addToast("Lo sentimos, este producto está agotado.", "error");
            return;
        }

        // 3. Buscar si YA tenemos este producto en el carrito
        // (Tenemos que coincidir ID y Personalización para ser precisos)
        const itemExistente = cart.find(item =>
            item.id === product.id &&
            item.cantidadPersonas === personalizacion?.cantidadPersonas &&
            item.mensajeEspecial === personalizacion?.mensajeEspecial &&
            item.colorGlaseado === personalizacion?.colorGlaseado
        );

        // 4. Calcular cuánto tendríamos en total si agregamos lo nuevo
        const cantidadActualEnCarrito = itemExistente ? itemExistente.cantidad : 0;
        const cantidadFinal = cantidadActualEnCarrito + cantidad;

        // 5. FILTRO STOCK
        if (cantidadFinal > stockMaximo) {
            addToast(`Solo quedan ${stockMaximo} unidades (Ya tienes ${cantidadActualEnCarrito} en el carrito).`, "error");
            return; // <--- AQUÍ DETENEMOS TODO. No se agrega nada.
        }

        // --- Si pasamos las validaciones, procedemos a agregar ---

        const newItem: CartItem = {
            ...product,
            cantidad: cantidad,
            ...personalizacion
        };

        setCart(prevCart => {
            // Reusamos la lógica de búsqueda para actualizar
            const index = prevCart.findIndex(item =>
                item.id === newItem.id &&
                item.cantidadPersonas === newItem.cantidadPersonas &&
                item.mensajeEspecial === newItem.mensajeEspecial &&
                item.colorGlaseado === newItem.colorGlaseado
            );

            if (index >= 0) {
                // Si existe, actualizamos la cantidad
                const newCart = [...prevCart];
                newCart[index].cantidad += cantidad;
                return newCart;
            } else {
                // Si no existe, lo agregamos
                return [...prevCart, newItem];
            }
        });

        addToast(`${cantidad} x ${product.nombre} añadido(s)!`, 'success');
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