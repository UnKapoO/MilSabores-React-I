import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/Product';
import { formatearPrecio, getImageUrl } from '../../utils/formatters';


interface ProductCardProps {
  product: Product;
  // Prop para avisar al padre que se hizo clic en agregar
  onAddToCartClick: () => void;
}

function ProductCard({ product, onAddToCartClick }: ProductCardProps) {
  const navigate = useNavigate();

  // Navega a la página de detalle si se hace clic en la tarjeta
  const handleViewDetails = () => {
    navigate(`/producto/${product.id}`);
  };

  // Llama a la función del padre si se hace clic en el botón
  // stopPropagation evita que se active el evento click de la tarjeta (navegación)
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCartClick();
  };

  return (
    <div
      className="bg-white h-full flex flex-col border border-gray-200 rounded-lg shadow-sm overflow-hidden cursor-pointer transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 group"
      onClick={handleViewDetails}
    >
      {/* Contenedor de Imagen con efecto Zoom suave */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(product.imagen)}
          alt={product.nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        {/* Nombre del Producto */}
        <h3 className="text-lg font-bold text-dark mb-1 leading-tight line-clamp-2">
          {product.nombre}
        </h3>
        
        {/* Categoría (Visualmente ayuda) */}
        <p className="text-xs text-letra-gris mb-4 capitalize">
            {product.categoria?.replace(/-/g, ' ')}
        </p>

        {/* --- DISEÑO SOLICITADO: PRECIO IZQ - BOTÓN DER --- */}
        <div className="mt-auto flex items-center justify-between">
          <p className="text-xl font-bold text-primary">
            {formatearPrecio(product.precio)}
          </p>

          <button
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full bg-acento-rosa text-letra-cafe flex items-center justify-center shadow-md hover:bg-acento-cafe hover:text-white transition-all transform hover:scale-110"
            title="Agregar al Carrito"
          >
            {/* Icono de FontAwesome */}
            <i className="fa-solid fa-plus text-lg"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;