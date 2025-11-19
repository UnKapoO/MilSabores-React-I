
interface KpiCardProps {
  title: string;
  value: string | number;
  icon: string;
  colorClass: string; // Ej: "text-blue-500" o "text-amber-500"
}

const KpiCard = ({ title, value, icon, colorClass }: KpiCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-xl ${colorClass}`}>
        <i className={icon}></i>
      </div>
      <div>
        <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
        <span className="text-2xl font-bold text-gray-800">{value}</span>
      </div>
    </div>
  );
};

export default KpiCard;