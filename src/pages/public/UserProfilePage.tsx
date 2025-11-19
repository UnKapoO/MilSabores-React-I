import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/common/Button';
import { formatearPrecio, formatearFecha } from '../../utils/formatters';

// Definimos la forma de un Pedido
interface Order {
    id: string;
    fecha: string;
    total: number;
    estado: string;
    items: { nombre: string; cantidad: number; precio: number }[];
}

function UserProfilePage() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Protección: Si no hay usuario, al login
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // 2. Cargar historial de pedidos
    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                // Buscamos pedidos donde userId coincida con el email del usuario
                // (Ajusta esto si usas IDs numéricos en tu db.json)
                const response = await fetch(`http://localhost:3001/pedidos?userId=${user.email}`);
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error("Error cargando pedidos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="container mx-auto py-12 px-4">

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* --- BARRA LATERAL (Info Usuario) --- */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
                        <div className="w-24 h-24 bg-primary text-white text-4xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                            {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <h2 className="text-xl font-bold text-dark">{user.nombre}</h2>
                        <p className="text-letra-cafe text-sm mb-6">{user.email}</p>

                        <Button variant="outline" onClick={handleLogout} className="w-full border-red-500 text-red-500 hover:bg-red-50">
                            <i className="fa-solid fa-right-from-bracket mr-2"></i>
                            Cerrar Sesión
                        </Button>
                    </div>
                </div>

                {/* --- CONTENIDO PRINCIPAL (Historial) --- */}
                <div className="lg:col-span-3">
                    <h2 className="text-3xl font-secundaria text-dark mb-6">Mis Pedidos</h2>

                    {isLoading ? (
                        <p>Cargando historial...</p>
                    ) : orders.length === 0 ? (
                        <div className="bg-gray-50 p-8 rounded-lg text-center border border-gray-200">
                            <i className="fa-solid fa-box-open text-4xl text-gray-300 mb-4"></i>
                            <p className="text-lg text-letra-cafe">Aún no tienes pedidos.</p>
                            <Button variant="primary" className="mt-4" onClick={() => navigate('/catalogo')}>
                                Ir a comprar
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Lista de Pedidos */}
                            {orders.map(order => (
                                <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-bold text-dark text-lg">Pedido #{order.id}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                                                ${order.estado === 'entregado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                                                >
                                                {order.estado}
                                            </span>
                                        </div>
                                        <p className="text-sm text-letra-gris mb-2">
                                            <i className="fa-solid fa-calendar mr-2"></i>
                                            {formatearFecha(order.fecha)}
                                        </p>
                                        <ul className="text-sm text-letra-cafe ml-4 list-disc">
                                            {order.items.map((item, i) => (
                                                <li key={i}>
                                                    {item.cantidad} x {item.nombre}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="text-right flex flex-col justify-between">
                                        <p className="text-xl font-bold text-primary">
                                            {formatearPrecio(order.total)}
                                        </p>
                                        {/* Aquí podrías poner un botón "Ver Detalles" si quisieras */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserProfilePage;