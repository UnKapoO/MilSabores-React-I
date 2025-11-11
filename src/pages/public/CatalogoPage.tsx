// src/pages/public/CatalogoPage/CatalogoPage.tsx
import React, { useState } from 'react'; // 1. ¡Importamos 'useState' desde React!
import { Container, Row, Col } from 'react-bootstrap';
import ProductFilterBar from '../../components/ui/ProductFilterBar';
import { obtenerNombreCategoria } from '../../utils/formatters';
import ProductCard from '../../components/ui/ProductCard';
import dbData from '../../../db.json';
import type { Product } from '../../types/Product';

// --- Cargamos los datos ---
const allProducts = dbData.productos as Product[];

// Creamos la lista de categorías para los botones
// 1. Obtenemos todas las categorías (ej: ["tortas-cuadradas", "tortas-circulares", ...])
const allCategories = allProducts.map(p => p.categoria);
// 2. Filtramos para que solo queden valores únicos
const uniqueCategories = [...new Set(allCategories)];
// 3. Añadimos "todas" al inicio
const filterCategories = ["todas", ...uniqueCategories];


function CatalogoPage() {

  // 2. ¡AQUÍ ESTÁ EL ESTADO (STATE)!
  // 'useState' nos da dos cosas:
  // 1. 'activeCategory': La variable que GUARDA el estado (la memoria).
  // 2. 'setActiveCategory': La función que USAMOS para CAMBIAR el estado.
  // Le decimos que el valor inicial sea "todas".

  const [activeCategory, setActiveCategory] = useState("todas");

  // 3. Lógica de Filtrado
  // Filtramos la lista de productos ANTES de renderizar.
  // Esta variable se recalcula CADA VEZ que el estado cambia.
  const filteredProducts = allProducts.filter(product => {
    // Si la categoría activa es "todas", devolvemos 'true' (mostramos todo)
    if (activeCategory === "todas") {
      return true; 
    }
    // Si no, solo devolvemos 'true' si la categoría del producto coincide
    return product.categoria === activeCategory;
  });

  return (
    <Container className="py-5">
      <section className="text-center mb-5">
        <h1 className="pacifico-regular">Nuestro Catálogo</h1>
      </section>

      {/* 4. EL COMPONENTE DE FILTROS (EL "HIJO")
       * Le pasamos:
       * - La lista de botones a crear (categories)
       * - Cuál es el botón activo (activeCategory)
       * - La función para cambiar el estado (onFilterChange)
      */}
      <ProductFilterBar 
        categories={filterCategories}
        activeCategory={activeCategory}
        onFilterChange={setActiveCategory} // ¡Pasamos la función del 'useState' directo!
      />

      {/* 5. EL GRID DE PRODUCTOS (EL RESULTADO) */}
      <section>
        <h2 className="mb-4">
          {/* Usamos tu 'helper' para el título */}
          {obtenerNombreCategoria(activeCategory)}
        </h2>

        <Row>
          {/* Hacemos .map() sobre la lista YA FILTRADA */}
          {filteredProducts.map(product => (
            <Col key={product.id} xs={12} md={6} lg={3} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>

        {/* (Opcional) Mensaje si no hay productos */}
        {filteredProducts.length === 0 && (
          <Col className="text-center">
            <p>No se encontraron productos en esta categoría.</p>
          </Col>
        )}
      </section>
    </Container>
  );
}

export default CatalogoPage;