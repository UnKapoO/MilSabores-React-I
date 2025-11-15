import { Link } from 'react-router-dom';

// ¡Ya no necesitamos 'react-bootstrap'!
// Ya no necesitamos 'ContactItem' ni 'FooterLinkList' (por ahora), 
// lo integramos aquí para que sea más simple.

function Footer() {
  return (
    // Usamos 'bg-dark' (de tu config) y 'font-principal'
    <footer className="bg-dark text-white p-10 font-principal">
      <div className="container mx-auto px-4">
        
        {/* Grid de 4 columnas para las secciones */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* 1. Sección Logo y Redes */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/img/logo.jpg" alt="Mil Sabores Logo" className="h-10 w-10 rounded-full" />
              {/* Usamos 'font-secundaria' (Pacifico) de tu config */}
              <span className="font-secundaria text-2xl">Mil Sabores</span>
            </div>
            <p className="text-sm text-letra-gris mb-4">
              Desde 1975 creando momentos dulces y memorables.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-primary">
                <i className="fa-brands fa-facebook fa-xl"></i>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-primary">
                <i className="fa-brands fa-instagram fa-xl"></i>
              </a>
              <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-primary">
                <i className="fa-brands fa-whatsapp fa-xl"></i>
              </a>
            </div>
          </div>

          {/* 2. Sección Enlaces Rápidos */}
          <div>
            <h4 className="font-bold text-lg mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-letra-gris hover:text-primary">Inicio</Link></li>
              <li><Link to="/catalogo" className="text-letra-gris hover:text-primary">Catálogo</Link></li>
              <li><Link to="/blog" className="text-letra-gris hover:text-primary">Blog</Link></li>
              <li><Link to="/carrito" className="text-letra-gris hover:text-primary">Mi Carrito</Link></li>
            </ul>
          </div>

          {/* 3. Sección Nuestros Productos */}
          <div>
            <h4 className="font-bold text-lg mb-4">Nuestros Productos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalogo?categoria=tortas-cuadradas" className="text-letra-gris hover:text-primary">Tortas Cuadradas</Link></li>
              <li><Link to="/catalogo?categoria=postres-individuales" className="text-letra-gris hover:text-primary">Postres Individuales</Link></li>
              <li><Link to="/catalogo?categoria=sin-azucar" className="text-letra-gris hover:text-primary">Sin Azúcar</Link></li>
              <li><Link to="/catalogo?categoria=vegana" className="text-letra-gris hover:text-primary">Productos Veganos</Link></li>
            </ul>
          </div>

          {/* 4. Sección Contacto */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contáctanos</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3 items-center text-letra-gris">
                <i className="fa-solid fa-location-dot"></i>
                <span>Av. Principal 123, Concepción</span>
              </li>
              <li className="flex gap-3 items-center text-letra-gris">
                <i className="fa-solid fa-phone"></i>
                <span>+56 9 99999999</span>
              </li>
              <li className="flex gap-3 items-center text-letra-gris">
                <i className="fa-solid fa-envelope"></i>
                <span>contacto@milsabores.cl</span>
              </li>
            </ul>
          </div>

        </div>

        {/* --- Newsletter (traducido de <Form> y <Button>) --- */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h4 className="font-bold text-lg">¡Suscríbete a nuestro Newsletter!</h4>
            <p className="text-letra-gris text-sm">Recibe ofertas y novedades.</p>
          </div>
          <form className="flex mt-4 md:mt-0 w-full md:w-auto">
            <input 
              type="email" 
              placeholder="Ingresa tu correo" 
              className="bg-gray-700 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary w-full" 
            />
            {/* Usamos 'bg-primary' de tu config */}
            <button 
              type="submit" 
              className="bg-primary text-white font-bold py-2 px-4 rounded-r-md hover:opacity-80 transition-opacity"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>

        {/* --- Copyright (traducido) --- */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm text-letra-gris">
          <p>&copy; 2025 Pastelería Mil Sabores. Todos los derechos reservados.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/terminos" className="hover:text-primary">Términos y Condiciones</Link>
            <Link to="/privacidad" className="hover:text-primary">Política de Privacidad</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;