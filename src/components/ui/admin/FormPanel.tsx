import React from 'react';

interface FormPanelProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Componente contenedor para agrupar campos de formulario
 * con un título y un estilo de tarjeta de administración (panel).
 */
const FormPanel: React.FC<FormPanelProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Encabezado del Panel (fondo gris claro para destacar) */}
      <div className="p-4 border-b border-primary/20 bg-gray-50 rounded-t-xl">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default FormPanel;