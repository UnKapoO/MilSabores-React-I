import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from '../../components/ui/common/Button';
import { InputField } from '../../components/ui/common/InputField';
import { Modal } from '../../components/ui/common/Modal';
import { formatearPrecio, formatearFecha } from '../../utils/formatters';
import { API_BASE_URL } from '../../config/api';

// Definimos la forma de un Pedido
interface Order {
    id: string | number;
    fecha?: string;
    fechaCreacion?: string;
    total: number;
    estado: string;
    items: { nombre: string; cantidad: number; precio: number }[];
}

function UserProfilePage() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    // 2. Usamos el hook para los toasts
    const { addToast } = useCart();
    // Estados para Historial
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Estados para Edición de Perfil 
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editFormData, setEditFormData] = useState({
        nombre: '',
        telefono: ''
    });

    // 1. Protección
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // 2. Cargar historial
    useEffect(() => {
        if (!user || !user.email) return;

        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/pedidos?userId=${user.email}`);
                if (!response.ok) throw new Error("Error al cargar historial");
                const data = await response.json();

                const sortedData = data.sort((a: any, b: any) => {
                    const dateA = new Date(a.fechaCreacion || a.fecha).getTime();
                    const dateB = new Date(b.fechaCreacion || b.fecha).getTime();
                    return dateB - dateA;
                });
                setOrders(sortedData);
            } catch (error) {
                console.error("Error cargando pedidos:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    //Funciones para Editar Perfil

    const openEditModal = () => {
        if (user) {
            setEditFormData({
                nombre: user.nombre || '',
                telefono: (user as any).telefono || ''
            });
            setIsEditModalOpen(true);
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'telefono') {
            // Solo permite números y limita a 9 caracteres
            const soloNumeros = value.replace(/\D/g, '').slice(0, 9);
            setEditFormData(prev => ({ ...prev, [name]: soloNumeros }));
        } else {
            // Para nombre, comportamiento normal
            setEditFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    const handleUpdateProfile = async () => {
        if (!user) return;
        setIsUpdating(true);
        if (!editFormData.nombre.trim() || editFormData.telefono.length < 8) {
            addToast("Por favor completa el nombre y un teléfono válido.", "error");
            return;
        }
        try {
            // Enviamos PATCH para actualizar solo los campos cambiados
            const response = await fetch(`${API_BASE_URL}/usuarios/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editFormData)
            });

            if (response.ok) {
                addToast("¡Perfil actualizado con éxito!", "success");
                setIsEditModalOpen(false);
                // Recargamos para ver los cambios reflejados (especialmente en el header/nombre)
                window.location.reload();
            } else {
                throw new Error("Error al actualizar");
            }
        } catch (error) {
            console.error(error);
            addToast("No se pudo actualizar el perfil.", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="container mx-auto py-12 px-4 bg-fondo-crema min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* BARRA LATERAL */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center sticky top-32">
                        <div className="w-24 h-24 bg-primary text-white text-4xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                            {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <h2 className="text-xl font-bold text-dark">{user.nombre}</h2>
                        <p className="text-letra-cafe text-sm mb-6">{user.email}</p>

                        <div className="space-y-3">
                            <Button variant="outline" onClick={openEditModal} className="w-full">
                                <i className="fa-solid fa-pen-to-square mr-2"></i>
                                Editar Mis Datos
                            </Button>

                            {user.rol === 'admin' && (
                                <Button variant="secondary" onClick={() => navigate('/admin')} className="w-full">
                                    <i className="fa-solid fa-chart-line mr-2"></i>
                                    Panel Admin
                                </Button>
                            )}

                            <Button variant="outline" onClick={handleLogout} className="w-full border-red-500 text-red-500 hover:bg-red-50">
                                <i className="fa-solid fa-right-from-bracket mr-2"></i>
                                Cerrar Sesión
                            </Button>
                        </div>
                    </div>
                </div>

                {/* CONTENIDO PRINCIPAL */}
                <div className="lg:col-span-3">
                    <h2 className="text-3xl font-secundaria text-dark mb-6">Mis Pedidos</h2>

                    {isLoading ? (
                        <div className="text-center py-10">
                            <i className="fa-solid fa-spinner fa-spin text-2xl text-primary"></i>
                            <p className="mt-2">Cargando historial...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white p-8 rounded-lg text-center border border-gray-200 shadow-sm">
                            <i className="fa-solid fa-box-open text-4xl text-gray-300 mb-4"></i>
                            <p className="text-lg text-letra-cafe mb-4">Aún no tienes pedidos registrados.</p>
                            <Button variant="primary" onClick={() => navigate('/catalogo')}>
                                Ir a comprar algo delicioso
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4 border-b border-gray-100 pb-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-primary text-lg">Pedido #{order.id}</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border
                                                    ${order.estado === 'entregado' ? 'bg-green-100 text-green-700 border-green-200' :
                                                        order.estado === 'cancelado' ? 'bg-red-100 text-red-700 border-red-200' :
                                                            'bg-amber-100 text-amber-700 border-amber-200'}
                                                `}>
                                                    {order.estado}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                <i className="fa-regular fa-calendar mr-2"></i>
                                                {formatearFecha(order.fechaCreacion || order.fecha || '')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase">Total</p>
                                            <p className="text-xl font-bold text-dark">
                                                {formatearPrecio(order.total)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-md p-3">
                                        <ul className="text-sm text-letra-cafe space-y-2">
                                            {order.items.map((item, i) => (
                                                <li key={i} className="flex justify-between items-center">
                                                    <span>
                                                        <span className="font-bold">{item.cantidad}x</span> {item.nombre}
                                                    </span>
                                                    <span className="text-gray-500">{formatearPrecio(item.precio * item.cantidad)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* --- NUEVO: Modal de Edición --- */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Editar Mis Datos"
            >
                <div className="space-y-4">
                    <InputField
                        label="Nombre Completo"
                        name="nombre"
                        type="text"
                        value={editFormData.nombre}
                        onChange={handleInputChange}
                    />

                    <InputField
                        label="Teléfono"
                        name="telefono"
                        type="tel"
                        placeholder="+56 9..."
                        value={editFormData.telefono}
                        onChange={handleInputChange} 
                        maxLength={9} 
                    />

                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleUpdateProfile} disabled={isUpdating}>
                            {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default UserProfilePage;