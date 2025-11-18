import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../../types/Product';

// --- 1. Importamos TODOS los LEGOs (¡Ahora incluye Modales y cerebro!) ---
import { Breadcrumb } from '../../components/ui/common/Breadcrumb';
import { ProductDetailView } from '../../components/ui/ProductDetailView';
import { EmptyState } from '../../components/ui/common/EmptyState';
import ProductCard from '../../components/ui/ProductCard';
import { Modal } from '../../components/ui/common/Modal';
import { Button } from '../../components/ui/common/Button';
import { PersonalizationForm } from '../../components/ui/PersonalizationForm';
import { useCart } from '../../context/CartContext';
import { formatearPrecio } from '../../utils/formatters';


function ProductDetailPage() {
    const params = useParams();
    const productId = params.id;

    // --- Conexión al "Cerebro" ---
    const { addToCart } = useCart();

    // --- Estados de Página ---
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [recomendados, setRecomendados] = useState<Product[]>([]);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isPersonalizeModalOpen, setIsPersonalizeModalOpen] = useState(false);
    const [selectedCantidad, setSelectedCantidad] = useState(1); // ¡Guardamos la cantidad del botón!

    // --- Lógica de Fetch (igual que antes) ---
    useEffect(() => {
        // ... (tu 'fetchProduct' se queda 100% igual que antes, 
        //      cargando 'product' y 'recomendados') ...
        const fetchProduct = async () => {
            setIsLoading(true);
            setRecomendados([]);
            try {
                const response = await fetch(`http://localhost:3001/productos/${productId}`);
                if (!response.ok) {
                    throw new Error('Producto no encontrado');
                }
                const data: Product = await response.json();
                setProduct(data);

                const relatedResponse = await fetch(
                    `http://localhost:3001/productos?categoria=${data.categoria}&id_ne=${data.id}&_limit=4`
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

    // --- ¡NUEVAS FUNCIONES PARA MANEJAR EL FLUJO DE MODALES! ---

    // 1. Llamado desde ProductDetailView
    const handleAddToCartClick = (cantidad: number) => {
        if (!product) return; // Seguridad

        setSelectedCantidad(cantidad); // Guardamos la cantidad que el usuario eligió

        const categoriasTortas = ["tortas-cuadradas", "tortas-circulares", "especiales"];

        if (product.personalizable || categoriasTortas.includes(product.categoria)) {
            setIsConfirmModalOpen(true);
        } else {
            addToCart(product, cantidad);
        }
    };

    // 2. Llamado desde el Modal 1 (Botón "Agregar por defecto")
    const handleAddDefault = () => {
        if (product) {
            addToCart(product, selectedCantidad); // Usa la cantidad guardada
        }
        closeAllModals();
    };

    // 3. Llamado desde el Modal 1 (Botón "Sí, personalizar")
    const handleOpenPersonalize = () => {
        setIsConfirmModalOpen(false);
        setIsPersonalizeModalOpen(true);
    };

    // 4. Llamado desde el Modal 2 (Formulario)
    const handleAddCustom = (personalizacion: any, precioFinal: number) => {
        if (product) {
            const customizedProduct = {
                ...product,
                precio: precioFinal,
                nombre: `${product.nombre} (Personalizado)`,
            };
            addToCart(customizedProduct, selectedCantidad, personalizacion); // Usa la cantidad guardada
        }
        closeAllModals();
    };

    // 5. Función universal para cerrar todo
    const closeAllModals = () => {
        setIsConfirmModalOpen(false);
        setIsPersonalizeModalOpen(false);
        setSelectedCantidad(1); // Reseteamos la cantidad
    };


    return (
        <>
            <div className="bg-fondo-crema container mx-auto py-12 px-4">
                <Breadcrumb
                    links={[{ to: '/', label: 'Inicio' }, { to: '/catalogo', label: 'Catálogo' }]}
                    currentPage={product ? product.nombre : '...'}
                />

                <div className="mt-8">
                    {isLoading ? (
                        <div className="text-center py-20"> {/* ... (Loading Spinner) ... */} </div>
                    ) : product ? (
                        // B. Si encontró el producto...
                        <ProductDetailView
                            product={product}
                            // ¡Le pasamos el handler que abre los modales!
                            onAddToCartClick={handleAddToCartClick}
                        />
                    ) : (
                        // C. Si NO encontró el producto...
                        <EmptyState
                            icon="fa-solid fa-circle-exclamation"
                            title="Producto no encontrado"
                            message="No pudimos encontrar el producto que buscas."
                        />
                    )}
                </div>

                {/* --- Sección de Recomendados (igual que antes) --- */}
                {recomendados.length > 0 && (
                    <section className="mt-16 pt-12 border-t border-gray-200">
                        <h2 className="text-3xl font-bold text-dark text-center mb-10">
                            También te puede interesar...
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {recomendados.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCartClick={() => addToCart(product, 1)} // Los recomendados se añaden por defecto
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
            {/* Modal 1: Confirmación */}
            <Modal
                isOpen={isConfirmModalOpen && !!product}
                onClose={closeAllModals}
                title="¿Deseas personalizar tu torta?"
                size="lg" // Lo hacemos un poco más grande
            >
                {product && (
                    <div className="bg-fondo-crema -m-6 p-6">
                        <div className="flex gap-4 items-center p-4 bg-white rounded-lg mb-4">
                            <img src={`/${product.imagen}`} alt={product.nombre} className="w-20 h-20 rounded-md object-cover" />
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

            {/* Modal 2: Formulario */}
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