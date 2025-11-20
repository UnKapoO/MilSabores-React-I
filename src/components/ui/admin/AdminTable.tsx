import React from 'react';

interface AdminTableProps {
  headers: string[]; 
  children: React.ReactNode; 
}

const AdminTable: React.FC<AdminTableProps> = ({ headers, children }) => {
  
  // Detectamos qué tipo de tabla es contando las columnas
  const isProductTable = headers.length === 5; // Productos: 5 columnas
  const isOrderTable = headers.length === 7;   // Pedidos: 7 columnas

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">

        <thead className="bg-primary/60">
          <tr>
            {headers.map((header, index) => {

              let widthClass = 'w-auto'; 

              // 1. CASO: Última Columna (Acciones) - Siempre fija y ajustada
              if (index === headers.length - 1) {
                 widthClass = 'w-28 text-right'; // w-28 es suficiente para 2 botones
              } 
              
              // 2. CASO: Tabla de Productos (5 cols)
              // Prioridad: Imagen+Nombre grande
              else if (isProductTable) {
                if (index === 0) widthClass = 'w-[40%]'; // Producto
                else widthClass = 'w-[15%]';             // Resto
              } 
              
              // 3. CASO: Tabla de Pedidos (7 cols)
              // Prioridad: Cliente grande, ID/Items pequeños
              else if (isOrderTable) {
                if (index === 0) widthClass = 'w-[8%]';       // ID (#123) - Muy pequeño
                else if (index === 1) widthClass = 'w-[22%]'; // Cliente - Grande
                else if (index === 2) widthClass = 'w-[15%]'; // Fecha
                else if (index === 3) widthClass = 'w-[10%]'; // Items - Pequeño
                else if (index === 4) widthClass = 'w-[12%]'; // Total
                else if (index === 5) widthClass = 'w-[15%]'; // Estado
              }

              return (
                <th
                  key={index}
                  className={`px-6 py-4 text-left text-sm font-bold text-dark uppercase tracking-wider ${widthClass}`}
                >
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        
        <tbody className="bg-white divide-y divide-gray-200">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;