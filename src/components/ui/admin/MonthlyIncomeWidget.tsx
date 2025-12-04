import React from 'react';
import { formatearPrecio } from '../../../utils/formatters';

interface MonthlyIncomeWidgetProps {
  currentAmount: number;
  goalAmount: number;
  onEdit?: () => void; // <--- 1. NUEVA PROP OPCIONAL
}

const MonthlyIncomeWidget: React.FC<MonthlyIncomeWidgetProps> = ({ currentAmount, goalAmount, onEdit }) => {
  // Calculamos el porcentaje de progreso (máximo 100%)
  const percentage = Math.min(100, Math.max(0, (currentAmount / goalAmount) * 100));

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Ingresos Acumulados del Mes</h4>
          <span className="text-3xl font-bold text-gray-800">{formatearPrecio(currentAmount)}</span>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="text-sm text-gray-400">Meta: {formatearPrecio(goalAmount)}</span>

            {/* 2. BOTÓN DE EDITAR */}
            {onEdit && (
              <button
                onClick={onEdit}
                className="text-gray-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-gray-50"
                title="Editar Meta"
              >
                <i className="fa-solid fa-pen-to-square text-xs"></i>
              </button>
            )}
          </div>

          <p className="text-primary font-bold">{percentage.toFixed(1)}%</p>
        </div>
      </div>

      {/* Barra de Progreso */}
      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute top-0 left-0 bottom-0 right-0 bg-white/20 w-full h-full animate-pulse"></div>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-400 text-center">
        {currentAmount >= goalAmount
          ? "¡Felicidades! Has superado la meta del mes. 🎉"
          : `Faltan ${formatearPrecio(goalAmount - currentAmount)} para la meta.`
        }
      </div>
    </div>
  );
};

export default MonthlyIncomeWidget;