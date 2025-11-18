import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

// --- Importamos todos nuestros LEGOs ---
import { Breadcrumb } from '../../components/ui/common/Breadcrumb';
import { PageHeader } from '../../components/ui/common/PageHeader';
import { InputField } from '../../components/ui/common/InputField';
import { SelectField } from '../../components/ui/common/SelectField';
import type { SelectOption } from '../../components/ui/common/SelectField';
import { OrderSummary } from '../../components/ui/OrderSummary';

// --- Datos para el Breadcrumb ---
const breadcrumbLinks = [
    { to: "/", label: "Inicio" },
    { to: "/carrito", label: "Carrito" }
];

// --- Opciones para el <select> de comuna ---
const comunasOptions: SelectOption[] = [
    { value: "", label: "Seleccionar comuna *" },
    { value: "concepcion", label: "Concepción" },
    { value: "talcahuano", label: "Talcahuano" },
    { value: "hualpen", label: "Hualpén" },
    { value: "san-pedro", label: "San Pedro de la Paz" },
    { value: "chiguayante", label: "Chiguayante" },
];

// --- ¡NUEVA LÓGICA DE FECHAS! ---
// Función para obtener la fecha en formato YYYY-MM-DD (necesario para el input)
const getISODateString = (date: Date) => {
    return date.toISOString().split('T')[0];
};

// 1. Obtenemos la fecha de HOY
const today = new Date();
const minDate = getISODateString(today); // Hoy es el mínimo

// 2. Calculamos la fecha máxima (hoy + 1 mes)
const maxDate = new Date(today);
maxDate.setMonth(maxDate.getMonth() + 1);
const maxDateString = getISODateString(maxDate);
// --- FIN LÓGICA DE FECHAS ---


function CheckoutPage() {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();

    // --- Estados para el formulario de Entrega ---
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [direccion, setDireccion] = useState('');
    const [comuna, setComuna] = useState('');
    const [fechaEntrega, setFechaEntrega] = useState('');

    // --- ¡CAMBIO! Estados para el formulario de Pago (simplificado) ---
    const [metodoPago, setMetodoPago] = useState('webpay'); // Webpay por defecto

    // ... (Lógica del Carrito para el Resumen: subtotal, envio, total) ...
    const subtotal = cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const envio = subtotal > 0 ? 3000 : 0;
    const total = subtotal + envio;

    // --- Handler para ENVIAR el formulario ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const orden = {
            cliente: { nombre, telefono, email, direccion, comuna, fechaEntrega },
            pago: { metodo: metodoPago }, // Pago simplificado
            items: cart,
            total: total
        };

        console.log("--- ORDEN ENVIADA (SIMULADO) ---", orden);
        clearCart();
        navigate('/confirmacion', {
            state: {
                ordenId: "MS-12345",
                clienteEmail: email
            }
        });
    };

    return (
        <div className="bg-fondo-crema container mx-auto py-12 px-4">
            <Breadcrumb links={breadcrumbLinks} currentPage="Checkout" />
            <PageHeader
                title="Finalizar Compra"
                subtitle="Completa tu pedido de manera segura"
            />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">

                    {/* --- Columna Izquierda: Formularios --- */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Sección de Entrega */}
                        <section className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-truck text-primary"></i>
                                Información de Entrega
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Nombre completo *" name="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                                <InputField label="Teléfono *" name="telefono" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                            </div>
                            <InputField label="Correo electrónico *" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <InputField label="Dirección de entrega *" name="direccion" type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectField label="Comuna *" name="comuna" value={comuna} onChange={(e) => setComuna(e.target.value)} options={comunasOptions} />

                                {/* --- ¡INPUT DE FECHA ARREGLADO! --- */}
                                <InputField
                                    label="Fecha de entrega *"
                                    name="fecha"
                                    type="date"
                                    value={fechaEntrega}
                                    onChange={(e) => setFechaEntrega(e.target.value)}
                                    min={minDate} // <-- Límite mínimo (hoy)
                                    max={maxDateString} // <-- Límite máximo (1 mes)
                                />

                            </div>
                        </section>

                        {/* --- ¡SECCIÓN DE PAGO SIMPLIFICADA! --- */}
                        <section className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-credit-card text-primary"></i>
                                Método de Pago
                            </h3>
                            <p className="text-letra-cafe mb-4">
                                Serás redirigido a Webpay para completar tu pago de forma segura.
                            </p>

                            {/* Selector de Método (simple) */}
                            <div
                                className={`border-2 rounded-lg p-4 flex items-center gap-4 cursor-pointer
                            ${metodoPago === 'webpay' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                                onClick={() => setMetodoPago('webpay')}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    id="webpay"
                                    checked={metodoPago === 'webpay'}
                                    onChange={() => { }} // El 'onClick' del div ya lo maneja
                                    className="w-5 h-5 text-primary focus:ring-primary"
                                />
                                <label htmlFor="webpay" className="font-bold text-dark text-lg cursor-pointer">
                                    Pagar con Webpay
                                </label>
                                <img src="/img/webpay-logo.png" alt="Webpay" className="h-8 ml-auto" />
                            </div>
                            {/* (Podrías añadir otra opción como "Transferencia" aquí si quisieras) */}
                        </section>

                    </div>

                    {/* --- Columna Derecha: Resumen --- */}
                    <div className="lg:col-span-1">
                        <OrderSummary
                            subtotal={subtotal}
                            envio={envio}
                            descuento={0}
                            total={total}
                            buttonText="Finalizar Compra"
                            buttonType="submit"
                            // Ocultamos las props de promo
                            onPromoChange={undefined}
                            onApplyPromo={undefined}
                            promoCode={undefined}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CheckoutPage;