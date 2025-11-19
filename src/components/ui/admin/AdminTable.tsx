import React from 'react';

interface AdminTableProps {
  headers: string[]; // Ej: ["Nombre", "Categoría", "Precio", "Acciones"]
  children: React.ReactNode; // Las filas de la tabla (tbody)
}

const AdminTable: React.FC<AdminTableProps> = ({ headers, children }) => {
  return (
    // Contenedor principal de la tabla 
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        
        {/* Encabezados (<thead>) */}
        <thead className="bg-primary/70"> 
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        
        {/* Cuerpo (<tbody>) */}
        <tbody className="bg-white divide-y divide-gray-200">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;