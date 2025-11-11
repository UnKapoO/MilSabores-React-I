import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import styles from './ProductCard.module.css';
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
    <Card 
      className={`h-100 ${styles.productCard}`}
      onClick={handleViewDetails} 
    >
    
      {/* Card.Img es un hijo directo del <Card> con onClick */}
      <Card.Img
        variant="top"
        src={product.imagen}
        alt={product.nombre}
        className={styles.productImage}
      />

      <Card.Body className="d-flex flex-column flex-grow-1">
        <Card.Title className={styles.productName}>{product.nombre}</Card.Title>

        <div className={styles.productPrice}>
          {formatearPrecio(product.precio)}
        </div>
        
        {/* El botón eliminado se queda eliminado, ¡perfecto! */}
      </Card.Body>

    </Card> // <-- Cierra el <Card> padre
  );
}

export default ProductCard;