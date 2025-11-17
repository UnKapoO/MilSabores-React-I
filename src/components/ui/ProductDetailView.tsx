import React, { useState } from 'react';
import type { Product } from '../../types/Product';
import { formatearPrecio } from '../../utils/formatters';
import { Button } from './common/Button';

// --- Definimos las Props que recibirá ---
interface ProductDetailViewProps {
    product: Product;
    onAddToCart: (product: Product, cantidad: number) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onAddToCart }) => {
    // Estado para manejar el selector de cantidad
    const [cantidad, setCantidad] = useState(1);

    const handleIncrease = () => {
        setCantidad(prev => prev + 1);
    };

    const handleDecrease = () => {
        setCantidad(prev => (prev > 1 ? prev - 1 : 1)); // No deja bajar de 1
    };

    const handleAddToCartClick = () => {
        onAddToCart(product, cantidad);
    };

    return (
        // 1. Grid principal (2 columnas en escritorio)
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            {/* --- COLUMNA IZQUIERDA: IMAGEN --- */}
            <div className="bg-white p-4 rounded-lg shadow-md border">
                <img
                    src={`/${product.imagen}`}
                    alt={product.nombre}
                    className="w-full h-auto object-cover rounded-lg"
                />
                {/* (Aquí se podría agregar una galería de thumbnails si hubiera más imágenes) */}
            </div>

            {/* --- COLUMNA DERECHA: INFORMACIÓN --- */}
            <div>
                {/* 2. Nombre del Producto (fuente secundaria) */}
                <h1 className="font-secundaria text-5xl text-dark mb-4">{product.nombre}</h1>

                {/* 3. Precio */}
                <p className="text-4xl font-bold text-primary mb-6">
                    {formatearPrecio(product.precio)}
                </p>

                {/* 4. Descripción */}
                <p className="text-letra-cafe text-lg mb-6 leading-relaxed">
                    {product.descripcion}
                </p>

                {/* 5. Detalles (Código y Categoría) */}
                <div className="text-sm text-letra-gris space-y-1 mb-8">
                    <p><strong>Código:</strong> {product.codigo}</p>
                    <p><strong>Categoría:</strong> <span className="capitalize">{product.categoria.replace('-', ' ')}</span></p>
                </div>

                {/* 6. Selector de Cantidad + Botón de Añadir */}
                <div className="flex items-center gap-4">
                    {/* Selector (copiado de CartItem) */}
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

                    {/* Botón de Añadir */}
                    <Button
                        variant="primary"
                        onClick={handleAddToCartClick}
                        className="flex-grow text-lg" // Hacemos que el botón sea más grande
                    >
                        <i className="fa-solid fa-cart-plus mr-2"></i>
                        Agregar al Carrito
                    </Button>
                </div>
            </div>
        </div>
    );
};