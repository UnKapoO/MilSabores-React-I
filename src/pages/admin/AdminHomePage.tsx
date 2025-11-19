import KpiCard from '../../components/ui/admin/KpiCard';

const AdminHomePage = () => {
  const stats = [
    { title: 'Ventas del Día', value: '$125.500', icon: 'fa-solid fa-dollar-sign', color: 'text-green-500' },
    { title: 'Pedidos Nuevos', value: '12', icon: 'fa-solid fa-cart-plus', color: 'text-blue-500' },
    { title: 'Productos', value: '25', icon: 'fa-solid fa-cake-candles', color: 'text-rose-500' },
    { title: 'Clientes', value: '150', icon: 'fa-solid fa-users', color: 'text-purple-500' },
  ];

  return (
    <div>
      {/* Header de la página */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Bienvenido al panel de administración de Mil Sabores.</p>
      </header>

      {/* Grid de KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <KpiCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            colorClass={stat.color}
          />
        ))}
      </section>

      {/* Aquí irían más secciones */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center text-gray-400">
        Gráfico de Ventas (Próximamente)
      </div>
    </div>
  );
};

export default AdminHomePage;