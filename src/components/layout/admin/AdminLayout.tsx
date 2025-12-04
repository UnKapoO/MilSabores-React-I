// src/components/layout/admin/AdminLayout.tsx
import React, { useState } from 'react';
import Sidebar from './SideBar';
import MenuToggle from '../../ui/admin/MenuToggle';

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
    <div className="min-h-screen bg-fondo-crema relative">
      
      {/* 1. Botón de Hamburguesa (Solo visible en móvil) */}
      <MenuToggle isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      {/* 2. Sidebar (Pasa el estado y la función de cerrar) */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* 3. Overlay Oscuro (Solo en móvil) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={closeSidebar} 
        />
      )}

      {/* 4. Contenido Principal */}

      <main className="lg:ml-64 p-8 transition-all duration-300">
        
        {/* Contenedor interno para limitar el ancho máximo si la pantalla es gigante (opcional) 
            o usar w-full para llenar el espacio disponible dentro del main.
        */}
        <div className="w-full max-w-[1920px] mx-auto">
          {children}
        </div>

      </main>
    </div>
  );
};

export default AdminLayout;