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
    <aside className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg z-50 flex flex-col">
      
      {/* Logo del Admin */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <img src="/img/logo.jpg" alt="Logo" className="w-10 h-10 rounded-full border-2 border-rose-300" />
        <span className="font-pacifico text-xl text-gray-700">Mil Sabores</span>
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
                  className={`flex items-center gap-3 px-6 py-3 text-gray-600 transition-colors hover:bg-rose-50 hover:text-rose-500 ${
                    isActive ? 'bg-rose-50 text-rose-500 border-r-4 border-rose-500' : ''
                  }`}
                >
                  <i className={`${link.icon} w-5 text-center`}></i>
                  <span className="font-medium">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer del Sidebar (Cerrar Sesión) */}
      <div className="p-4 border-t border-gray-100">
        <Link 
          to="/login" 
          className="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Cerrar Sesión</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;