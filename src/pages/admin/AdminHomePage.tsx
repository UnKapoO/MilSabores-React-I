import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Componentes UI
import AdminPageHeader from '../../components/ui/admin/AdminPageHeader';
import KpiCard from '../../components/ui/admin/KpiCard';
import { Button } from '../../components/ui/common/Button'; 
import MonthlyIncomeWidget from '../../components/ui/admin/MonthlyIncomeWidget';
import { InputField } from '../../components/ui/common/InputField'; 

// Tipos y Contexto
import type { Product } from '../../types/Product';
import type { Order } from '../../types/Order';
import { formatearPrecio, obtenerNombreCategoria } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:3001';

const AdminHomePage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // --- ESTADOS ---
    const [stats, setStats] = useState({
        dailySales: 0,
        dailyOrders: 0,
        siteVisits: 145,
        activeProducts: 0
    });

    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [topProducts, setTopProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [allOrders, setAllOrders] = useState<Order[]>([]);

    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return now.toISOString().slice(0, 7);
    });

    const [monthlyGoal, setMonthlyGoal] = useState(() => {
        const savedGoal = localStorage.getItem('admin_monthly_goal');
        return savedGoal ? parseInt(savedGoal) : 2000000;
    });

    // --- CARGA DE DATOS ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    fetch(`${API_URL}/productos`),
                    fetch(`${API_URL}/pedidos`)
                ]);

                const productsData: Product[] = await productsRes.json();
                const ordersData = await ordersRes.json();

                // --- CORRECCIÓN PRINCIPAL AQUÍ ---
                // Procesamos los pedidos normalizando los datos viejos y nuevos
                const processedOrders: Order[] = ordersData.map((item: any) => {
                    // 1. Arreglo de Fechas: Soporta 'fecha' (viejo) y 'fechaCreacion' (nuevo)
                    const rawDate = item.fecha || item.fechaCreacion || new Date().toISOString();

                    // 2. Arreglo de Cliente: Soporta objeto completo o string simple
                    let clientName = 'Cliente Desconocido';
                    if (item.cliente && typeof item.cliente === 'object' && item.cliente.nombre) {
                        clientName = item.cliente.nombre;
                    } else if (typeof item.cliente === 'string') {
                        clientName = item.cliente;
                    } else if (item.userId) {
                        clientName = item.userId;
                    }

                    return {
                        id: item.id,
                        cliente: clientName,
                        fecha: new Date(rawDate).toLocaleDateString('es-CL'),
                        originalDate: rawDate,
                        total: item.total,
                        itemsCount: item.items ? item.items.length : 0,
                        estado: item.estado === 'procesando' ? 'en-preparacion' : item.estado
                    };
                });
                // ---------------------------------

                setAllOrders(processedOrders);

                // CÁLCULO DE KPIs DIARIOS
                const todayString = new Date().toLocaleDateString('es-CL');
                const ordersToday = processedOrders.filter(o => o.fecha === todayString);

                const salesToday = ordersToday
                    .filter(o => o.estado !== 'cancelado')
                    .reduce((sum, o) => sum + o.total, 0);

                setStats({
                    dailySales: salesToday,
                    dailyOrders: ordersToday.length,
                    siteVisits: 145,
                    activeProducts: productsData.length,
                });

                // Listas para las tablas
                // Ordenamos por fecha original para tener los más recientes primero
                const sortedOrders = [...processedOrders].sort((a: any, b: any) =>
                    new Date(b.originalDate).getTime() - new Date(a.originalDate).getTime()
                );

                setRecentOrders(sortedOrders.slice(0, 5));
                setTopProducts(productsData.slice(0, 4));

            } catch (error) {
                console.error("Error cargando dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // --- CÁLCULO DE INGRESOS MENSUALES ---
    const monthlyIncomeFiltered = useMemo(() => {
        return allOrders
            .filter(order => {
                const orderDateISO = (order as any).originalDate || '';
                return orderDateISO.startsWith(selectedMonth) && order.estado !== 'cancelado';
            })
            .reduce((sum, order) => sum + order.total, 0);
    }, [allOrders, selectedMonth]);


    // --- HANDLERS ---
    const handleEditGoal = () => {
        const newGoalString = window.prompt("Ingresa la nueva meta mensual:", monthlyGoal.toString());
        if (newGoalString !== null) {
            const newGoal = parseInt(newGoalString.replace(/\./g, '').replace(/,/g, ''));
            if (!isNaN(newGoal) && newGoal > 0) {
                setMonthlyGoal(newGoal);
                localStorage.setItem('admin_monthly_goal', newGoal.toString());
            } else {
                alert("Por favor ingresa un número válido.");
            }
        }
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedMonth(e.target.value);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pendiente': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'en-preparacion': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'entregado': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const firstName = user?.nombre ? user.nombre.split(' ')[0] : 'Administrador';

    if (isLoading) return <div className="p-20 text-center text-primary">Cargando panel...</div>;

    return (
        <>
            <AdminPageHeader
                title={`¡Bienvenido de nuevo, ${firstName}!`}
                subtitle="Aquí tienes el resumen de tu pastelería."
            />

            {/* SECCIÓN 1: KPIs DIARIOS */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard
                    title="Ventas del Día"
                    value={formatearPrecio(stats.dailySales)}
                    icon="fa-solid fa-cash-register"
                    colorClass="text-green-600"
                />
                <KpiCard
                    title="Pedidos Nuevos"
                    value={stats.dailyOrders}
                    icon="fa-solid fa-bell"
                    colorClass="text-amber-500"
                />
                <KpiCard
                    title="Visitas al Sitio"
                    value={stats.siteVisits}
                    icon="fa-solid fa-eye"
                    colorClass="text-blue-500"
                />
                <KpiCard
                    title="Productos Activos"
                    value={stats.activeProducts}
                    icon="fa-solid fa-box-open"
                    colorClass="text-rose-500"
                />
            </section>

            {/* SECCIÓN 2: Widget de Meta Mensual */}
            <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                    <h3 className="text-lg font-bold text-gray-700">Rendimiento Mensual</h3>
                    <div className="w-48">
                        <InputField
                            label=""
                            name="monthSelector"
                            type="month"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            className="mb-0"
                        />
                    </div>
                </div>
                <MonthlyIncomeWidget
                    currentAmount={monthlyIncomeFiltered}
                    goalAmount={monthlyGoal}
                    onEdit={handleEditGoal}
                />
            </div>

            {/* SECCIÓN 3: Tablas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Últimos Pedidos */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-700 text-lg">Últimos Pedidos</h3>
                        <Button variant="outline" onClick={() => navigate('/admin/pedidos')} className="text-xs px-3 py-1 h-8">
                            Ver Todos
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Cliente</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-rose-50/50 transition-colors">
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-primary">#{order.id}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600">{order.cliente}</td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{formatearPrecio(order.total)}</td>
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(order.estado)}`}>
                                                {order.estado}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {recentOrders.length === 0 && (
                                    <tr><td colSpan={4} className="p-8 text-center text-gray-400">No hay pedidos recientes.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Catálogo Top */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-bold text-gray-700 text-lg">Catálogo Top</h3>
                    </div>
                    <ul className="divide-y divide-gray-100 flex-1 overflow-y-auto max-h-[400px]">
                        {topProducts.map((product, index) => (
                            <li key={product.id} className="p-4 flex items-center gap-4 hover:bg-rose-50/50 transition-colors">
                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-white">
                                    <img src={`/${product.imagen}`} alt={product.nombre} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate" title={product.nombre}>{index + 1}. {product.nombre}</p>
                                    <p className="text-xs text-gray-500">{obtenerNombreCategoria(product.categoria)}</p>
                                </div>
                                <div className="text-sm font-bold text-primary">{formatearPrecio(product.precio)}</div>
                            </li>
                        ))}
                    </ul>
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <Button variant="outline" onClick={() => navigate('/admin/productos')} className="w-full text-sm justify-center">Gestionar Productos</Button>
                    </div>
                </div>

            </div>
        </>
    );
};

export default AdminHomePage;