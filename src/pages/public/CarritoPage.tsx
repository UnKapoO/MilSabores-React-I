import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Breadcrumb } from '../../components/ui/common/Breadcrumb';
import { PageHeader } from '../../components/ui/common/PageHeader';
import { EmptyState } from '../../components/ui/common/EmptyState';
import { OrderSummary } from '../../components/ui/OrderSummary';
import CartItem from '../../components/ui/CartItem';
import { Button } from '../../components/ui/common/Button';
import { useCart } from '../../context/CartContext';

// Datos para el Breadcrumb
const breadcrumbLinks = [
    { to: "/", label: "Inicio" }
];

const cupones_validos = ['FELICES50', 'DUOC2025'];

function CarritoPage() {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateCantidad, clearCart, addToast } = useCart();

    // Estados para el descuento
    const [promoCode, setPromoCode] = useState('');
    const [descuento, setDescuento] = useState(0);

    // --- Calculamos los Totales ---
    const subtotal = cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const envio = subtotal > 0 ? 3000 : 0;
    const total = (subtotal + envio) - descuento;

    const handleApplyPromo = () => {
        // 1. Limpiamos el input (mayúsculas y espacios)
        const codigoIngresado = promoCode.trim().toUpperCase();

        // Caso A: El usuario hizo clic en "Aplicar" sin escribir nada
        if (!codigoIngresado) {
            return;
        }

        // Caso B: Validación Estricta (Código Incorrecto)
        if (!cupones_validos.includes(codigoIngresado)) {
            addToast('El cupón no es válido.', 'error'); 
            setDescuento(0); 
            setPromoCode(''); 
            return;
        }

        // Caso C: Código Correcto
        let nuevoDescuento = 0;

        if (codigoIngresado === 'FELICES50') {
            nuevoDescuento = subtotal * 0.10;
            addToast('¡Cupón FELICES50 aplicado! (10%)', 'success');
        } else if (codigoIngresado === 'DUOC2025') {
            nuevoDescuento = subtotal * 0.20;
            addToast('¡Beneficio Duoc aplicado! (20%)', 'success');
        }

        setDescuento(nuevoDescuento);
        setPromoCode(''); 
    };
    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <Breadcrumb links={breadcrumbLinks} currentPage="Carrito" />
            <PageHeader
                title="Mi Carrito de Compras"
                subtitle="Revisa tus productos antes de proceder al pago"
            />

            {cart.length === 0 ? (
                <EmptyState
                    icon="fa-solid fa-cart-shopping"
                    title="Tu carrito está vacío"
                    message="¡Agrega algunos de nuestros deliciosos productos!"
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">

                    {/* Columna Izquierda: Lista de Items */}
                    <div className="lg:col-span-2 bg-white shadow-md rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-dark">
                                Productos en tu carrito ({cart.length})
                            </h2>
                            <Button variant="outline" onClick={clearCart}>
                                <i className="fa-solid fa-trash mr-2"></i>
                                Limpiar Carrito
                            </Button>
                        </div>

                        <div>
                            {cart.map(item => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onRemove={removeFromCart}
                                    onUpdateCantidad={updateCantidad}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Columna Derecha: Resumen del Pedido */}
                    <div>
                        <OrderSummary
                            subtotal={subtotal}
                            envio={envio}
                            descuento={descuento}
                            total={total}
                            buttonText="Proceder al Pago"
                            onButtonClick={handleCheckout}
                            promoCode={promoCode}
                            onPromoChange={(e) => setPromoCode(e.target.value)}
                            onApplyPromo={handleApplyPromo}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CarritoPage;