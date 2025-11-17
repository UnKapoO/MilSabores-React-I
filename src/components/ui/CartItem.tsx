import React from 'react';
import { Link } from 'react-router-dom';
import { formatearPrecio } from '../../utils/formatters';
import type { Product } from '../../types/Product'; // Necesitaremos la "forma" del producto

// --- Definimos las Props que recibirá ---
// Además del producto, necesitamos saber la CANTIDAD que hay en el carrito
interface CartItemProps {
    item: Product & { cantidad: number }; // Combinamos el Producto con la cantidad

    // Lógica que vendrá del "Cerebro" (CartContext)
    onRemove: (id: number) => void;
    onUpdateCantidad: (id: number, nuevaCantidad: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
    item,
    onRemove,
    onUpdateCantidad
}) => {

    // Funciones para manejar el selector de cantidad
    const handleIncrease = () => {
        onUpdateCantidad(item.id, item.cantidad + 1);
    };

    const handleDecrease = () => {
        if (item.cantidad > 1) {
            onUpdateCantidad(item.id, item.cantidad - 1);
        } else {
            // Si la cantidad es 1, disminuir significa eliminar
            onRemove(item.id);
        }
    };

    return (
        // 1. Contenedor principal (fila con borde)
        <div className="flex items-center gap-4 p-4 border-b border-gray-200">

            {/* 2. Imagen */}
            <img
                src={`/${item.imagen}`}
                alt={item.nombre}
                className="w-20 h-20 object-cover rounded-md"
            />

            {/* 3. Información (Nombre y Precio) */}
            <div className="flex-grow">
                <Link
                    to={`/producto/${item.id}`}
                    className="font-bold text-dark text-lg hover:text-primary hover:underline"
                >
                    {item.nombre}
                </Link>
                <p className="text-letra-cafe text-sm">
                    {formatearPrecio(item.precio)} c/u
                </p>
            </div>

            {/* 4. Selector de Cantidad (QuantifySelector) */}
            <div className="flex items-center border border-gray-300 rounded-md">
                <button
                    onClick={handleDecrease}
                    className="px-3 py-1 text-lg text-primary hover:bg-gray-100"
                >
                    -
                </button>
                <span className="px-4 py-1 font-bold text-dark">
                    {item.cantidad}
                </span>
                <button
                    onClick={handleIncrease}
                    className="px-3 py-1 text-lg text-primary hover:bg-gray-100"
                >
                    +
                </button>
            </div>

            {/* 5. Subtotal del Item */}
            <div className="w-24 text-right">
                <span className="font-bold text-lg text-dark">
                    {formatearPrecio(item.precio * item.cantidad)}
                </span>
            </div>

            {/* 6. Botón de Eliminar */}
            <button
                onClick={() => onRemove(item.id)}
                className="text-letra-gris hover:text-red-500 transition-colors"
                title="Eliminar producto"
            >
                <i className="fa-solid fa-trash fa-lg"></i>
            </button>
        </div>
    );
};

export default CartItem;