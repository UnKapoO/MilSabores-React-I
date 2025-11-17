// ¡Ya no importamos 'obtenerNombreCategoria' aquí!
// import { obtenerNombreCategoria } from '../../utils/formatters';

interface ProductFilterBarProps {
  categories: string[];
  activeCategory: string;
  onFilterChange: (category: string) => void;
  // ¡AQUÍ ESTÁ EL ARREGLO! Hacemos que la prop sea requerida:
  getCategoryName: (category: string) => string;
}

function ProductFilterBar({
  categories,
  activeCategory,
  onFilterChange,
  getCategoryName // <-- 1. La recibimos aquí
}: ProductFilterBarProps) {
  
  return (
    <section className="flex justify-center mb-8">
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map(category => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              onClick={() => onFilterChange(category)}
              className={`
                py-2 px-5 rounded-full font-bold text-sm transition-all shadow-sm
                ${isActive
                  ? 'bg-primary text-white scale-105'
                  : 'bg-white text-letra-cafe hover:bg-gray-100'
                }
              `}
            >
              {/* 2. ¡Y la usamos aquí! */}
              {getCategoryName(category)}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ProductFilterBar;