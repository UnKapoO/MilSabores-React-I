import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import AdminPageHeader from '../../components/ui/admin/AdminPageHeader';
import AdminTable from '../../components/ui/admin/AdminTable';
import OrderTableRow from '../../components/ui/admin/OrderTableRow';
import KpiCard from '../../components/ui/admin/KpiCard';
import { Button } from '../../components/ui/common/Button';
import { InputField } from '../../components/ui/common/InputField';
import { SelectField, type SelectOption } from '../../components/ui/common/SelectField';
import type { Order } from '../../types/Order';

// 1. AGREGAMOS LOS IMPORTS QUE FALTABAN
import { Modal } from '../../components/ui/common/Modal';
import { OrderDetailView } from '../../components/ui/admin/OrderDetailView';

// const API_URL = 'http://localhost:3001/pedidos';


//Modificaciones para conectar con el backend

import { API_BASE_URL } from '../../config/api';

const API_URL = `${API_BASE_URL}/pedidos`; // le asignas el valor importado de api.ts


const AdminGestionPedidosPage = () => {
    // --- ESTADOS ---
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [activeStatus, setActiveStatus] = useState('todos');
    const [filterDate, setFilterDate] = useState('');

    // Estados para el Modal
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- Lógica de Carga de Datos ---
    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Fallo al cargar pedidos');
            
            const rawData = await response.json();

            const mappedOrders: Order[] = rawData.map((item: any) => ({
                id: item.id,
                cliente: item.userId || item.cliente || 'Anónimo',
                
                // 2. CORRECCIÓN: Guardamos la fecha original para filtrar y formatear después
                originalDate: item.fecha, 
                // Fecha formateada inicial (por si acaso)
                fecha: new Date(item.fecha).toLocaleDateString('es-CL'), 
                
                total: item.total,
                itemsCount: item.items ? item.items.length : 0,
                estado: item.estado === 'procesando' ? 'en-preparacion' : item.estado,
                items: item.items
            }));

            setOrders(mappedOrders);
        } catch (error) {
            console.error("Error al cargar pedidos:", error);
            alert("Error al cargar pedidos. Asegúrate que 'npm run server' esté activo.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // --- Cálculos de KPIs ---
    const totalPendientes = orders.filter(o => o.estado === 'pendiente').length;
    const totalPreparacion = orders.filter(o => o.estado === 'en-preparacion').length;
    const totalEntregados = orders.filter(o => o.estado === 'entregado').length;
    const totalCancelados = orders.filter(o => o.estado === 'cancelado').length;

    // --- Filtros ---
    const statusOptions: SelectOption[] = [
        { value: 'todos', label: '— Mostrar Todos los Estados —' },
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'en-preparacion', label: 'En Preparación' },
        { value: 'entregado', label: 'Entregado' },
        { value: 'cancelado', label: 'Cancelado' },
    ];
    
    const filteredOrders = orders.filter(order => {
        const matchStatus = activeStatus === 'todos' || order.estado === activeStatus;
        
        // Usamos 'originalDate' si existe, si no 'fecha'
        const dateToCompare = (order as any).originalDate || order.fecha;
        // Comparamos el inicio de la cadena (YYYY-MM-DD)
        const matchDate = filterDate === '' || dateToCompare.startsWith(filterDate);

        return matchStatus && matchDate;
    });

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setActiveStatus(e.target.value);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterDate(e.target.value);
    };

    const handleClearFilters = () => {
        setActiveStatus('todos');
        setFilterDate('');
    };

    const hasActiveFilters = activeStatus !== 'todos' || filterDate !== '';


    // --- Acciones ---
    const handleViewDetails = (id: number | string) => {
        const order = orders.find(o => o.id === id);
        if (order) {
            setSelectedOrder(order);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    const handleUpdateStatus = (id: number | string, newStatus: Order['estado']) => {
        alert(`Simular actualización de pedido #${id} a estado: ${newStatus}`);
    };


    // --- Renderizado ---
    
    if (isLoading) {
        return <AdminLayout><div className="p-20 text-center text-primary">Cargando pedidos...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <AdminPageHeader
                title="Gestión de Pedidos"
                subtitle={`Pedidos en el sistema: ${orders.length}`}
            />

            {/* KPIs */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard title="Pendientes" value={totalPendientes} icon="fa-solid fa-clock" colorClass="text-amber-500" />
                <KpiCard title="En Preparación" value={totalPreparacion} icon="fa-solid fa-spinner" colorClass="text-blue-500" />
                <KpiCard title="Completados" value={totalEntregados} icon="fa-solid fa-check-circle" colorClass="text-green-500" />
                <KpiCard title="Cancelados" value={totalCancelados} icon="fa-solid fa-ban" colorClass="text-red-500" />
            </section>

            {/* Filtros */}
            <div className="mb-6 flex flex-col sm:flex-row justify-end gap-4 items-end">
                {hasActiveFilters && (
                    <div className="mb-4">
                        <Button 
                            variant="outline" 
                            onClick={handleClearFilters}
                            className="text-gray-500 border-gray-300 hover:border-red-400 hover:text-red-500 hover:bg-red-50"
                            title="Borrar filtros"
                        >
                            <i className="fa-solid fa-filter-circle-xmark mr-2"></i>
                            Limpiar
                        </Button>
                    </div>
                )}
                <div className="w-full sm:w-48">
                    <InputField label="Filtrar por Fecha" name="dateFilter" type="date" value={filterDate} onChange={handleDateChange} />
                </div>
                <div className="w-full sm:w-64">
                    <SelectField label="Filtrar por Estado" name="statusFilter" value={activeStatus} onChange={handleStatusChange as any} options={statusOptions} />
                </div>
            </div>

            {/* Tabla */}
            {orders.length === 0 ? (
                 <div className="p-10 text-center bg-white rounded-xl shadow-lg mt-8"><p className="text-lg text-gray-500">No hay pedidos registrados.</p></div>
            ) : (
                <AdminTable headers={["ID Pedido", "Cliente", "Fecha", "Items", "Total", "Estado", "Acciones"]}>
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <OrderTableRow
                                key={order.id}
                                // Usamos la fecha original para crear un objeto Date válido
                                order={{
                                    ...order, 
                                    fecha: (order as any).originalDate 
                                        ? new Date((order as any).originalDate).toLocaleDateString('es-CL') 
                                        : order.fecha
                                }}
                                onViewDetails={handleViewDetails}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7} className="px-6 py-10 text-center text-gray-500 bg-white">
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <i className="fa-solid fa-filter text-3xl text-gray-300"></i>
                                    <p>No se encontraron pedidos con los filtros seleccionados.</p>
                                    <Button variant="outline" onClick={handleClearFilters}>Limpiar Filtros</Button>
                                </div>
                            </td>
                        </tr>
                    )}
                </AdminTable>
            )}

            {/* Modal Detalle */}
            <Modal
                isOpen={isModalOpen && !!selectedOrder}
                onClose={handleCloseModal}
                title={`Detalle del Pedido #${selectedOrder?.id}`}
                size="md"
            >
                {selectedOrder && (
                    // 3. USAMOS LA VISTA DE DETALLE
                    <OrderDetailView order={selectedOrder} />
                )}
            </Modal>
        </AdminLayout>
    );
};

export default AdminGestionPedidosPage;