import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Header Superior */}
      <div className="bg-acento-rosa shadow-sm">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          {/* Info Contacto */}
          <div className="hidden md:flex items-center gap-2 text-letra-cafe">
            <i className="fa-solid fa-phone"></i>
            <span>Soporte al cliente</span>
            <span className="font-bold">+56 9 99999999</span>
          </div>
          
          {/* Logo Principal */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/img/logo.jpg" alt="logo" className="h-10 w-10 rounded-full" />
            <span className="font-secundaria text-3xl text-letra-cafe">Mil Sabores</span>
          </Link>
          
          {/* Usuario y Carrito */}
          <div className="flex items-center gap-4">
            <Link to="/login" className="flex items-center gap-2 text-letra-cafe hover:text-primary">
              <i className="fa-solid fa-user text-xl"></i>
              <span className="hidden md:inline">Mi Cuenta</span>
            </Link>
            <Link to="/carrito" className="flex items-center gap-2 text-letra-cafe hover:text-primary">
              <i className="fa-solid fa-cart-shopping text-xl"></i>
              <span className="hidden md:inline">Carrito</span>
              <span className="bg-acento-rosa text-letra-cafe text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Header Inferior (Navegación) */}
      <div className="bg-fondo-crema h-12 flex justify-center items-center shadow-md">
        <nav className="flex gap-8 font-bold text-letra-cafe uppercase text-sm">
          <Link to="/" className="hover:text-primary">Inicio</Link>
          <Link to="/catalogo" className="hover:text-primary">Catálogo</Link>
          <Link to="/catalogo?categoria=especiales" className="hover:text-primary">Tortas Especiales</Link>
          <Link to="/blog" className="hover:text-primary">Blog</Link>
        </nav>
        {/* Aquí iría el <div class="busqueda-header"> que también traducirían */}
      </div>
    </header>
  );
}
export default Header;