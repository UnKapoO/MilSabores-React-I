import React from 'react';
import Sidebar from '../admin/SideBar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Renderizamos la Sidebar fija */}
      <Sidebar />

      {/* 2. El contenido principal */}
      {/* 'ml-64' deja el margen izquierdo del tamaño de la sidebar para que no se solapen */}
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;