// src/components/layout/admin/AdminLayout.tsx
import React, { useState } from 'react'; // <-- Añadir useState
import Sidebar from './SideBar';
import MenuToggle from '../../ui/admin/MenuToggle'; // <-- Importar el botón

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // Estado para controlar si el menú está abierto o cerrado
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-fondo-crema">
      
      {/* 1. Botón de Hamburguesa (Solo visible en móvil) */}
      <MenuToggle isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {/* 2. Sidebar (Pasa el estado y la función de cerrar) */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* 3. Overlay Oscuro (Solo en móvil, para bloquear el contenido cuando el menú está abierto) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={closeSidebar} 
        />
      )}

      {/* 4. Contenido Principal */}
      {/* 'lg:ml-64' solo añade el margen en pantallas grandes (Desktop).
          En móvil (default), el margen es 0 para aprovechar todo el ancho. 
      */}
      <main className="lg:ml-64 p-8 transition-all duration-300">
        
         <div className="w-full max-w-[1920px] mx-auto">
          {children}
        </div>

      </main>
    </div>
  );
};

export default AdminLayout;