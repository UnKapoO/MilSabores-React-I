import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext'; // Para usar addToast

// Importamos los LEGOs
import { AuthCard } from '../../components/ui/AuthCard';
import { InputField } from '../../components/ui/common/InputField';
import { Button } from '../../components/ui/common/Button';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth(); // Saca la función 'login' del cerebro
    const { addToast } = useCart(); // Usamos el sistema de toasts que ya hicimos

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- FUNCIÓN DE LOGIN ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Buscamos el usuario en json-server
            // (Json-server permite buscar por email así: ?email=...)
            const response = await fetch(`http://localhost:3001/usuarios?email=${email}`);
            const users = await response.json();

            if (users.length === 0) {
                addToast('Error: El usuario no está registrado', 'error');
                setIsLoading(false);
                return;
            }

            const user = users[0];

            // 2. Verificamos la contraseña (¡OJO! En frontend esto es inseguro, pero para la tarea sirve)
            if (user.password !== password) {
                addToast('Error: La contraseña es incorrecta', 'error');
                setIsLoading(false);
                return;
            }

            // 3. Login Exitoso
            login(user); // Guardamos en el contexto
            addToast(`¡Bienvenido ${user.nombre || 'Usuario'}!`, 'success');

            // 4. Redirigimos al Home o Catálogo
            navigate('/catalogo');

        } catch (error) {
            console.error("Error de login:", error);
            addToast('Error de conexión con el servidor', 'error');
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
                    />

                    <div className="relative">
                        <InputField
                            label="Contraseña"
                            name="password"
                            type="password"
                            placeholder="Tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* (Podríamos agregar botón de "ver contraseña" aquí si quisieras) */}
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center gap-2 text-letra-cafe cursor-pointer">
                            <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                            Recordarme
                        </label>
                        <a href="#" className="text-primary hover:underline">¿Olvidaste tu contraseña?</a>
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-2"
                        disabled={isLoading} // Deshabilita si está cargando
                    >
                        {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                    </Button>

                </form>
            </AuthCard>
        </div>
    );
}

export default LoginPage;