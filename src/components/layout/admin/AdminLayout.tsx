import React from 'react';
import Sidebar from '../admin/SideBar'; // Asegúrate que la ruta sea correcta

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-fondo-crema">
      <Sidebar />

      {/* 'ml-64' deja el margen izquierdo del tamaño de la sidebar */}
      <main className="ml-64 p-8 transition-all duration-300">
        
        {/* 🚨 CORRECCIÓN: Quitamos 'max-w-6xl mx-auto' y ponemos 'w-full' */}
        <div className="w-full">
          {children}
        </div>

      </main>
    </div>
  );
};

export default AdminLayout;