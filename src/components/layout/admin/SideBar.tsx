import { Link, useLocation } from 'react-router-dom';

// Definimos los links del menú aquí para no repetir código
const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: 'fa-solid fa-house' },
  { to: '/admin/pedidos', label: 'Pedidos', icon: 'fa-solid fa-clipboard-list' },
  { to: '/admin/productos', label: 'Productos', icon: 'fa-solid fa-box-open' },
  { to: '/admin/clientes', label: 'Clientes', icon: 'fa-solid fa-users' },
];

const Sidebar = () => {
  const location = useLocation(); // Para saber en qué página estamos

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 shadow-lg z-50 flex flex-col bg-dark text-white">
    
      {/* Logo del Admin */}
      <div className="border-b border-primary/20 flex justify-center items-center">
        <img 
          src="/img/logoAdminSinFondo.jpg" 
          alt="Logo" 
          className="w-30 h-40" 
        />
        
        {/* <span className="font-secundaria text-2xl text-primary">Mil Sabores</span> Antes text-xl */}
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 py-6">
        <ul>
          {adminLinks.map((link) => {
            // Verificamos si el link es el activo
            const isActive = location.pathname === link.to;
            
            return (
              <li key={link.to}>
                <Link 
                  to={link.to}
                  className={`flex items-center gap-3 px-6 py-3 text-gray-300 transition-colors hover:bg-dark/50 hover:text-primary ${
                    isActive ? 'bg-primary/10 text-primary border-r-4 border-primary' : ''
                  }`}
                >
                  <i className={`${link.icon} w-5 text-center`}></i>
                  <span className="font-principal font-medium">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer del Sidebar (Cerrar Sesión) */}
      <div className="p-4 border-t border-primary/20"> {/* Usamos el borde primario */}
        <Link 
          to="/login" 
          className="flex items-center gap-3 px-4 py-2 text-red-500 hover:text-primary/90 rounded-lg transition-colors"

        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span className="font-principal">Cerrar Sesión</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;