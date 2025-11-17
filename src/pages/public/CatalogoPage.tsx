import { useState, useEffect } from 'react';

// --- 1. Importamos TODOS los LEGOs que usará esta página ---
import { Breadcrumb } from '../../components/ui/common/Breadcrumb';
import { PageHeader } from '../../components/ui/common/PageHeader';
import { EmptyState } from '../../components/ui/common/EmptyState';
import { InputField } from '../../components/ui/common/InputField'; // Corregí la ruta a 'base'
import ProductFilterBar from '../../components/ui/ProductFilterBar';
import { obtenerNombreCategoria } from '../../utils/formatters';
import ProductCard from '../../components/ui/ProductCard';
import type { Product } from '../../types/Product';

// --- Datos para el Breadcrumb ---
const breadcrumbLinks = [
  { to: "/", label: "Inicio" }
];

function CatalogoPage() {
  // --- Estados de la Página ---
  const [products, setProducts] = useState<Product[]>([]); // El estado se llama 'products'
  const [activeCategory, setActiveCategory] = useState("todas");
  const [categories, setCategories] = useState<string[]>(["todas"]);
  const [searchTerm, setSearchTerm] = useState('');

  // --- useEffect para pedir los datos (sin cambios, está perfecto) ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/productos');
        const data: Product[] = await response.json();
        setProducts(data);

        const allCategories = data.map((p: Product) => p.categoria);
        const uniqueCategories = [...new Set(allCategories)];
        setCategories(["todas", ...uniqueCategories]);

      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    fetchProducts();
  }, []);

  // --- 5. Lógica de Filtrado  ---
  const filteredProducts = products.filter(product => { // <-- Usamos 'products', NO 'allPosts'
    // Condición 1: Filtrar por Categoría
    const matchesCategory = activeCategory === 'todas' || product.categoria === activeCategory;
    // Condición 2: Filtrar por Búsqueda (en el nombre)
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    // El producto solo se muestra si cumple AMBAS condiciones
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-fondo-crema container mx-auto py-12 px-4"> {/* Padding consistente */}

      {/* --- Componentes Estructurales --- */}
      <Breadcrumb links={breadcrumbLinks} currentPage="Catálogo" />

      <PageHeader
        title="Nuestro Catálogo"
        subtitle="Descubre nuestras deliciosas creaciones, hechas con amor y tradición."
      />

      {/* --- Barra de Búsqueda --- */}
      <div className="mb-8 max-w-lg mx-auto relative">
        <InputField
          label=""
          name="search"
          type="text"
          placeholder="Buscar por nombre (ej: Torta de Chocolate...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10" // Damos espacio a la izquierda para el ícono
        />
        {/* La Lupa (Ícono) */}
        <i className="fa-solid fa-magnifying-glass text-letra-gris absolute left-4 top-1/2 
        -translate-y-1/2 pointer-events-none"></i>
      </div>

      {/* --- Filtros de Categoría --- */}
      <ProductFilterBar
        categories={categories}
        activeCategory={activeCategory}
        onFilterChange={setActiveCategory}
        getCategoryName={obtenerNombreCategoria}
      />

      {/* --- Grid de Productos (Con lógica de EmptyState) --- */}
      <section className="mt-12">
        {activeCategory !== 'todas' && (
          <h2 className="text-3xl font-bold mb-6">
            {obtenerNombreCategoria(activeCategory)}
          </h2>
        )}
        {filteredProducts.length > 0 ? (
          // A. Si SÍ hay productos, muestra el grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          // B. Si NO hay productos, muestra el EmptyState
          <EmptyState
            icon="fa-solid fa-magnifying-glass"
            title="No se encontraron productos"
            message="Intenta con otra categoría o término de búsqueda."
          />
        )}
      </section>
    </div>
  );
}

export default CatalogoPage;