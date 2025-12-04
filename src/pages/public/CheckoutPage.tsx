import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // <-- 1. IMPORTAMOS AUTH

// --- Importamos los LEGOs ---
import { Breadcrumb } from '../../components/ui/common/Breadcrumb';
import { PageHeader } from '../../components/ui/common/PageHeader';
import { InputField } from '../../components/ui/common/InputField';
import { SelectField } from '../../components/ui/common/SelectField';
import type { SelectOption } from '../../components/ui/common/SelectField'; 
import { OrderSummary } from '../../components/ui/OrderSummary';
import { API_BASE_URL } from '../../config/api';

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

const getLocalDateString = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
};

function CheckoutPage() {
    const navigate = useNavigate();
    const { user } = useAuth(); // <-- 2. SACAMOS EL USUARIO
    const { cart, addToast } = useCart(); // (Sin clearCart aquí)

    // Cálculo de fechas
    const today = new Date();
    const minDate = getLocalDateString(today);
    const maxDateObj = new Date();
    maxDateObj.setMonth(maxDateObj.getMonth() + 1);
    const maxDate = getLocalDateString(maxDateObj);

    // Protección: Si el carrito está vacío, volver al catálogo
    useEffect(() => {
        if (cart.length === 0) {
            navigate('/catalogo');
            addToast("Tu carrito está vacío, agrega productos primero.", "info");
        }
    }, [cart, navigate, addToast]);

    // Auto-rellenado de datos si el usuario está logueado
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                nombre: user.nombre || '',
                email: user.email || '',
            }));
        }
    }, [user]);

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

        if (!formData.nombre.trim()) newErrors.nombre = "Obligatorio";
        else if (!soloLetrasRegex.test(formData.nombre)) newErrors.nombre = "Solo letras";

        if (!formData.telefono.trim()) newErrors.telefono = "Obligatorio";
        else if (formData.telefono.length < 8) newErrors.telefono = "Mínimo 8 números";

        if (!formData.email.trim()) newErrors.email = "Obligatorio";
        else if (!regexEmail.test(formData.email)) newErrors.email = "Email inválido";

        if (!formData.calle.trim()) newErrors.calle = "Obligatorio";
        if (!formData.numero.trim()) newErrors.numero = "Obligatorio";
        if (!formData.comuna) newErrors.comuna = "Selecciona una comuna";

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const direccionCompleta = `${formData.calle} #${formData.numero} (${formData.tipoVivienda})`;

        const newOrder = {
            // Usamos el email del usuario logueado, o "guest"
            userId: user ? user.email : "guest",
            
            id: `ORD-${Date.now()}`,
            
            fechaCreacion: new Date().toISOString(),
            total: total,
            estado: "pendiente",
            items: cart.map(item => ({
                nombre: item.nombre,
                cantidad: item.cantidad,
                precio: item.precio,
                imagen: item.imagen,
                cantidadPersonas: item.cantidadPersonas,
                mensajeEspecial: item.mensajeEspecial,
                colorGlaseado: item.colorGlaseado
            })),
            cliente: {
                ...formData,
                direccion: direccionCompleta
            },
            pago: { metodo: metodoPago }
        };

        try {
            // 4. PETICIÓN AL SERVIDOR
            const response = await fetch(`${API_BASE_URL}/pedidos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            });

            if (!response.ok) {
                throw new Error('Error al guardar el pedido');
            }

            const savedOrder = await response.json();

            // 5. NAVEGACIÓN EXITOSA
            navigate('/confirmacion', { state: { orden: savedOrder } });

        } catch (error) {
            console.error("Error al procesar el pedido:", error);
            addToast("Hubo un problema al procesar tu pedido. Inténtalo nuevamente.", "error");
        }
    };

    return (
        <div className="container mx-auto py-12 px-4">
            <Breadcrumb links={breadcrumbLinks} currentPage="Checkout" />
            <PageHeader title="Finalizar Compra" subtitle="Completa tu pedido de manera segura" />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
                    <div className="lg:col-span-2 space-y-8">
                        
                        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-2xl font-bold text-dark mb-4 flex items-center gap-2">
                                <i className="fa-solid fa-truck text-primary"></i> Información de Entrega
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Nombre completo *" name="nombre" type="text" value={formData.nombre} onChange={handleChange} error={errors.nombre} />
                                <InputField label="Teléfono *" name="telefono" type="tel" maxLength={9} placeholder="Ej: 912345678" value={formData.telefono} onChange={handleChange} error={errors.telefono} />
                            </div>
                            <InputField label="Correo electrónico *" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />
                            
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-8">
                                    <InputField label="Calle *" name="calle" type="text" maxLength={50} value={formData.calle} onChange={handleChange} error={errors.calle} />
                                </div>
                                <div className="col-span-4">
                                    <InputField label="Número *" name="numero" type="text" maxLength={10} value={formData.numero} onChange={handleChange} error={errors.numero} />
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
                                    min={minDate} max={maxDate}
                                    error={errors.fechaEntrega}
                                />
                                <small className="text-gray-500 -mt-3 block">
                                    Puedes agendar hasta el {maxDateObj.toLocaleDateString('es-CL')}.
                                </small>
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
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