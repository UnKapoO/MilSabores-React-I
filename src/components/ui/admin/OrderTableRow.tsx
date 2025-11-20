// src/components/ui/admin/OrderTableRow.tsx
import React from 'react';
import type { Order } from '../../../types/Order';
import { formatearPrecio } from '../../../utils/formatters';
import { Button } from '../common/Button';

interface OrderTableRowProps {
  order: Order;
  onViewDetails: (id: number | string) => void;

  // 🚨 CORRECCIÓN: Añadimos la definición de esta prop
  // La hacemos opcional (?) por si acaso no la pasas siempre
  onUpdateStatus?: (id: number | string, newStatus: Order['estado']) => void;
}

// ... (La función renderStatusBadge se queda IGUAL) ...
const renderStatusBadge = (status: Order['estado']) => {
  const styles = {
    'pendiente': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    'en-preparacion': 'bg-blue-100 text-blue-800 border border-blue-200',
    'entregado': 'bg-green-100 text-green-800 border border-green-200',
    'cancelado': 'bg-red-100 text-red-800 border-red-200',
  };
  const labels = {
    'pendiente': 'Pendiente',
    'en-preparacion': 'En Preparación',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado',
  };
  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {labels[status] || status}
    </span>
  );
};

const OrderTableRow: React.FC<OrderTableRowProps> = ({ order, onViewDetails, onUpdateStatus }) => {
  return (
    <tr className="hover:bg-rose-50 transition-colors">

      {/* Columna 1: ID */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">
        #{order.id}
      </td>

      {/* Columna 2: Cliente */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
        {order.cliente}
      </td>

      {/* Columna 3: Fecha */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {order.fecha}
      </td>

      {/* Columna 4: Items */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
        {order.itemsCount}
      </td>

      {/* Columna 5: Total */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
        {formatearPrecio(order.total)}
      </td>

      {/* Columna 6: Estado */}
      <td className="px-6 py-4 whitespace-nowrap">
        {renderStatusBadge(order.estado)}
      </td>
      {/* Columna 7: Acciones */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {/* Usamos justify-end para alinear a la derecha */}
        <div className="flex justify-end items-center">
          {/* SOLO DEJAMOS ESTE BOTÓN */}
          <Button
            onClick={() => onViewDetails(order.id)}
            variant="outline"
            className="text-primary border-primary/50 hover:bg-primary hover:text-white"
            title="Ver detalles del pedido"
          >
            <i className="fa-solid fa-eye"></i>
          </Button>

          {/* ELIMINAMOS CUALQUIER OTRO BOTÓN AQUÍ (Como el de Editar o Eliminar) */}
        </div>
      </td>
    </tr>
  );
};

export default OrderTableRow;