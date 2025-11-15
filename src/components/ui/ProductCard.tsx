import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/Product';
import { formatearPrecio } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/producto/${product.id}`);
  };

  return (
    // ¡Aquí está la traducción!
    // Reemplazamos <Card> por <div> y .productCard por clases de Tailwind
    <div 
      className="h-full flex flex-col border border-gray-200 rounded-lg shadow-sm overflow-hidden cursor-pointer transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={handleViewDetails} 
    >
      <img
        src={`/${product.imagen}`} // Usamos la imagen de /public/img/
        alt={product.nombre}
        className="w-full h-48 object-cover" // Clases de Tailwind
      />
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-dark mb-2">{product.nombre}</h3>
        
        <p className="text-xl font-bold text-primary mb-4 flex-grow">
          {formatearPrecio(product.precio)}
        </p>
        
        {/* Puedes agregar un botón aquí si quieres */}
        <button className="w-full bg-acento-rosa text-letra-cafe font-bold py-2 px-4 rounded-full hover:bg-acento-cafe hover:text-white transition-colors">
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}

export default ProductCard;