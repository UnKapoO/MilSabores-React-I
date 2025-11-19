import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

import { AuthCard } from '../../components/ui/AuthCard';
import { InputField } from '../../components/ui/common/InputField';
import { Button } from '../../components/ui/common/Button';

function RegisterPage() {
    const navigate = useNavigate();
    const { addToast } = useCart();

    // --- Estados del Formulario ---
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        repass: '', // 'confirmPassword' en tu HTML original se llamaba 'repass'
        cupon: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    // Estado para guardar los mensajes de error
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // --- Manejador de Cambios ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar error al escribir para mejorar UX
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // --- LÓGICA DE VALIDACIÓN (Replicando tu JS) ---
    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        // 1. Validar Nombre
        const soloLetrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
        if (!formData.nombre.trim()) {
            newErrors.nombre = "El nombre no puede estar vacío.";
        } else if (!soloLetrasRegex.test(formData.nombre)) {
            newErrors.nombre = "El nombre solo puede contener letras y espacios.";
        } else if (formData.nombre.length > 30) {
            newErrors.nombre = "El nombre es demasiado largo.";
        }

        // 2. Validar Correo
        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!formData.email.trim()) {
            newErrors.email = "El correo es obligatorio.";
        } else if (!regexEmail.test(formData.email)) {
            newErrors.email = "Ingrese un correo válido.";
        }

        // 3. Validar Contraseña
        if (!formData.password.trim()) {
            newErrors.password = "La contraseña es obligatoria.";
        } else if (formData.password.length < 6) {
            newErrors.password = "La contraseña debe contener al menos 6 caracteres.";
        }

        // 4. Validar Confirmación
        if (!formData.repass.trim()) {
            newErrors.repass = "Debes confirmar tu contraseña.";
        } else if (formData.password !== formData.repass) {
            newErrors.repass = "Las contraseñas no coinciden ⛔";
        }

        setErrors(newErrors);
        // Retorna true si NO hay errores (objeto vacío)
        return Object.keys(newErrors).length === 0;
    };

    // --- Envío del Formulario ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Si la validación falla, detenemos todo
        if (!validate()) {
            addToast("Por favor corrige los errores", "error");
            return;
        }

        setIsLoading(true);

        try {
            // 1. Verificar si el usuario ya existe (GET a json-server)
            const checkResponse = await fetch(`http://localhost:3001/usuarios?email=${formData.email}`);
            const existingUsers = await checkResponse.json();

            if (existingUsers.length > 0) {
                setErrors(prev => ({ ...prev, email: "Error: Este correo ya está registrado" }));
                addToast("El correo ya existe", "error");
                setIsLoading(false);
                return;
            }

            // 2. Aplicar lógica de cupones (Tu lógica de negocio)
            let beneficios = [];
            let mensajesExito = ["¡Registro exitoso!"];

            if (formData.cupon.toUpperCase() === 'FELICES50') {
                beneficios.push("10% descuento vitalicio");
                mensajesExito.push("¡Felicidades! Tienes 10% de descuento.");
            }

            // Verificar email institucional (DUOC)
            if (formData.email.includes('@duocuc.cl')) {
                beneficios.push("Torta gratis en cumpleaños");
                mensajesExito.push("¡Estudiante Duoc! Tienes beneficios especiales.");
            }

            // 3. Crear el objeto Usuario
            const newUser = {
                nombre: formData.nombre,
                email: formData.email,
                password: formData.password,
                rol: 'cliente',
                beneficios: beneficios,
                cuponUsado: formData.cupon || null,
                fechaRegistro: new Date().toISOString()
            };

            // 4. Guardar en Base de Datos (POST)
            const saveResponse = await fetch('http://localhost:3001/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (saveResponse.ok) {
                // Mostramos todos los mensajes de éxito acumulados
                mensajesExito.forEach(msg => addToast(msg, "success"));

                // Redirigir al Login después de 2 segundos (como en tu JS original)
                setTimeout(() => navigate('/login'), 2000);
            } else {
                throw new Error("Error al guardar");
            }

        } catch (error) {
            console.error(error);
            addToast("Error de conexión", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 flex justify-center">
            <AuthCard
                title="Crear Cuenta"
                subtitle="Únete a la comunidad de Mil Sabores"
                footerText="¿Ya tienes una cuenta?"
                footerLinkText="Inicia Sesión aquí"
                footerLinkTo="/login"
            >
                <form onSubmit={handleSubmit} className="space-y-4">

                    <InputField
                        label="Nombre Completo"
                        name="nombre"
                        type="text"
                        placeholder="Wacoldo Soto"
                        value={formData.nombre}
                        onChange={handleChange}
                        error={errors.nombre} // Pasamos el error al componente
                    />

                    <InputField
                        label="Correo Electrónico"
                        name="email"
                        type="email"
                        placeholder="ejemplo@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="Contraseña"
                            name="password"
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                        />
                        <InputField
                            label="Reingrese contraseña"
                            name="repass"
                            type="password"
                            placeholder="Repite tu contraseña"
                            value={formData.repass}
                            onChange={handleChange}
                            error={errors.repass}
                        />
                    </div>

                    <InputField
                        label="Código de Descuento (Opcional)"
                        name="cupon"
                        type="text"
                        placeholder="Ej: FELICES50"
                        value={formData.cupon}
                        onChange={handleChange}
                    />

                    <Button
                        type="submit"
                        className="w-full mt-4 bg-acento-rosa hover:bg-acento-rosa text-white" 
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registrando...' : 'Registrar'}
                    </Button>

                </form>
            </AuthCard>
        </div>
    );
}

export default RegisterPage;