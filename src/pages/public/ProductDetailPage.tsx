import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../../types/Product';
import { Breadcrumb } from '../../components/ui/common/Breadcrumb';
import { ProductDetailView } from '../../components/ui/ProductDetailView';
import { EmptyState } from '../../components/ui/common/EmptyState';
import ProductCard from '../../components/ui/ProductCard';

function ProductDetailPage() {

    // --- 1. Lógica para leer la URL ---
    // useParams() nos da un objeto con las variables de la URL.
    // En App.tsx, la ruta será "/producto/:id", así que 'params.id' tendrá el número.
    const params = useParams();
    const productId = params.id;

    // --- 2. Estados ---
    // Un estado para guardar el producto que encontremos
    const [product, setProduct] = useState<Product | null>(null);
    // Un estado para saber si estamos "cargando"
    const [isLoading, setIsLoading] = useState(true);

    const [recomendados, setRecomendados] = useState<Product[]>([]);
    // --- 3. Lógica de Fetch ---
    useEffect(() => {
        // Función para buscar UN solo producto
        const fetchProduct = async () => {
            setIsLoading(true); // Empezamos a cargar
            setRecomendados([]);
            try {
                const response = await fetch(`http://localhost:3001/productos/${productId}`);
                if (!response.ok) {
                    throw new Error('Producto no encontrado');
                }
                const data: Product = await response.json();
                setProduct(data); // Guardamos el producto encontrado

                // Ahora que tenemos el producto (data), buscamos otros de su categoría
                // (json-server truco: id_ne=${data.id} significa "ID que NO SEA" el actual)
                const relatedResponse = await fetch(
                    `http://localhost:3001/productos?categoria=${data.categoria}&id_ne=${data.id}&_limit=4`
                );
                const relatedData: Product[] = await relatedResponse.json();
                setRecomendados(relatedData); //Se guardan los recomendados
            } catch (error) {
                console.error(error);
                setProduct(null); // Si hay error, no hay producto
            } finally {
                setIsLoading(false); // Terminamos de cargar
            }
        };

        fetchProduct();
    }, [productId]); // <-- Se ejecuta cada vez que el ID de la URL cambie

    // --- 4. Renderizado ---
    return (
        <div className="container mx-auto py-12 px-4">
            {/* 5. Mostramos el Breadcrumb (incluso si está cargando) */}
            <Breadcrumb
                links={[{ to: '/', label: 'Inicio' }, { to: '/catalogo', label: 'Catálogo' }]}
                currentPage={product ? product.nombre : '...'}
            />

            <div className="mt-8">
                {/* 6. Lógica de Carga y Error */}
                {isLoading ? (
                    // A. Si está cargando...
                    <div className="text-center py-20">
                        <i className="fa-solid fa-spinner fa-spin text-primary text-4xl"></i>
                        <p className="mt-4 text-letra-cafe">Cargando producto...</p>
                    </div>
                ) : product ? (
                    // B. Si terminó y encontró el producto...
                    <ProductDetailView
                        product={product}
                        onAddToCart={(p: Product, qty: number) => console.log('Añadir al carrito:', p.nombre, qty)}
                    />
                ) : (
                    // C. Si terminó y NO encontró el producto...
                    <EmptyState
                        icon="fa-solid fa-circle-exclamation"
                        title="Producto no encontrado"
                        message="No pudimos encontrar el producto que buscas. Intenta volver al catálogo."
                    />
                )}
            </div>
            {/* --- RECOMENDADOS --- */}
            {/* La mostramos solo si hay productos recomendados */}
            {recomendados.length > 0 && (
                <section className="mt-16 pt-12 border-t border-gray-200">
                    <h2 className="text-3xl font-bold text-dark text-center mb-10">
                        También te puede interesar...
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Hacemos .map() y reutilizamos nuestro LEGO ProductCard */}
                        {recomendados.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default ProductDetailPage;