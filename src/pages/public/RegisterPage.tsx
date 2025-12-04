import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Para los Toasts

// Importamos los LEGOs
import { AuthCard } from '../../components/ui/AuthCard';
import { InputField } from '../../components/ui/common/InputField';
import { Button } from '../../components/ui/common/Button';

// Importamos la configuración de la API (Spring Boot)
import { ENDPOINTS } from '../../config/api';

function RegisterPage() {
    const navigate = useNavigate();
    const { addToast } = useCart();

    // --- Estados del Formulario ---
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        repass: '',
        cupon: '',
        fechaNacimiento: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // --- Fecha máxima (Hoy) para el input de nacimiento ---
    const today = new Date().toISOString().split('T')[0];

    // --- Manejador de Cambios ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar error al escribir para mejorar UX
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // --- LÓGICA DE VALIDACIÓN LOCAL (Visual) ---
    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        // 1. Validar Nombre
        const soloLetrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
        if (!formData.nombre.trim()) {
            newErrors.nombre = "El nombre es obligatorio.";
        } else if (!soloLetrasRegex.test(formData.nombre)) {
            newErrors.nombre = "El nombre solo puede contener letras.";
        } else if (formData.nombre.length > 30) {
            newErrors.nombre = "El nombre es demasiado largo (máx 30).";
        }

        // 2. Validar Correo
        const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!formData.email.trim()) {
            newErrors.email = "El correo es obligatorio.";
        } else if (!regexEmail.test(formData.email)) {
            newErrors.email = "Ingrese un correo válido.";
        }

        // 3. Validar Contraseña
        if (!formData.password) {
            newErrors.password = "La contraseña es obligatoria.";
        } else if (formData.password.length < 6) {
            newErrors.password = "Mínimo 6 caracteres.";
        }

        // 4. Validar Confirmación
        if (formData.password !== formData.repass) {
            newErrors.repass = "Las contraseñas no coinciden.";
        }

        // 5. Validar Fecha (No futuro)
        if (formData.fechaNacimiento && formData.fechaNacimiento > today) {
            newErrors.fechaNacimiento = "La fecha no puede ser futura.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- ENVÍO A SPRING BOOT ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validación Visual
        if (!validate()) {
            addToast("Por favor corrige los errores", "error");
            return;
        }

        setIsLoading(true);

        // 2. Preparar objeto para Java (User Entity)
        const newUser = {
            nombre: formData.nombre,
            email: formData.email,
            password: formData.password,
            rol: 'cliente', // Rol por defecto
            fechaNacimiento: formData.fechaNacimiento,
            // Enviamos el cupón (si el backend lo soporta, bien; si no, lo ignorará)
            // cuponUsado: formData.cupon 
        };

        try {
            // 3. POST al Backend Real
            const response = await fetch(ENDPOINTS.AUTH_REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                // ÉXITO
                const msg = await response.text(); // "Usuario registrado exitosamente"
                addToast(msg || "¡Cuenta creada con éxito!", "success");

                // Redirigir al Login
                setTimeout(() => navigate('/login'), 2000);

            } else {
                // ERROR DEL SERVIDOR (Ej: Email duplicado)
                const errorMsg = await response.text();
                console.error("Error del server:", errorMsg);

                if (errorMsg.toLowerCase().includes("email") || errorMsg.toLowerCase().includes("correo")) {
                    setErrors(prev => ({ ...prev, email: "Este correo ya está registrado" }));
                }

                addToast(`Error: ${errorMsg}`, "error");
            }

        } catch (error) {
            console.error("Error de red:", error);
            addToast("No se pudo conectar con el servidor", "error");
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
                        label="Nombre Completo *"
                        name="nombre"
                        type="text"
                        placeholder="Ej: Juan Pérez"
                        value={formData.nombre}
                        onChange={handleChange}
                        error={errors.nombre}
                        maxLength={30}
                    />

                    <InputField
                        label="Correo Electrónico *"
                        name="email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="Contraseña *"
                            name="password"
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                        />
                        <InputField
                            label="Repetir contraseña *"
                            name="repass"
                            type="password"
                            placeholder="Repite tu contraseña"
                            value={formData.repass}
                            onChange={handleChange}
                            error={errors.repass}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="Fecha de Nacimiento"
                            name="fechaNacimiento"
                            type="date"
                            max={today} // Bloquea futuro en el calendario
                            value={formData.fechaNacimiento}
                            onChange={handleChange}
                            error={errors.fechaNacimiento}
                        />
                        <InputField
                            label="Cupón (Opcional)"
                            name="cupon"
                            type="text"
                            placeholder="Ej: FELICES50"
                            value={formData.cupon}
                            onChange={handleChange}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creando cuenta...' : 'Registrar'}
                    </Button>

                </form>
            </AuthCard>
        </div>
    );
}

export default RegisterPage;