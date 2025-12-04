import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import AdminPageHeader from '../../components/ui/admin/AdminPageHeader';
import AdminTable from '../../components/ui/admin/AdminTable';
import { InputField } from '../../components/ui/common/InputField';
import { Button } from '../../components/ui/common/Button';
import { Modal } from '../../components/ui/common/Modal';
import { formatearFecha, formatearPrecio } from '../../utils/formatters';
import type { User } from '../../types/User';
import type { Order } from '../../types/Order';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api'; 

const AdminGestionClientesPage = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Estados para el Modal de Historial
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userOrders, setUserOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // --- 1. Cargar Usuarios ---
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/usuarios`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error cargando usuarios:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- 2. Acciones CRUD ---

    // ELIMINAR USUARIO
    // 1. Al hacer clic en el botón de basura: Solo abre el modal
    const openDeleteModal = (user: User) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    // 2. Al hacer clic en "Sí, eliminar" dentro del modal: Ejecuta la lógica
    const confirmDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await fetch(`${API_BASE_URL}/usuarios/${userToDelete.id}`, { method: 'DELETE' });
            // Actualizamos la lista localmente
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id));

            // Cerramos el modal y limpiamos
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("Error al eliminar usuario."); // Fallback por si falla la red
        }
    };

    // CAMBIAR ROL (Ascender/Degradar)
    const handleToggleRole = async (userToEdit: User) => {
        const newRole = userToEdit.rol === 'admin' ? 'cliente' : 'admin';
        if (!window.confirm(`¿Cambiar rol de ${userToEdit.nombre} a ${newRole.toUpperCase()}?`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/usuarios/${userToEdit.id}`, {
                method: 'PATCH', // Solo actualizamos un campo
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rol: newRole })
            });

            if (response.ok) {
                // Actualizamos la lista localmente
                setUsers(prev => prev.map(u => u.id === userToEdit.id ? { ...u, rol: newRole } : u));
            }
        } catch (error) {
            alert("Error al actualizar rol.");
        }
    };

    // VER HISTORIAL (Cargar pedidos)
    const handleViewHistory = async (userToView: User) => {
        setSelectedUser(userToView);
        setIsHistoryOpen(true);
        setLoadingOrders(true);
        setUserOrders([]);

        try {
            // Buscamos pedidos por el email del usuario
            const response = await fetch(`${API_BASE_URL}/pedidos?userId=${userToView.email}`);
            const data = await response.json();
            setUserOrders(data);
        } catch (error) {
            console.error("Error cargando historial:", error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const closeHistoryModal = () => {
        setIsHistoryOpen(false);
        setSelectedUser(null);
    };


    // --- 3. Filtrado ---
    const filteredUsers = users.filter(user =>
        user.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (rol: string) => {
        if (rol === 'admin') return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded-full border border-purple-200">Admin</span>;
        return <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-full border border-blue-100">Cliente</span>;
    };

    if (isLoading) return <AdminLayout><div className="p-20 text-center">Cargando...</div></AdminLayout>;

    return (
        <AdminLayout>
            <AdminPageHeader title="Gestión de Clientes" subtitle={`Usuarios registrados: ${users.length}`} />

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
                <InputField label="" name="search" type="text" placeholder="Buscar cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="mb-0" />
            </div>

            <AdminTable headers={['ID', 'Usuario', 'Email', 'Rol', 'Fecha Reg.', 'Acciones']}>
                {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-500">#{user.id}</td>
                        <td className="px-6 py-4"><div className="font-bold text-gray-900">{user.nombre || 'N/A'}</div></td>
                        <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>

                        {/* Columna Rol (Clickeable para cambiar) */}
                        <td className="px-6 py-4 cursor-pointer" onClick={() => handleToggleRole(user)} title="Click para cambiar rol">
                            {getRoleBadge(user.rol)}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                            {(user as any).fechaRegistro ? formatearFecha((user as any).fechaRegistro) : '-'}
                        </td>

                        <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                                {/* Botón Historial */}
                                <Button variant="outline" className="px-2 py-1 h-8 text-xs" onClick={() => handleViewHistory(user)} title="Ver Historial de Pedidos">
                                    <i className="fa-solid fa-receipt"></i>
                                </Button>

                                {/* Botón Eliminar (Solo si no soy yo mismo) */}
                                {currentUser?.email !== user.email && (
                                    <button
                                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                                        onClick={() => openDeleteModal(user)}
                                        title="Eliminar usuario"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </AdminTable>

            {/* --- MODAL DE HISTORIAL --- */}
            <Modal
                isOpen={isHistoryOpen}
                onClose={closeHistoryModal}
                title={`Historial de: ${selectedUser?.nombre}`}
                size="lg"
            >
                {loadingOrders ? (
                    <p className="text-center py-4">Cargando pedidos...</p>
                ) : userOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <i className="fa-solid fa-box-open text-4xl mb-2"></i>
                        <p>Este usuario no ha realizado pedidos.</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {userOrders.map(order => (
                            <div key={order.id} className="border rounded-lg p-4 bg-gray-50 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-dark">Pedido #{order.id}</p>
                                    <p className="text-xs text-gray-500">{formatearFecha(order.fecha)}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${order.estado === 'entregado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {order.estado}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-primary">{formatearPrecio(order.total)}</p>
                                    <p className="text-xs text-gray-500">{order.itemsCount || (order.items?.length)} productos</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
            {/* --- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirmar Eliminación"
                size="md"
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <i className="fa-solid fa-triangle-exclamation text-red-600 text-xl"></i>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        ¿Estás seguro de eliminar a este usuario?
                    </h3>

                    <div className="bg-gray-50 p-3 rounded-lg mb-6 border border-gray-200 inline-block min-w-[200px]">
                        <p className="font-bold text-dark">{userToDelete?.nombre}</p>
                        <p className="text-sm text-gray-500">{userToDelete?.email}</p>
                    </div>

                    <p className="text-sm text-gray-500 mb-6">
                        Esta acción eliminará permanentemente el acceso del usuario. Esta acción no se puede deshacer.
                    </p>

                    <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancelar
                        </Button>
                        <button
                            onClick={confirmDeleteUser}
                            className="bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition-colors shadow"
                        >
                            Sí, Eliminar
                        </button>
                    </div>
                </div>
            </Modal>

        </AdminLayout>
    );
};

export default AdminGestionClientesPage;