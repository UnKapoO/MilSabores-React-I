// src/pages/public/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ui/ProductCard';
import type { Product } from '../../types/Product';


function HomePage() {
  // 1. Creamos un "estado" para guardar los productos que lleguen del API
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // 2. Usamos useEffect para pedir los datos CUANDO la página cargue
  useEffect(() => {
    // Pedimos solo 4 productos para el Home
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/productos?_limit=4');
        const data = await response.json();
        setFeaturedProducts(data); // 3. Guardamos los productos en el estado
      } catch (error) {
        console.error("Error al cargar productos destacados:", error);
      }
    };

    fetchFeaturedProducts();
  }, []); // El [] vacío asegura que solo se ejecute 1 vez

  return (
    <>
      <section className="bg-gray-200 p-20 text-center">
        <h1 className="text-5xl font-secundaria">Mil Sabores</h1>
        <p className="text-xl mt-4">Sabores únicos, momentos inolvidables.</p>
        <Link to="/catalogo">
          <button className="bg-primary text-white py-3 px-6 mt-4 rounded-full font-bold uppercase">
            Ver Catálogo
          </button>
        </Link>
      </section>

      <div className="container mx-auto py-5">
        <section>
          <h2 className="text-3xl font-bold mb-4">Productos Destacados</h2>
          
          {/* 4. Hacemos .map() sobre el ESTADO (featuredProducts) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage;