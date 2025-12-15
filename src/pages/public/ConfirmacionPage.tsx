import { useEffect, useRef } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { OrderSuccessCard } from '../../components/ui/OrderSuccesCard';
import { Button } from '../../components/ui/common/Button';
import { useCart } from '../../context/CartContext';

function ConfirmacionPage() {
    const location = useLocation();
    const orden = location.state?.orden;
    const { clearCart } = useCart();
    const hasClearedRef = useRef(false);

    useEffect(() => {
        if (orden && !hasClearedRef.current) {
            clearCart(); 
            hasClearedRef.current = true;
        }
    }, [orden, clearCart]);

    if (!orden) {
        return (
            <div className="container mx-auto py-20 px-4 text-center">
                <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
                    <i className="fa-solid fa-circle-exclamation text-5xl text-red-500 mb-4"></i>
                    <h1 className="text-2xl font-bold text-dark mb-2">No se encontró el pedido</h1>
                    <p className="text-letra-cafe mb-6">
                        Parece que no hay información de compra reciente.
                        Si acabas de comprar, revisa tu correo electrónico.
                    </p>
                    <Link to="/catalogo">
                        <Button variant="primary">Ir al Catálogo</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12 px-4">
            {/* 3. Renderizamos la tarjeta con los datos reales de la orden */}
            <OrderSuccessCard orden={orden} />
        </div>
    );
}

export default ConfirmacionPage;