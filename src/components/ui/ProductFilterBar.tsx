import { obtenerNombreCategoria } from '../../utils/formatters';

interface ProductFilterBarProps {
  categories: string[];
  activeCategory: string;
  onFilterChange: (category: string) => void;
}

function ProductFilterBar({ categories, activeCategory, onFilterChange }: ProductFilterBarProps) {
  return (
    // 1. Reemplazamos el <section> con clases de Tailwind
    <section className="flex justify-center mb-8">
      <div className="flex flex-wrap justify-center gap-3">

        {categories.map(category => {
          const isActive = activeCategory === category;

          return (
            // 2. Reemplazamos el <Button> de Bootstrap por un <button> normal
            <button
              key={category}
              onClick={() => onFilterChange(category)}

              // 3. ¡AQUÍ LA MAGIA DE TAILWIND!
              // Usamos un "ternario" para cambiar las clases dinámicamente
              // basado en si el botón está activo o no.
              className={`
                py-2 px-5 rounded-full font-bold text-sm transition-all shadow-sm
                ${isActive
                  ? 'bg-primary text-white scale-105' // Estilo ACTIVO (usamos el color de tu config)
                  : 'bg-white text-letra-cafe hover:bg-gray-100' // Estilo INACTIVO
                }
              `}
            >
              {obtenerNombreCategoria(category)}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ProductFilterBar;