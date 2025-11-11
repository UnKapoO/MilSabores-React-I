import { Container, Form, Button } from 'react-bootstrap'; // Importamos Form y Button para el Newsletter
import { Link } from 'react-router-dom';
import ContactItem from './ContactItem';
import FooterLinkList from './FooterLinkList';

// Definimos los DATOS aquí, en el componente padre.
// TypeScript usará las 'interfaces' que definimos en FooterLinkList
// para asegurarse de que estos datos tengan la forma correcta.
const enlacesRapidos = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/catalogo?categoria=especiales', label: 'Tortas Especiales' },
  { to: '/blog', label: 'Blog y Noticias' },
  { to: '/carrito', label: 'Mi Carrito' },
];

const nuestrosProductos = [
  { to: '/catalogo?categoria=tortas-cuadradas', label: 'Tortas Cuadradas' },
  { to: '/catalogo?categoria=tortas-circulares', label: 'Tortas Circulares' },
  { to: '/catalogo?categoria=postres-individuales', label: 'Postres Individuales' },
  { to: '/catalogo?categoria=sin-azucar', label: 'Sin Azúcar' },
  { to: '/catalogo?categoria=vegana', label: 'Productos Veganos' },
];

function Footer() {
  return (
    <footer className="footer-principal">
      <Container>
        <div className="footer-content">

          <div className="footer-section">
            <div className="footer-logo">
              <img src="/img/logo.jpg" alt="Mil Sabores Logo" />
              <span className="pacifico-regular">Mil Sabores</span>
            </div>
            <p className="footer-descripcion">
              Desde 1975 creando momentos dulces y memorables. Tradición familiar en cada bocado.
            </p>
            <div className="footer-redes">
              {/*<a> para links externos */}
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="red-social" aria-label="Facebook">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="red-social" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer" className="red-social" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="red-social" aria-label="TikTok">
                <i className="fa-brands fa-tiktok"></i>
              </a>
            </div>
          </div>

          {/* ---  Enlaces (Componente Reutilizado) --- */}
          <FooterLinkList 
            title="Enlaces Rápidos" 
            links={enlacesRapidos} 
          />

          {/* Reutilizamos el componente con datos differentes */}
          <FooterLinkList
            title="Nuestros Productos"
            links={nuestrosProductos}
          />

          {/* --- Contacto (Componentes Reutilizados) --- */}
          <div className="footer-section">
            <h4>Contáctanos</h4>
            <div className="footer-contacto">
    
              <ContactItem icon="fa-solid fa-location-dot" text="Av. Principal 123, Concepción, Chile" />
              <ContactItem icon="fa-solid fa-phone" text="+56 9 99999999" />
              <ContactItem icon="fa-solid fa-envelope" text="contacto@milsabores.cl" />
              <ContactItem icon="fa-solid fa-clock" text="Lun-Dom: 8:00 AM - 9:00 PM" />
            </div>
          </div>
        </div>

        <div className="footer-newsletter">
          <div className="newsletter-content">
            <h4>¡Suscríbete a nuestro Newsletter!</h4>
            <p>Recibe ofertas y novedades antes que nadie.</p>
          </div>
          <Form className="newsletter-form-footer">
            <Form.Control 
              type="email" 
              placeholder="Ingresa tu correo" 
            />
            <Button type="submit">
              Suscribirme <i className="fa-solid fa-paper-plane"></i>
            </Button>
          </Form>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2025 Pastelería Mil Sabores. Todos los derechos reservados.</p>
            <p>Hecho con <i className="fa-solid fa-heart"></i> en Concepción, Chile</p>
          </div>
          <div className="footer-legal">
            {/* Usamos <Link> para links INTERNOS */}
            <Link to="/terminos" className="link-legal">Términos y Condiciones</Link>
            <Link to="/privacidad" className="link-legal">Política de Privacidad</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;