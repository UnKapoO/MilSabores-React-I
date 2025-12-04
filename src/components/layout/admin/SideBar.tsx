import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: 'fa-solid fa-house' },
  { to: '/admin/pedidos', label: 'Pedidos', icon: 'fa-solid fa-clipboard-list' },
  { to: '/admin/productos', label: 'Productos', icon: 'fa-solid fa-box-open' },
  { to: '/admin/clientes', label: 'Clientes', icon: 'fa-solid fa-users' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate(); // Para redirigir
  const { logout } = useAuth();   // Para borrar la sesión

  const handleLogout = () => {
    logout(); // Limpia el estado y el localStorage
    navigate('/login'); // Redirige al login
    if (onClose) onClose();
  };

  return (
    <aside
      className={`w-64 h-screen fixed left-0 top-0 shadow-lg z-50 flex flex-col bg-letra-cafe text-white 
                  transition-transform duration-300 
                  ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                  lg:translate-x-0 lg:flex`}
    >

      {/* LOGO CENTRADO */}
      <div className="p-6 border-b border-primary/20 flex justify-center items-center flex-shrink-0">
        <img
          src="/img/logoAdminSinFondo.jpg"
          alt="Logo Mil Sabores"
          className="w-32 h-32 object-contain rounded-full bg-fondo-crema p-1"
        />
      </div>

      {/* MENÚ DE NAVEGACIÓN */}
      <nav className="flex-1 py-6 w-full overflow-y-auto">
        <ul className="space-y-1">
          {adminLinks.map((link) => {
            const isActive = location.pathname === link.to;

            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-6 py-3 transition-colors hover:bg-primary/20 hover:text-primary ${isActive ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-gray-300'
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

      {/* FOOTER (TIENDA Y CERRAR SESIÓN) */}
      <div className="p-4 border-t border-primary/20 w-full mt-auto flex-shrink-0 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
        >
          <i className="fa-solid fa-store w-5 text-center"></i>
          <span className="font-principal font-bold">Ir a la Tienda</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-white/5 hover:text-red-300 rounded-lg transition-colors"
        >
          <i className="fa-solid fa-right-from-bracket w-5 text-center"></i>
          <span className="font-principal">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;