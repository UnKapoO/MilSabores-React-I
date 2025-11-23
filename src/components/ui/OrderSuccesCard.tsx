import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './common/Button';
// Importamos nuestra función robusta
import { formatearPrecio, formatearFecha } from '../../utils/formatters';

interface OrderSuccessCardProps {
    orden: {
        cliente: {
            nombre: string;
            email: string;
            direccion: string;
            comuna: string;
            fechaEntrega: string;
        };
        items: any[];
        total: number;
        fechaCreacion: string;
    };
}

export const OrderSuccessCard: React.FC<OrderSuccessCardProps> = ({ orden }) => {
    // Generamos un número de pedido falso basado en la fecha
    const numeroPedido = `MS-${Date.now().toString().slice(-6)}`;

    return (
        <div className="max-w-3xl mx-auto">

            {/* 1. Encabezado de Éxito */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 shadow-sm">
                    <i className="fa-solid fa-check text-5xl text-green-600"></i>
                </div>
                <h1 className="font-secundaria text-5xl text-dark mb-4">¡Compra Aprobada!</h1>
                <p className="text-xl text-letra-cafe">
                    Gracias {orden.cliente.nombre}, tu pedido ha sido procesado exitosamente.
                </p>
            </div>

            {/* 2. Tarjeta de Detalles */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <span className="text-sm text-letra-gris block">Número de Pedido:</span>
                        <span className="font-bold text-dark text-lg">{numeroPedido}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-sm text-letra-gris block">Fecha del pedido:</span>
                        <span className="font-bold text-dark">
                            {/* --- 1. CORREGIDO: Usamos formatearFecha --- */}
                            {formatearFecha(orden.fechaCreacion)}
                        </span>
                    </div>
                </div>

                {/* Lista de Productos */}
                <div className="p-8 border-b border-gray-200">
                    <h3 className="font-bold text-lg text-dark mb-4">
                        <i className="fa-solid fa-basket-shopping text-primary mr-2"></i>
                        Productos Comprados
                    </h3>
                    <div className="space-y-4">
                        {orden.items.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <img src={`/${item.imagen}`} alt={item.nombre} className="w-16 h-16 object-cover rounded-md border border-gray-200" />
                                    <div>
                                        <p className="font-bold text-dark">
                                            {item.nombre} <span className="text-sm font-normal text-letra-gris">x{item.cantidad}</span>
                                        </p>
                                        {(item.cantidadPersonas || item.mensajeEspecial || item.colorGlaseado) && (
                                            <div className="text-xs text-letra-cafe mt-1 space-y-0.5">
                                                {item.cantidadPersonas && <p>Tamaño: {item.cantidadPersonas}</p>}
                                                {item.colorGlaseado && <p>Glaseado: <span className="capitalize">{item.colorGlaseado}</span></p>}
                                                {item.mensajeEspecial && <p>Mensaje: "{item.mensajeEspecial}"</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="font-medium text-dark">
                                    {formatearPrecio(item.precio * item.cantidad)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Columna Info Entrega */}
                    <div>
                        <h3 className="font-bold text-lg text-dark mb-4 border-b pb-2">
                            <i className="fa-solid fa-truck text-primary mr-2"></i>
                            Información de Entrega
                        </h3>
                        <ul className="space-y-3 text-letra-cafe">
                            <li>
                                <span className="font-bold block text-xs text-letra-gris uppercase">Dirección:</span>
                                {orden.cliente.direccion}
                            </li>
                            <li>
                                <span className="font-bold block text-xs text-letra-gris uppercase">Comuna:</span>
                                <span className="capitalize">{orden.cliente.comuna}</span>
                            </li>
                            <li>
                                <span className="font-bold block text-xs text-letra-gris uppercase">Fecha Estimada:</span>
                                {/* --- 2. CORREGIDO: Usamos formatearFecha aquí también --- */}
                                {formatearFecha(orden.cliente.fechaEntrega)}
                            </li>
                        </ul>
                    </div>

                    {/* Columna Info Pago y Total */}
                    <div>
                        <h3 className="font-bold text-lg text-dark mb-4 border-b pb-2">
                            <i className="fa-solid fa-credit-card text-primary mr-2"></i>
                            Resumen de Pago
                        </h3>
                        <div className="space-y-3 text-letra-cafe">
                            <div>
                                <span className="font-bold block text-xs text-letra-gris uppercase">Método:</span>
                                Webpay / Tarjeta
                            </div>
                            <div>
                                <span className="font-bold block text-xs text-letra-gris uppercase">Total Pagado:</span>
                                <span className="text-2xl font-bold text-primary">
                                    {formatearPrecio(orden.total)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 bg-blue-50 p-3 rounded-md flex gap-3 items-start text-sm text-blue-800">
                            <i className="fa-solid fa-envelope mt-1"></i>
                            <div>
                                <p className="font-bold">Boleta enviada</p>
                                <p>Hemos enviado el comprobante a: <strong>{orden.cliente.email}</strong></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Botones */}
                <div className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-center gap-4 border-t border-gray-200">
                    <Button variant="outline" onClick={() => alert("Descargando PDF...")}>
                        <i className="fa-solid fa-file-pdf mr-2"></i>
                        Descargar Boleta
                    </Button>

                    <Link to="/catalogo">
                        <Button variant="primary">
                            <i className="fa-solid fa-shopping-cart mr-2"></i>
                            Seguir Comprando
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="text-center mt-8">
                <Link to="/" className="text-primary font-bold hover:underline">
                    <i className="fa-solid fa-home mr-1"></i>
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
};