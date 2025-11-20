import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: string;
  colorClass: string; // Ej: "text-blue-500"
}

const KpiCard = ({ title, value, icon, colorClass }: KpiCardProps) => {
  return (
    <div className="
        bg-white 
        p-6 
        rounded-2xl 
        shadow-md 
        border border-gray-100 
        flex items-center justify-between 
        transition-all duration-300 ease-in-out
        hover:shadow-xl hover:-translate-y-1 
        group
    ">
      {/* Lado Izquierdo: Texto */}
      <div>
        <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
            {title}
        </h4>
        <span className="text-3xl font-bold text-gray-800 tracking-tight">
            {value}
        </span>
      </div>

      {/* Lado Derecho: Ícono */}
      {/* Usamos 'group-hover' para que el ícono crezca cuando pasas el mouse por la tarjeta */}
      <div className={`
          w-14 h-14 
          rounded-2xl 
          bg-gray-50 
          flex items-center justify-center 
          text-2xl 
          ${colorClass}
          transition-transform duration-300 
          group-hover:scale-110 group-hover:bg-opacity-80
      `}>
        <i className={icon}></i>
      </div>
    </div>
  );
};

export default KpiCard;