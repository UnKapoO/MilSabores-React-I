import React, { useState } from 'react';
import type { Product } from '../../types/Product';
import { formatearPrecio, getImageUrl } from '../../utils/formatters';
import { Button } from './common/Button';
// ¡Quitamos 'useCart' y 'ProductCustomizer'!

// --- 1. Definimos las Props NUEVAS ---
// Ya no es 'inteligente', así que necesita que el "padre" le diga qué hacer
interface ProductDetailViewProps {
    product: Product;
    onAddToCartClick: (cantidad: number) => void; // Solo "avisa" al padre
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onAddToCartClick }) => {
    // El estado de 'cantidad' se queda aquí, ¡eso está bien!
    const [cantidad, setCantidad] = useState(1);

    const handleIncrease = () => {
        setCantidad(prev => prev + 1);
    };

    const handleDecrease = () => {
        setCantidad(prev => (prev > 1 ? prev - 1 : 1));
    };

    // 2. El handler AHORA solo "avisa" al padre
    const handleAddToCart = () => {
        onAddToCartClick(cantidad); // Pasa la cantidad seleccionada al padre
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            {/* --- COLUMNA IZQUIERDA: IMAGEN (Sin cambios) --- */}
            <div>
                <img
                    src={getImageUrl(product.imagen)}
                    alt={product.nombre}
                    className="m-2 w-full h-64 md:h-[500px] object-cover rounded-lg"
                />
            </div>

            {/* --- COLUMNA DERECHA: INFORMACIÓN --- */}
            <div>
                <h1 className="font-secundaria text-5xl text-dark mb-4">{product.nombre}</h1>

                {/* 3. El precio ahora es siempre el 'base' (ya no usamos 'currentPrice') */}
                <p className="text-4xl font-bold text-primary mb-6">
                    {formatearPrecio(product.precio)}
                </p>

                <p className="text-letra-cafe text-lg mb-6 leading-relaxed">
                    {product.descripcion}
                </p>

                <div className="text-sm text-letra-gris space-y-1 mb-8">
                    <p><strong>Código:</strong> {product.codigo}</p>
                    <p><strong>Categoría:</strong> <span className="capitalize">{product.categoria.replace('-', ' ')}</span></p>
                </div>

                {/* 4. ¡BORRAMOS EL <ProductCustomizer> DE AQUÍ! */}

                {/* 5. Selector de Cantidad + Botón de Añadir */}
                <div className="flex items-center gap-4 mt-8">
                    {/* Selector de cantidad (sin cambios) */}
                    <div className="flex items-center border border-gray-300 rounded-full">
                        <button
                            onClick={handleDecrease}
                            className="px-5 py-2 text-2xl text-primary hover:bg-gray-100 rounded-l-full"
                        >
                            -
                        </button>
                        <span className="px-6 py-2 font-bold text-dark text-lg">
                            {cantidad}
                        </span>
                        <button
                            onClick={handleIncrease}
                            className="px-5 py-2 text-2xl text-primary hover:bg-gray-100 rounded-r-full"
                        >
                            +
                        </button>
                    </div>

                    {/* Botón (ahora llama a 'handleAddToCart') */}
                    <Button
                        variant="primary"
                        onClick={handleAddToCart}
                        className="flex-grow text-lg"
                    >
                        <i className="fa-solid fa-cart-plus mr-2"></i>
                        Agregar al Carrito
                    </Button>
                </div>
            </div>
        </div>
    );
};