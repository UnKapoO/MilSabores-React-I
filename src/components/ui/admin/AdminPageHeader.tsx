import React from 'react';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string; // Opcional para descripciones más largas
  actionButton?: React.ReactNode; // Permite pasar un botón o cualquier elemento React
}

const AdminPageHeader = ({ title, subtitle, actionButton }: AdminPageHeaderProps) => {
  return (
    <header className="mb-8 mt-7 flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {actionButton && (
        <div className="flex-shrink-0"> {/* Para que el botón no se encoja */}
          {actionButton}
        </div>
      )}
    </header>
  );
};

export default AdminPageHeader;