import React from 'react';
import type { Order } from '../../../types/Order';
import { formatearPrecio } from '../../../utils/formatters';

interface OrderDetailViewProps {
  order: Order;
}

const renderStatusBadge = (status: Order['estado']) => {
    const styles: Record<string, string> = {
        'pendiente': 'bg-amber-100 text-amber-800 border-amber-200',
        'en-preparacion': 'bg-blue-100 text-blue-800 border-blue-200',
        'entregado': 'bg-green-100 text-green-800 border-green-200',
        'cancelado': 'bg-red-100 text-red-800 border-red-200',
    };

    return (
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order }) => {
  return (
    <div className="space-y-6">
      
      {/* 1. CABECERA */}
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
        
        {/* Columna Izquierda: Cliente */}
        <div>
            <h4 className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Cliente</h4>
            <p className="text-lg font-bold text-gray-800 break-all">{order.cliente}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <i className="fa-regular fa-calendar"></i>
                <span>{order.fecha}</span>
            </div>
        </div>

        {/* Columna Derecha: Estado */}
        <div className="text-right flex flex-col items-end justify-center">
            <h4 className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">Estado</h4>
            {renderStatusBadge(order.estado)}
        </div>
      </div>

      {/* 2. LISTA DE PRODUCTOS */}
      <div>
        <h4 className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-3 px-1">
            Productos ({order.itemsCount})
        </h4>
        
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {order.items && order.items.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                    {order.items.map((item, index) => (
                        <li key={index} className="flex items-center gap-4 p-4 bg-white hover:bg-gray-50 transition-colors">
                            
                            {/* IMAGEN */}
                            <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                                {item.imagen ? (
                                    <img 
                                        src={item.imagen.startsWith('/') ? item.imagen : `/${item.imagen}`} 
                                        alt={item.nombre} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <i className="fa-solid fa-image text-xl"></i>
                                    </div>
                                )}
                                <div className="hidden w-full h-full flex items-center justify-center text-gray-300">
                                    <i className="fa-solid fa-image text-xl"></i>
                                </div>
                            </div>

                            {/* INFO */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{item.nombre}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Cantidad: <span className="font-bold text-gray-700">{item.cantidad}</span>
                                </p>
                            </div>

                            {/* PRECIO */}
                            <div className="text-right min-w-[80px]">
                                <p className="text-sm font-bold text-primary">
                                    {formatearPrecio(item.precio * item.cantidad)}
                                </p>
                                {item.cantidad > 1 && (
                                    <p className="text-xs text-gray-400">
                                        {formatearPrecio(item.precio)} c/u
                                    </p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="p-8 text-center text-gray-400 italic bg-gray-50">
                    <i className="fa-solid fa-basket-shopping text-2xl mb-2 opacity-50"></i>
                    <p>No hay detalles de items disponibles para este pedido.</p>
                </div>
            )}
        </div>
      </div>

      {/* 3. TOTALES (Modificado: Ancho Completo) */}
      <div className="border-t border-gray-100 pt-4 mt-4">
        <div className="flex flex-col gap-2">
            
            {/* Subtotal - Eliminado md:w-1/2 para que ocupe todo */}
            <div className="w-full flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatearPrecio(order.total)}</span>
            </div>

            {/* Envío - Eliminado md:w-1/2 */}
            <div className="w-full flex justify-between text-sm text-gray-600">
                <span>Envío</span>
                <span className="text-green-600 font-medium">Gratis</span>
            </div>
            
            {/* Total Final - Eliminado md:w-1/2 */}
            <div className="w-full flex justify-between items-center pt-3 mt-2 border-t border-dashed border-gray-300">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <span className="font-bold text-2xl text-primary">{formatearPrecio(order.total)}</span>
            </div>

        </div>
      </div>

    </div>
  );
};