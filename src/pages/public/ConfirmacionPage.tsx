import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Button } from '../../components/ui/common/Button';

function ConfirmacionPage() {
    const location = useLocation();
    const orden = location.state?.orden;

    // Protección: Si alguien entra directo a /confirmacion sin orden, lo mandamos al home
    if (!orden) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="container mx-auto py-20 px-4 text-center">
            <div className="bg-green-100 text-green-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-check text-5xl"></i>
            </div>

            <h1 className="font-secundaria text-5xl text-dark mb-4">¡Compra Aprobada!</h1>
            <p className="text-xl text-letra-cafe mb-8">
                Gracias {orden.cliente.nombre}, tu pedido ha sido procesado exitosamente.
            </p>

            <div className="bg-white max-w-2xl mx-auto p-8 rounded-lg shadow-md border mb-8 text-left">
                <h3 className="font-bold text-xl mb-4 border-b pb-2">Resumen de entrega</h3>
                <p><strong>Dirección:</strong> {orden.cliente.direccion}, {orden.cliente.comuna}</p>
                <p><strong>Fecha estimada:</strong> {orden.cliente.fechaEntrega}</p>
                <p><strong>Total pagado:</strong> ${orden.total.toLocaleString('es-CL')}</p>
            </div>

            <Link to="/catalogo">
                <Button variant="primary">Volver al Catálogo</Button>
            </Link>
        </div>
    );
}

export default ConfirmacionPage;