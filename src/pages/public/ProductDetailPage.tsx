import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../../types/Product';

// --- Imports de Componentes Reales ---
import { Breadcrumb } from '../../components/ui/common/Breadcrumb';
import { ProductDetailView } from '../../components/ui/ProductDetailView';
import { EmptyState } from '../../components/ui/common/EmptyState';
import ProductCard from '../../components/ui/ProductCard'; // ¡Aquí importamos tu tarjeta nueva!
import { Modal } from '../../components/ui/common/Modal';
import { Button } from '../../components/ui/common/Button';
import { PersonalizationForm } from '../../components/ui/PersonalizationForm';

// --- Imports de Lógica y Utils ---
import { useCart } from '../../context/CartContext';
import { formatearPrecio, getImageUrl } from '../../utils/formatters';

// Configuración del API
const API_URL = 'http://localhost:8080';

function ProductDetailPage() {
    const params = useParams();
    const productId = params.id;

    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [recomendados, setRecomendados] = useState<Product[]>([]);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isPersonalizeModalOpen, setIsPersonalizeModalOpen] = useState(false);
    const [selectedCantidad, setSelectedCantidad] = useState(1); 

    useEffect(() => {
        // Al cambiar de producto, subimos el scroll al inicio
        window.scrollTo(0, 0);

        const fetchProduct = async () => {
            setIsLoading(true);
            setRecomendados([]);
            try {
                // 1. Cargar Producto Principal
                const response = await fetch(`${API_URL}/productos/${productId}`);
                if (!response.ok) throw new Error('Producto no encontrado');
                const data: Product = await response.json();
                setProduct(data);

                // 2. Cargar Recomendados (Misma categoría, excluyendo el actual)
                const relatedResponse = await fetch(
                    `${API_URL}/productos?categoria=${data.categoria}&id_ne=${data.id}&_limit=4`
                );
                const relatedData: Product[] = await relatedResponse.json();
                setRecomendados(relatedData);
            } catch (error) {
                console.error(error);
                setProduct(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [productId]); 

    // --- MANEJO DE MODALES Y CARRITO ---
    const handleAddToCartClick = (cantidad: number) => {
        if (!product) return; 
        setSelectedCantidad(cantidad); 
        const categoriasEspeciales = ["tortas-cuadradas", "tortas-circulares", "especiales"];

        if (product.personalizable || categoriasEspeciales.includes(product.categoria)) {
            setIsConfirmModalOpen(true);
        } else {
            addToCart(product, cantidad);
        }
    };

    const handleAddDefault = () => {
        if (product) addToCart(product, selectedCantidad);
        closeAllModals();
    };

    const handleOpenPersonalize = () => {
        setIsConfirmModalOpen(false);
        setIsPersonalizeModalOpen(true);
    };

    const handleAddCustom = (personalizacion: any, precioFinal: number) => {
        if (product) {
            const customizedProduct = {
                ...product,
                precio: precioFinal,
                nombre: `${product.nombre} (Personalizado)`,
            };
            addToCart(customizedProduct, selectedCantidad, personalizacion); 
        }
        closeAllModals();
    };

    const closeAllModals = () => {
        setIsConfirmModalOpen(false);
        setIsPersonalizeModalOpen(false);
        setSelectedCantidad(1); 
    };

    return (
        <>
            <div className="bg-fondo-crema container mx-auto py-12 px-4 min-h-screen">
                <Breadcrumb
                    links={[{ to: '/', label: 'Inicio' }, { to: '/catalogo', label: 'Catálogo' }]}
                    currentPage={product ? product.nombre : '...'}
                />

                <div className="mt-8">
                    {isLoading ? (
                        <div className="text-center py-20">
                             <i className="fa-solid fa-spinner fa-spin text-4xl text-acento-rosa"></i>
                             <p className="text-gray-500 mt-4">Horneando detalles...</p>
                        </div>
                    ) : product ? (
                        <ProductDetailView
                            product={product}
                            onAddToCartClick={handleAddToCartClick}
                        />
                    ) : (
                        <EmptyState
                            icon="fa-solid fa-circle-exclamation"
                            title="Producto no encontrado"
                            message="Parece que este pastel ya se vendió (o el enlace no es correcto)."
                        />
                    )}
                </div>

                {/* --- SECCIÓN DE RECOMENDADOS --- */}
                {!isLoading && recomendados.length > 0 && (
                    <section className="mt-20 pt-12 border-t border-gray-200">
                        <h2 className="text-4xl font-secundaria text-dark text-center mb-10">
                            También te puede interesar...
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {recomendados.map(recommendedProduct => (
                                <ProductCard
                                    key={recommendedProduct.id}
                                    product={recommendedProduct}
                                    // Pasamos la función simple para agregar 1 unidad
                                    onAddToCartClick={() => addToCart(recommendedProduct, 1)} 
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* --- Modales --- */}
            <Modal
                isOpen={isConfirmModalOpen && !!product}
                onClose={closeAllModals}
                title="¿Deseas personalizar tu torta?"
            >
                {product && (
                    <div className="bg-fondo-crema -m-6 p-6">
                        <div className="flex gap-4 items-center p-4 bg-white rounded-lg mb-4">
                            <img 
                                src={getImageUrl(product.imagen)} 
                                alt={product.nombre} 
                                className="w-20 h-20 rounded-md object-cover" 
                            />
                            <div>
                                <h4 className="font-bold text-lg text-dark">{product.nombre}</h4>
                                <p className="text-primary font-bold">{formatearPrecio(product.precio)}</p>
                            </div>
                        </div>
                        <p className="text-letra-cafe mb-6">
                            Esta torta se agregará con <strong>({selectedCantidad})</strong> unidad(es).
                            Puedes personalizarla con un mensaje, tamaño y color.
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

            <Modal
                isOpen={isPersonalizeModalOpen && !!product}
                onClose={closeAllModals}
                title={`Personalizar ${product?.nombre}`}
                size="lg"
            >
                {product && (
                    <PersonalizationForm
                        product={product}
                        onCancel={closeAllModals}
                        onAddToCart={handleAddCustom}
                    />
                )}
            </Modal>
        </>
    );
}

export default ProductDetailPage;