import { Button } from 'react-bootstrap';
import styles from './ProductFilterBar.module.css';
import { obtenerNombreCategoria } from '../../utils/formatters';

interface ProductFilterBarProps {
  categories: string[];
  activeCategory: string;
  onFilterChange: (category: string) => void; 
}

function ProductFilterBar({ categories, activeCategory, onFilterChange }: ProductFilterBarProps) {
  return (
    <section className={styles.filterBar}>
      <div className={styles.filterContainer}>
        {categories.map(category => {

          // 1. Determinamos si este botón es el activo
          const isActive = activeCategory === category;

          // 2. Creamos la lista de clases dinámicamente
          // Usamos nuestra clase base '.filterButton'
          // y AÑADIMOS '.active' si isActive es true
          const buttonClasses = `
            ${styles.filterButton}
            ${isActive ? styles.active : ""}
          `;

          return (
            <Button
              key={category}
              onClick={() => onFilterChange(category)}
              variant="light" 

          
              className={buttonClasses.trim()} 
            >
              {obtenerNombreCategoria(category)}
            </Button>
          );
        })}
      </div>
    </section>
  );
}

export default ProductFilterBar;