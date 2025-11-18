import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/Product';
import { formatearPrecio } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  // Prop para avisar al padre (CatalogoPage) que se hizo clic
  onAddToCartClick: () => void;
}

function ProductCard({ product, onAddToCartClick }: ProductCardProps) {
  const navigate = useNavigate();

  // Navega a la página de detalle si se hace clic en la tarjeta
  const handleViewDetails = () => {
    navigate(`/producto/${product.id}`);
  };

  // Llama a la función del padre si se hace clic en el botón
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // ¡Importante! Evita que el clic en el botón active el handleViewDetails
    onAddToCartClick();
  };

  return (
    <div
      className="bg-white h-full flex flex-col border border-gray-200 rounded-lg shadow-sm overflow-hidden cursor-pointer transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={handleViewDetails}
    >
      <img
        src={`/${product.imagen}`}
        alt={product.nombre}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-dark mb-2">{product.nombre}</h3>

        <p className="text-xl font-bold text-primary mb-4 flex-grow">
          {formatearPrecio(product.precio)}
        </p>

        {/* Botón (ahora llama a handleAddToCart) */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-acento-rosa text-letra-cafe font-bold py-2 px-4 rounded-full hover:bg-acento-cafe hover:text-white transition-colors mt-auto"
        >
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}

export default ProductCard;