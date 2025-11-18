import { useState } from 'react';
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

function CarritoPage() {
    const navigate = useNavigate(); // Para el botón de "Proceder al Pago"
    // Obtenemos el estado real (cart) y las funciones que necesitamos
    const { cart, removeFromCart, updateCantidad, clearCart, addToast } = useCart();
    //Estados para el descuento
    const [promoCode, setPromoCode] = useState(''); // Para el input
    const [descuento, setDescuento] = useState(0);
    // --- Calculamos los Totales (Lógica real) ---
    const subtotal = cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const envio = subtotal > 0 ? 3000 : 0;
    // ¡El total ahora resta el descuento!
    const total = (subtotal + envio) - descuento;

    // (Por ahora, el envío es fijo. Podríamos hacerlo más complejo)
    const handleApplyPromo = () => {
        // (Esta es una lógica simple, ¡puedes mejorarla!)
        if (promoCode.toUpperCase() === 'FELICES50') {
            const descuentoAplicado = subtotal * 0.1; // 10% de descuento
            setDescuento(descuentoAplicado);
            addToast('¡Código aplicado!', 'success'); // (¡Podríamos usar el Toast para esto!)
        } else {
            addToast('Código no válido', 'error');
            setDescuento(0);
        }
        setPromoCode(''); // Limpia el input
    };

    // --- Funciones "Handler" ---
    const handleCheckout = () => {
        // Esta función nos llevará a la siguiente página
        navigate('/checkout');
    };
    return (
        <div className="bg-fondo-crema container mx-auto py-12 px-4">
            <Breadcrumb links={breadcrumbLinks} currentPage="Carrito" />
            <PageHeader
                title="Mi Carrito de Compras"
                subtitle="Revisa tus productos antes de proceder al pago"
            />
            {cart.length === 0 ? (
                // A. Si el carrito está vacío
                <EmptyState
                    icon="fa-solid fa-cart-shopping"
                    title="Tu carrito está vacío"
                    message="¡Agrega algunos de nuestros deliciosos productos!"
                />
            ) : (
                // B. Si el carrito tiene items
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
                    {/* Columna Izquierda: Lista de Items */}
                    <div className="lg:col-span-2 bg-white shadow-md rounded-lg border">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-2xl font-bold text-dark">
                                Productos en tu carrito ({cart.length})
                            </h2>
                            {/* Botón para limpiar todo el carrito */}
                            <Button variant="outline" onClick={clearCart}>
                                <i className="fa-solid fa-trash mr-2"></i>
                                Limpiar Carrito
                            </Button>
                        </div>

                        {/* Hacemos .map() sobre el 'cart' REAL */}
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
                        {/* 8. Pasamos los datos REALES al Resumen */}
                        <OrderSummary
                            subtotal={subtotal}
                            envio={envio}
                            descuento={descuento} 
                            total={total}
                            buttonText="Proceder al Pago"
                            onButtonClick={handleCheckout}
                            promoCode={promoCode} // <-- Le pasamos el estado del input
                            onPromoChange={(e) => setPromoCode(e.target.value)} // <-- Conectamos el onChange
                            onApplyPromo={handleApplyPromo} // <-- Conectamos el botón
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CarritoPage;