import React from 'react';
import { Button } from './common/Button';
import { InputField } from './common/InputField';
import { formatearPrecio } from '../../utils/formatters';

// --- Definimos las Props que recibirá ---
interface OrderSummaryProps {
    subtotal: number;
    envio: number;
    descuento: number;
    total: number;

    // Props para el botón (para que cambie)
    buttonText: string;
    onButtonClick?: () => void; // La función que se ejecutará al hacer clic
    buttonType?: 'button' | 'submit';
    // Props para el input de descuento
    promoCode?: string;
    onPromoChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onApplyPromo?: () => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    subtotal,
    envio,
    descuento,
    total,
    buttonText,
    onButtonClick,
    buttonType = 'button',
    promoCode,
    onPromoChange,
    onApplyPromo
}) => {
    return (
        // 1. "Traducción" de tu .resumen-pedido a Tailwind
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-32">
            <h3 className="text-2xl font-bold text-dark mb-4">Resumen del Pedido</h3>

            {/* 2. Líneas de Totales */}
            <div className="space-y-3 text-letra-cafe">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">{formatearPrecio(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Envío:</span>
                    <span className="font-medium">{formatearPrecio(envio)}</span>
                </div>

                {/* Mostramos la línea de descuento solo si es mayor a 0 */}
                {descuento > 0 && (
                    <div className="flex justify-between text-green-600">
                        <span>Descuento:</span>
                        <span className="font-medium">-{formatearPrecio(descuento)}</span>
                    </div>
                )}

                {/* Línea de Total */}
                <div className="flex justify-between text-xl font-bold text-dark pt-3 border-t">
                    <span>Total:</span>
                    <span>{formatearPrecio(total)}</span>
                </div>
            </div>

            {/* 3. Input de Descuento (¡reutilizamos InputField!) */}
            {/* 3. Input de Descuento (¡AHORA CONDICIONAL!) */}
            {/* Esto solo se mostrará si le pasamos la prop 'onPromoChange' */}
            {onPromoChange && (
                <div className="mt-6">
                    <label className="block text-letra-cafe font-bold mb-1">
                        Código de Descuento
                    </label>
                    <div className="flex gap-2">
                        <InputField
                            label=""
                            name="promo"
                            type="text"
                            placeholder="EJ: FELICES50"
                            value={promoCode || ''} // Usamos || '' por si acaso
                            onChange={onPromoChange}
                            className="mb-0"
                        />
                        <Button variant="outline" onClick={onApplyPromo} className="shrink-0">
                            Aplicar
                        </Button>
                    </div>
                </div>
            )}
            {/* 4. Botón de Acción */}
            <Button
                variant="primary"
                onClick={onButtonClick}
                type={buttonType}
                className="w-full mt-6"
            >
                {buttonText} <i className="fa-solid fa-arrow-right ml-2"></i>
            </Button>
            <div className="text-center text-sm text-letra-gris mt-4 flex items-center justify-center gap-2">
                <i className="fa-solid fa-shield-alt"></i>
                <span>Compra 100% segura y protegida</span>
            </div>
        </div>
    );
};