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
import { formatearPrecio } from '../../utils/formatters'; // Opcional, si lo usas en algún lado extra

const API_URL = 'http://localhost:3001/pedidos';

const AdminGestionPedidosPage = () => {
    // --- ESTADOS ---
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Estados para los filtros
    const [activeStatus, setActiveStatus] = useState('todos');
    const [filterDate, setFilterDate] = useState('');

    // --- LÓGICA DE CARGA Y TRANSFORMACIÓN DE DATOS ---
    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Fallo al cargar pedidos');
            
            const rawData = await response.json();

            // Transformamos los datos de db.json a nuestra interfaz Order
            const mappedOrders: Order[] = rawData.map((item: any) => ({
                id: item.id,
                cliente: item.userId || item.cliente || 'Anónimo', // Soporta userId o cliente
                // Convertimos la fecha a formato local (DD/MM/AAAA) para mostrar y filtrar
                fecha: new Date(item.fecha).toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('-').reverse().join('-'), // Intento de normalizar a YYYY-MM-DD para el input date si fuera necesario, pero para visualización usamos string directo si ya viene formateado. 
                // Nota: Para simplificar el filtro de fecha, asumimos que item.fecha viene en formato ISO (2024-03-10...)
                // Si item.fecha es ISO, lo guardamos tal cual para filtrar, y lo formateamos solo visualmente en la tabla.
                // Para este ejemplo, usaremos la fecha cruda del JSON para comparar con el input date.
                // En un caso real, normalizarías esto mejor.
                
                // Simplificación para este ejercicio: Usamos la fecha original para el objeto
                originalDate: item.fecha, // Guardamos fecha original para filtro
                // Fecha bonita para mostrar
                fechaDisplay: new Date(item.fecha).toLocaleDateString('es-CL'), 
                
                total: item.total,
                itemsCount: item.items ? item.items.length : 0,
                // Normalizamos estados antiguos
                estado: item.estado === 'procesando' ? 'en-preparacion' : item.estado
            })).map((order: any) => ({
                ...order,
                fecha: order.originalDate.split('T')[0] // Guardamos YYYY-MM-DD en el campo fecha principal para que coincida con el input type="date"
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


    // --- CÁLCULOS DE KPIs ---
    const totalPendientes = orders.filter(o => o.estado === 'pendiente').length;
    const totalPreparacion = orders.filter(o => o.estado === 'en-preparacion').length;
    const totalEntregados = orders.filter(o => o.estado === 'entregado').length;
    const totalCancelados = orders.filter(o => o.estado === 'cancelado').length;


    // --- OPCIONES DE FILTRO ---
    const statusOptions: SelectOption[] = [
        { value: 'todos', label: '— Mostrar Todos los Estados —' },
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'en-preparacion', label: 'En Preparación' },
        { value: 'entregado', label: 'Entregado' },
        { value: 'cancelado', label: 'Cancelado' },
    ];


    // --- LÓGICA DE FILTRADO ---
    const filteredOrders = orders.filter(order => {
        // 1. Filtro de Estado
        const matchStatus = activeStatus === 'todos' || order.estado === activeStatus;
        
        // 2. Filtro de Fecha (Compara YYYY-MM-DD)
        const matchDate = filterDate === '' || order.fecha === filterDate;

        return matchStatus && matchDate;
    });

    // Handlers
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


    // --- ACCIONES DE FILA ---
    const handleViewDetails = (id: number | string) => {
        alert(`Ver detalles del pedido #${id}`);
    };

    const handleUpdateStatus = (id: number | string, newStatus: Order['estado']) => {
        alert(`Simular actualización de pedido #${id} a estado: ${newStatus}`);
    };


    // --- RENDERIZADO ---
    
    if (isLoading) {
        return (
            <AdminLayout>
                <div className="p-20 text-center text-primary">Cargando pedidos...</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <AdminPageHeader
                title="Gestión de Pedidos"
                subtitle={`Pedidos en el sistema: ${orders.length}`}
            />

            {/* 1. GRID DE KPIs */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard title="Pendientes" value={totalPendientes} icon="fa-solid fa-clock" colorClass="text-amber-500" />
                <KpiCard title="En Preparación" value={totalPreparacion} icon="fa-solid fa-spinner" colorClass="text-blue-500" />
                <KpiCard title="Completados" value={totalEntregados} icon="fa-solid fa-check-circle" colorClass="text-green-500" />
                <KpiCard title="Cancelados" value={totalCancelados} icon="fa-solid fa-ban" colorClass="text-red-500" />
            </section>

            {/* 2. BARRA DE FILTROS */}
            <div className="mb-6 flex flex-col sm:flex-row justify-end gap-4 items-end">
                
                {/* Botón Limpiar */}
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

                {/* Input Fecha */}
                <div className="w-full sm:w-48">
                    <InputField 
                        label="Filtrar por Fecha"
                        name="dateFilter"
                        type="date"
                        value={filterDate}
                        onChange={handleDateChange}
                    />
                </div>

                {/* Select Estado */}
                <div className="w-full sm:w-64">
                    <SelectField
                        label="Filtrar por Estado"
                        name="statusFilter"
                        value={activeStatus}
                        onChange={handleStatusChange as any}
                        options={statusOptions}
                    />
                </div>
            </div>

            {/* 3. TABLA DE RESULTADOS */}
            {orders.length === 0 ? (
                 <div className="p-10 text-center bg-white rounded-xl shadow-lg mt-8">
                    <p className="text-lg text-gray-500">No hay pedidos registrados.</p>
                </div>
            ) : (
                <AdminTable
                    headers={["ID Pedido", "Cliente", "Fecha", "Items", "Total", "Estado", "Acciones"]}
                >
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <OrderTableRow
                                key={order.id}
                                // Usamos un truco para mostrar la fecha formateada si existe, o la normal
                                order={{...order, fecha: (order as any).fechaDisplay || order.fecha}}
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
                                    <Button variant="outline" onClick={handleClearFilters}>
                                        Limpiar Filtros
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )}
                </AdminTable>
            )}
        </AdminLayout>
    );
};

export default AdminGestionPedidosPage;