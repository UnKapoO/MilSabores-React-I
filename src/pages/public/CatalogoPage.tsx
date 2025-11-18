import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// --- Importamos todos los LEGOs ---
import { Breadcrumb } from '../../components/ui/common/Breadcrumb';
import { PageHeader } from '../../components/ui/common/PageHeader';
import { EmptyState } from '../../components/ui/common/EmptyState';
import { InputField } from '../../components/ui/common/InputField';
import { Button } from '../../components/ui/common/Button';
import { Modal } from '../../components/ui/common/Modal';
import { PersonalizationForm } from '../../components/ui/PersonalizationForm';
import ProductFilterBar from '../../components/ui/ProductFilterBar';
import ProductCard from '../../components/ui/ProductCard';

// --- Importamos el Cerebro y Tipos/Helpers ---
import { useCart } from '../../context/CartContext';
import type { Product } from '../../types/Product';
import { formatearPrecio, obtenerNombreCategoria } from '../../utils/formatters';

// --- Datos para el Breadcrumb ---
const breadcrumbLinks = [
  { to: "/", label: "Inicio" }
];

function CatalogoPage() {
  // --- Estados de la Página ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["todas"]);

  // --- Estados de Filtro y Búsqueda ---
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaFromUrl = searchParams.get('categoria');
  const [activeCategory, setActiveCategory] = useState(categoriaFromUrl || "todas");
  const [searchTerm, setSearchTerm] = useState('');

  // --- Estados de los Modales ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPersonalizeModalOpen, setIsPersonalizeModalOpen] = useState(false);

  // --- Conexión al "Cerebro" ---
  const { addToCart } = useCart();

  // --- Carga de Datos (API) ---
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

  // --- Lógica de Filtrado ---
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'todas' || product.categoria === activeCategory;
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // --- Handlers de Filtro ---
  const handleFilterChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'todas') {
      setSearchParams({});
    } else {
      setSearchParams({ categoria: category });
    }
  };

  // --- Handlers de Modales ---
  const handleAddToCartClick = (product: Product) => {
    const categoriasTortas = ["tortas-cuadradas", "tortas-circulares", "especiales"];

    if (product.personalizable || categoriasTortas.includes(product.categoria)) {
      setSelectedProduct(product);
      setIsConfirmModalOpen(true);
    } else {
      addToCart(product, 1);
    }
  };

  const handleAddDefault = () => {
    if (selectedProduct) {
      addToCart(selectedProduct, 1);
    }
    closeAllModals();
  };

  const handleOpenPersonalize = () => {
    setIsConfirmModalOpen(false);
    setIsPersonalizeModalOpen(true);
  };

  const handleAddCustom = (personalizacion: any, precioFinal: number) => {
    if (selectedProduct) {
      const customizedProduct = {
        ...selectedProduct,
        precio: precioFinal,
        nombre: `${selectedProduct.nombre} (Personalizado)`,
      };
      addToCart(customizedProduct, 1, personalizacion);
    }
    closeAllModals();
  };

  const closeAllModals = () => {
    setIsConfirmModalOpen(false);
    setIsPersonalizeModalOpen(false);
    setSelectedProduct(null);
  };

  // --- Renderizado ---
  return (
    <>
      <div className="bg-fondo-crema container mx-auto py-12 px-4">

        <Breadcrumb links={breadcrumbLinks} currentPage="Catálogo" />

        <PageHeader
          title="Nuestro Catálogo"
          subtitle="Descubre nuestras deliciosas creaciones, hechas con amor y tradición."
        />

        <div className="mb-8 max-w-lg mx-auto relative">
          <InputField
            label=""
            name="search"
            type="text"
            placeholder="Buscar por nombre (ej: Torta de Chocolate...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <i className="fa-solid fa-magnifying-glass text-letra-gris absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"></i>
        </div>

        <ProductFilterBar
          categories={categories}
          activeCategory={activeCategory}
          onFilterChange={handleFilterChange}
          getCategoryName={obtenerNombreCategoria}
        />

        <section className="mt-12">
          {activeCategory !== 'todas' && (
            <h2 className="text-3xl font-bold mb-6">
              {obtenerNombreCategoria(activeCategory)}
            </h2>
          )}

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCartClick={() => handleAddToCartClick(product)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="fa-solid fa-magnifying-glass"
              title="No se encontraron productos"
              message="Intenta con otra categoría o término de búsqueda."
            />
          )}
        </section>
      </div>

      {/* --- Modales (no se ven hasta que se activan) --- */}

      {/* Modal 1: Confirmación */}
      <Modal
        isOpen={isConfirmModalOpen && !!selectedProduct}
        onClose={closeAllModals}
        title="¿Deseas personalizar tu torta?"
      >
        {selectedProduct && (
          <div>
            <div className="bg-white -m-6 flex gap-4 items-center p-4 rounded-lg mb-4">
              <img src={`/${selectedProduct.imagen}`} alt={selectedProduct.nombre} className="w-20 h-20 rounded-md object-cover" />
              <div>
                <h4 className="font-bold text-lg text-dark">{selectedProduct.nombre}</h4>
                <p className="text-primary font-bold">{formatearPrecio(selectedProduct.precio)}</p>
              </div>
            </div>
            <p className="text-letra-cafe mb-6">
              Puedes personalizarla con un mensaje, tamaño (cantidad de personas) y color de glaseado.
            </p>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={handleAddDefault}>
                No, agregar por defecto
              </Button>
              <Button variant="primary" onClick={handleOpenPersonalize}>
                Sí, personalizar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal 2: Formulario */}
      <Modal
        isOpen={isPersonalizeModalOpen && !!selectedProduct}
        onClose={closeAllModals}
        title={`Personalizar ${selectedProduct?.nombre}`}
        size="lg"
      >
        {selectedProduct && (
          <PersonalizationForm
            product={selectedProduct}
            onCancel={closeAllModals}
            onAddToCart={handleAddCustom}
          />
        )}
      </Modal>
    </>
  );
}

export default CatalogoPage;