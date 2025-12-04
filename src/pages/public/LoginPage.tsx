import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { AuthCard } from '../../components/ui/AuthCard';
import { InputField } from '../../components/ui/common/InputField';
import { Button } from '../../components/ui/common/Button';

// Importamos la configuración de API
import { ENDPOINTS } from '../../config/api';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { addToast } = useCart();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Estado para errores visuales
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // --- VALIDACIÓN VISUAL (Frontend) ---
        const newErrors: { [key: string]: string } = {};
        if (!email) newErrors.email = "Ingresa tu correo";
        if (!password) newErrors.password = "Ingresa tu contraseña";

        setErrors(newErrors); // Pinta los inputs de rojo si faltan datos
        if (Object.keys(newErrors).length > 0) return; // Detiene todo aquí

        // --- CONEXIÓN REAL (Backend Spring Boot) ---
        setIsLoading(true);

        try {
            const response = await fetch(ENDPOINTS.AUTH_LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                // Si Spring Boot dice 400/401, mostramos error
                throw new Error('Credenciales inválidas');
            }

            const user = await response.json();

            // Login exitoso
            login(user);
            addToast(`¡Bienvenido de nuevo!`, 'success');
            navigate('/catalogo');

        } catch (error) {
            console.error("Error de login:", error);
            addToast('Correo o contraseña incorrectos', 'error');
            // También podemos marcar el input de password en rojo visualmente:
            setErrors({ password: "Credenciales incorrectas" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 flex justify-center">
            <AuthCard
                title="Iniciar Sesión"
                subtitle="Bienvenido de vuelta a Mil Sabores"
                footerText="¿No tienes una cuenta?"
                footerLinkText="Crear cuenta nueva"
                footerLinkTo="/registro"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        placeholder="ejemplo@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email} // <-- ¡AQUÍ SE MUESTRA EL ERROR VISUAL!
                    />

                    <div className="relative">
                        <InputField
                            label="Contraseña"
                            name="password"
                            type="password"
                            placeholder="Tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors.password} 
                        />
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center gap-2 text-letra-cafe cursor-pointer">
                            <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                            Recordarme
                        </label>
                        <button type="button" onClick={() => addToast("Se envió un correo de recuperación", "info")} className="text-primary hover:underline">
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>

                    <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                        {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                    </Button>
                </form>
            </AuthCard>
        </div>
    );
}

export default LoginPage;