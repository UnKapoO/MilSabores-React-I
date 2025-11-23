import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Definimos los links del menú aquí para no repetir código
const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: 'fa-solid fa-house' },
  { to: '/admin/pedidos', label: 'Pedidos', icon: 'fa-solid fa-clipboard-list' },
  { to: '/admin/productos', label: 'Productos', icon: 'fa-solid fa-box-open' },
  // { to: '/admin/clientes', label: 'Clientes', icon: 'fa-solid fa-users' },
];

interface SidebarProps {
  isOpen: boolean; 
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <aside 
      className={`w-64 h-screen fixed left-0 top-0 shadow-lg z-50 flex flex-col bg-letra-cafe text-white 
                  transition-transform duration-300 
                  ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                  lg:translate-x-0 lg:flex`} 
    >
      
      {/* 1. LOGO CENTRADO */}
      <div className="p-6 border-b border-primary/20 flex justify-center items-center flex-shrink-0">
        <img 
          src="/img/logoAdminSinFondo.jpg" 
          alt="Logo Mil Sabores"
          className="w-32 h-32 object-contain" 
        />
      </div>

      {/* 2. MENÚ DE NAVEGACIÓN */}
      <nav className="flex-1 py-6 w-full overflow-y-auto">
        <ul onClick={onClose}> 
          {adminLinks.map((link) => {
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

      {/* 3. FOOTER (CERRAR SESIÓN) */}
      <div className="p-4 border-t border-primary/20 w-full mt-auto flex-shrink-0">
        <Link 
          to="/login" 
          onClick={onClose} 
          className="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-white/5 hover:text-red-400 rounded-lg transition-colors"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span className="font-principal">Cerrar Sesión</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;