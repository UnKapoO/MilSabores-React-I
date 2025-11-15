// src/pages/public/CatalogoPage.tsx
import React, { useState, useEffect } from 'react';
import ProductFilterBar from '../../components/ui/ProductFilterBar';
import { obtenerNombreCategoria } from '../../utils/formatters';
import ProductCard from '../../components/ui/ProductCard';
import type { Product } from '../../types/Product';

function CatalogoPage() {
  // 1. Estado para guardar TODOS los productos del API
  const [products, setProducts] = useState<Product[]>([]);
  
  // 2. Estado para el filtro (¡esto ya lo tenía tu compañera, está perfecto!)
  const [activeCategory, setActiveCategory] = useState("todas");
  
  // 3. Estado para las categorías
  const [categories, setCategories] = useState<string[]>(["todas"]);

  // 4. useEffect para pedir los productos del API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/productos');
        const data = await response.json();
        setProducts(data); // Guardamos los productos en el estado

        // Extraemos las categorías de los datos recibidos
        const allCategories = data.map((p: Product) => p.categoria);
        const uniqueCategories = [...new Set(allCategories)];
        setCategories(["todas", ...uniqueCategories]);
        
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    fetchProducts();
  }, []);

  // 5. Lógica de Filtrado (ahora filtra el "estado" 'products')
  const filteredProducts = products.filter(product => {
    if (activeCategory === "todas") {
      return true; 
    }
    return product.categoria === activeCategory;
  });

  return (
    <div className="container mx-auto py-5">
      <section className="text-center mb-5">
        <h1 className="font-secundaria text-5xl">Nuestro Catálogo</h1>
      </section>
      
      {/* (El FilterBar se romperá por el .module.css, lo arreglamos después) */}
      <ProductFilterBar 
        categories={categories}
        activeCategory={activeCategory}
        onFilterChange={setActiveCategory}
      />

      <section className="mt-8">
        <h2 className="text-3xl font-bold mb-4">
          {obtenerNombreCategoria(activeCategory)}
        </h2>

        {/* 6. Grid con Tailwind (reemplazando <Row> y <Col>) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center mt-10">
            <p>No se encontraron productos en esta categoría.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default CatalogoPage;