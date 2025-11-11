
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/Product';
import ProductCard from '../../components/ui/ProductCard';
import dbData from '../../../db.json';
import styles from './HomePage.module.css'; // (Ya lo tienes)
const allProducts = dbData.productos as Product[];
const featuredProducts = allProducts.slice(0, 4);

function HomePage() {
  return (
    <>
      <section className={styles.heroBanner}>
        <Container className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Mil Sabores</h1>
          <p className={styles.heroSubtitle}>Sabores únicos, momentos inolvidables.</p>
          <Button
            as={Link}
            to="/catalogo"
            size="lg"
            className={styles.heroButton}>

            Ver Catálogo </Button>
        </Container>
      </section>

      {/* --- SECCIÓN 2: PRODUCTOS DESTACADOS (Contenida) --- */}
      {/*Esta sección necesita su PROPIO <Container> 
       * para alinear las tarjetas con el contenido del banner.
       */}
      <Container className="py-5">
        <section>
          <h2 className="mb-4">Productos Destacados</h2>
          <Row>
            {featuredProducts.map(product => (
              <Col key={product.id} xs={12} md={6} lg={3} className="mb-4">
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </section>
      </Container>

    </>
  );
}

export default HomePage;