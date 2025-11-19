import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

import { Breadcrumb } from '../../components/ui/common/Breadcrumb';
import { PageHeader } from '../../components/ui/common/PageHeader';
import { InputField } from '../../components/ui/common/InputField';
import { SelectField } from '../../components/ui/common/SelectField';
import type { SelectOption } from '../../components/ui/common/SelectField';
import { OrderSummary } from '../../components/ui/OrderSummary';
import { useAuth } from '../../context/AuthContext';

const breadcrumbLinks = [{ to: "/", label: "Inicio" }, { to: "/carrito", label: "Carrito" }];

const comunasOptions: SelectOption[] = [
    { value: "", label: "Seleccionar comuna *" },
    { value: "concepcion", label: "Concepción" },
    { value: "talcahuano", label: "Talcahuano" },
    { value: "hualpen", label: "Hualpén" },
    { value: "san-pedro", label: "San Pedro de la Paz" },
    { value: "chiguayante", label: "Chiguayante" },
];

const viviendaOptions: SelectOption[] = [
    { value: "casa", label: "Casa" },
    { value: "departamento", label: "Departamento" },
    { value: "oficina", label: "Oficina" },
];

// --- LÓGICA DE FECHAS (LOCAL) ---
// Función para obtener fecha local en formato YYYY-MM-DD
const getLocalDateString = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

function CheckoutPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    // NOTA: Ya no sacamos 'clearCart' de aquí
    const { cart, addToast } = useCart();

    // Cálculo de fechas DENTRO del componente para que siempre sea "Hoy" real
    const today = new Date();
    const minDate = getLocalDateString(today); // Hoy local

    const maxDateObj = new Date();
    maxDateObj.setMonth(maxDateObj.getMonth() + 1); // Hoy + 1 mes
    const maxDate = getLocalDateString(maxDateObj);


    useEffect(() => {
        if (cart.length === 0) {
            navigate('/catalogo');
            addToast("Tu carrito está vacío, agrega productos primero.", "info");
        }
    }, [cart, navigate, addToast]);

    const [formData, setFormData] = useState({
        nombre: '', telefono: '', email: '',
        calle: '', numero: '', tipoVivienda: 'casa', comuna: '',
        fechaEntrega: ''
    });
    const [metodoPago, setMetodoPago] = useState('webpay');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const subtotal = cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const envio = subtotal > 0 ? 3000 : 0;
    const total = subtotal + envio;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'telefono' && !/^\d*$/.test(value)) return;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        const soloLetrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        // Nombre
        if (!formData.nombre.trim()) newErrors.nombre = "Obligatorio";
        else if (!soloLetrasRegex.test(formData.nombre)) newErrors.nombre = "Solo letras";

        // Teléfono: Exactamente 9 dígitos (formato chileno móvil usual)
        if (!formData.telefono.trim()) newErrors.telefono = "Obligatorio";
        else if (formData.telefono.length !== 9) newErrors.telefono = "Debe tener 9 dígitos";

        // Email
        if (!formData.email.trim()) newErrors.email = "Obligatorio";
        else if (!regexEmail.test(formData.email)) newErrors.email = "Email inválido";

        // Dirección y Número (Límites lógicos)
        if (!formData.calle.trim()) newErrors.calle = "Obligatorio";
        else if (formData.calle.length > 50) newErrors.calle = "Máx 50 caracteres";

        if (!formData.numero.trim()) newErrors.numero = "Obligatorio";
        else if (formData.numero.length > 10) newErrors.numero = "Máx 10 carac.";

        if (!formData.comuna) newErrors.comuna = "Selecciona una comuna";

        // Fecha (Ya la tenías bien, la mantenemos)
        if (!formData.fechaEntrega) {
            newErrors.fechaEntrega = "Selecciona una fecha";
        } else {
            if (formData.fechaEntrega < minDate) newErrors.fechaEntrega = "Fecha inválida (pasado)";
            else if (formData.fechaEntrega > maxDate) newErrors.fechaEntrega = "Máx 1 mes de anticipación";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            addToast("Corrige los errores para continuar", "error");
        }
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const direccionCompleta = `${formData.calle} #${formData.numero} (${formData.tipoVivienda})`;

        const orden = {
            cliente: { ...formData, direccion: direccionCompleta },
            pago: { metodo: metodoPago },
            items: cart, // Pasamos el carrito actual
            total: total,
            userId: user ? user.email : "guest",
            fechaCreacion: new Date().toISOString()
        };

        // --- ARREGLO DEL CONGELAMIENTO ---
        // 1. NO llamamos a clearCart() aquí.
        // 2. Navegamos primero. La página de confirmación limpiará el carro.
        navigate('/confirmacion', { state: { orden } });
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <Breadcrumb links={breadcrumbLinks} currentPage="Checkout" />
            <PageHeader title="Finalizar Compra" subtitle="Completa tu pedido de manera segura" />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Sección Entrega */}
                        <section className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-truck text-primary"></i> Información de Entrega
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Nombre completo *" name="nombre" type="text" value={formData.nombre} onChange={handleChange} error={errors.nombre} />
                                <InputField label="Teléfono *" name="telefono" type="tel" maxLength={9} value={formData.telefono} onChange={handleChange} error={errors.telefono} />
                            </div>
                            <InputField label="Correo electrónico *" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-8">
                                    <InputField label="Calle *" name="calle" type="text" maxLength={50} value={formData.calle} onChange={handleChange} error={errors.calle} />
                                </div>
                                <div className="col-span-4">
                                    <InputField label="Número *" name="numero" type="text" maxLength= {15} value={formData.numero} onChange={handleChange} error={errors.numero} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectField label="Tipo de vivienda" name="tipoVivienda" value={formData.tipoVivienda} onChange={handleChange} options={viviendaOptions} />
                                <SelectField label="Comuna *" name="comuna" value={formData.comuna} onChange={handleChange} options={comunasOptions} error={errors.comuna} />
                            </div>

                            <div className="mt-4">
                                <InputField
                                    label="Fecha de entrega *" name="fechaEntrega" type="date"
                                    value={formData.fechaEntrega} onChange={handleChange}
                                    // Pasamos los límites calculados dinámicamente
                                    min={minDate} max={maxDate}
                                    error={errors.fechaEntrega}
                                />
                                <small className="text-gray-500 -mt-3 block">
                                    {/* Mostramos la fecha máxima legible */}
                                    Puedes agendar hasta el {maxDateObj.toLocaleDateString('es-CL')}.
                                </small>
                            </div>
                        </section>

                        {/* Sección Pago */}
                        <section className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-credit-card text-primary"></i> Método de Pago
                            </h3>
                            <div className={`border-2 rounded-lg p-4 flex items-center gap-4 cursor-pointer ${metodoPago === 'webpay' ? 'border-primary bg-blue-50' : 'border-gray-300'}`} onClick={() => setMetodoPago('webpay')}>
                                <input type="radio" name="payment" id="webpay" checked={metodoPago === 'webpay'} onChange={() => { }} className="w-5 h-5 text-primary" />
                                <label htmlFor="webpay" className="font-bold text-dark text-lg cursor-pointer">Webpay / Débito / Crédito</label>
                                <div className="ml-auto flex gap-2 text-2xl text-gray-600">
                                    <i className="fa-brands fa-cc-visa"></i>
                                    <i className="fa-brands fa-cc-mastercard"></i>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-1">
                        <OrderSummary
                            subtotal={subtotal} envio={envio} descuento={0} total={total}
                            buttonText="Pagar y Confirmar" buttonType="submit"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CheckoutPage;