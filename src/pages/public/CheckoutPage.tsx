import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

import { Breadcrumb } from '../../components/ui/common/Breadcrumb';
import { PageHeader } from '../../components/ui/common/PageHeader';
import { InputField } from '../../components/ui/common/InputField';
import { SelectField } from '../../components/ui/common/SelectField';
import type { SelectOption } from '../../components/ui/common/SelectField';
import { OrderSummary } from '../../components/ui/OrderSummary';

const breadcrumbLinks = [{ to: "/", label: "Inicio" }, { to: "/carrito", label: "Carrito" }];

const comunasOptions: SelectOption[] = [
    { value: "", label: "Seleccionar comuna *" },
    { value: "concepcion", label: "Concepción" },
    { value: "talcahuano", label: "Talcahuano" },
    { value: "hualpen", label: "Hualpén" },
    { value: "san-pedro", label: "San Pedro de la Paz" },
    { value: "chiguayante", label: "Chiguayante" },
];

// Opciones para tipo de vivienda
const viviendaOptions: SelectOption[] = [
    { value: "casa", label: "Casa" },
    { value: "departamento", label: "Departamento" },
    { value: "oficina", label: "Oficina" },
];

// --- LÓGICA DE FECHAS ---
// Calculamos dinámicamente "Hoy" y "En 1 mes"
const getISODate = (date: Date) => date.toISOString().split('T')[0];
const today = new Date();
const minDate = getISODate(today);
const maxDateObj = new Date(today);
maxDateObj.setMonth(maxDateObj.getMonth() + 1);
const maxDate = getISODate(maxDateObj);

function CheckoutPage() {
    const navigate = useNavigate();
    const { cart, clearCart, addToast } = useCart();

    useEffect(() => {
        if (cart.length === 0) {
            navigate('/catalogo');
            addToast("Tu carrito está vacío, agrega productos primero.", "info");
        }
    }, [cart, navigate, addToast]);

    // --- ESTADO DEL FORMULARIO (Actualizado con dirección dividida) ---
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        // Dirección dividida:
        calle: '',
        numero: '',
        tipoVivienda: 'casa',
        comuna: '',
        fechaEntrega: ''
    });
    const [metodoPago, setMetodoPago] = useState('webpay');

    // Estado de Errores
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const subtotal = cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const envio = subtotal > 0 ? 3000 : 0;
    const total = subtotal + envio;

    // --- HANDLER DE CAMBIOS (Con validación de teléfono) ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Validación INMEDIATA para Teléfono: Solo números
        if (name === 'telefono') {
            // Si el valor NO es un número y no está vacío, no hacemos nada (bloqueamos la escritura)
            if (!/^\d*$/.test(value)) return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));

        // Limpiar error al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // --- VALIDACIÓN AL ENVIAR ---
    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";

        // Validar teléfono (largo)
        if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es obligatorio";
        else if (formData.telefono.length < 8) newErrors.telefono = "Mínimo 8 números";

        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";

        // Validar Dirección Dividida
        if (!formData.calle.trim()) newErrors.calle = "La calle es obligatoria";
        if (!formData.numero.trim()) newErrors.numero = "El número es obligatorio";

        // Validar Comuna (Select)
        if (!formData.comuna) newErrors.comuna = "Debes seleccionar una comuna";

        // Validar Fecha (Estricta: No pasado, no muy futuro)
        if (!formData.fechaEntrega) {
            newErrors.fechaEntrega = "Selecciona una fecha";
        } else {
            // Comparación simple de strings ISO es más segura para evitar líos de zona horaria local
            if (formData.fechaEntrega < minDate) {
                newErrors.fechaEntrega = "La fecha no puede ser en el pasado";
            } else if (formData.fechaEntrega > maxDate) {
                newErrors.fechaEntrega = "Máximo 1 mes de anticipación";
            }
        }

        setErrors(newErrors);

        // Si hay errores, mostramos un toast general
        if (Object.keys(newErrors).length > 0) {
            addToast("Por favor corrige los campos en rojo", "error");
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        // Construimos la dirección completa para guardarla
        const direccionCompleta = `${formData.calle} #${formData.numero} (${formData.tipoVivienda})`;

        const orden = {
            cliente: { ...formData, direccion: direccionCompleta },
            userId: "guest",
            pago: { metodo: metodoPago },
            items: cart,
            total: total,
            fechaCreacion: new Date().toISOString()
        };

        clearCart();
        navigate('/confirmacion', { state: { orden } });
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <Breadcrumb links={breadcrumbLinks} currentPage="Checkout" />
            <PageHeader title="Finalizar Compra" subtitle="Completa tu pedido de manera segura" />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">

                    <div className="lg:col-span-2 space-y-8">
                        {/* Sección de Entrega */}
                        <section className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-truck text-primary"></i> Información de Entrega
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="Nombre completo *" name="nombre" type="text"
                                    value={formData.nombre} onChange={handleChange} error={errors.nombre}
                                />
                                <InputField
                                    label="Teléfono *" name="telefono" type="tel" maxLength={9}
                                    value={formData.telefono} onChange={handleChange} error={errors.telefono}
                                />
                            </div>

                            <InputField
                                label="Correo electrónico *" name="email" type="email"
                                value={formData.email} onChange={handleChange} error={errors.email}
                            />

                            {/* DIRECCIÓN DIVIDIDA */}
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-8">
                                    <InputField
                                        label="Calle *" name="calle" type="text"
                                        value={formData.calle} onChange={handleChange} error={errors.calle}
                                    />
                                </div>
                                <div className="col-span-4">
                                    <InputField
                                        label="Número *" name="numero" type="text"
                                        value={formData.numero} onChange={handleChange} error={errors.numero}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <SelectField
                                    label="Tipo de vivienda" name="tipoVivienda"
                                    value={formData.tipoVivienda} onChange={handleChange} options={viviendaOptions}
                                />
                                <SelectField
                                    label="Comuna *" name="comuna"
                                    value={formData.comuna} onChange={handleChange} options={comunasOptions}
                                    error={errors.comuna} // ¡AHORA SÍ SE PONDRÁ ROJO!
                                />
                            </div>

                            <div className="mt-4">
                                <InputField
                                    label="Fecha de entrega *" name="fechaEntrega" type="date"
                                    value={formData.fechaEntrega} onChange={handleChange}
                                    min={minDate} max={maxDate}
                                    error={errors.fechaEntrega}
                                />
                                <small className="text-gray-500 -mt-3 block">
                                    Puedes agendar pedidos hasta el {new Date(maxDate).toLocaleDateString('es-CL')}.
                                </small>
                            </div>

                        </section>

                        {/* Sección de Pago (Igual que antes) */}
                        <section className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-credit-card text-primary"></i> Método de Pago
                            </h3>
                            <div
                                className={`border-2 rounded-lg p-4 flex items-center gap-4 cursor-pointer ${metodoPago === 'webpay' ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                                onClick={() => setMetodoPago('webpay')}
                            >
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
                            promoCode={undefined} onPromoChange={undefined} onApplyPromo={undefined}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default CheckoutPage;