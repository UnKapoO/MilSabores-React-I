import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// 1. Hooks de Contexto
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext'; // Usamos useCart para el 'addToast'

// 2. Componentes de UI (LEGOs)
import { AuthCard } from '../../components/ui/AuthCard'; // Asegúrate de tener este componente
import { InputField } from '../../components/ui/common/InputField';
import { Button } from '../../components/ui/common/Button';

// 3. Tipos
import type { User } from '../../types/User';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth(); 
    const { addToast } = useCart(); // Usamos la notificación del carrito (la versión revertida)

    // Estados del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 4. Petición a la API (Búsqueda exacta de usuario y contraseña)
            // json-server devuelve un array con las coincidencias
            const response = await fetch(`http://localhost:3001/usuarios?email=${email}&password=${password}`);
            
            if (!response.ok) throw new Error('Error en la conexión con el servidor');
            
            const users: User[] = await response.json();

            if (users.length > 0) {
                // --- CASO ÉXITO ---
                const userFound = users[0];
                
                // A. Guardamos la sesión
                login(userFound);
                
                // B. Notificamos
                addToast(`¡Bienvenido de nuevo, ${userFound.nombre || 'Usuario'}!`, 'success');

                // C. Redirigimos según el rol
                if (userFound.rol === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/catalogo'); // O '/' si prefieres
                }

            } else {
                // --- CASO ERROR (Credenciales inválidas) ---
                addToast('Correo electrónico o contraseña incorrectos.', 'error');
            }

        } catch (error) {
            console.error("Error de login:", error);
            addToast('Ocurrió un error al intentar iniciar sesión.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[80vh]">
            {/* Usamos el AuthCard para mantener el estilo consistente */}
            <AuthCard
                title="Iniciar Sesión"
                subtitle="Bienvenido de vuelta a Mil Sabores"
                footerText="¿No tienes una cuenta?"
                footerLinkText="Crear cuenta nueva"
                footerLinkTo="/registro"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    
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
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <label className="flex items-center gap-2 text-letra-cafe cursor-pointer">
                            <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                            Recordarme
                        </label>
                        <a href="#" className="text-primary font-bold hover:underline">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-4"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <i className="fa-solid fa-spinner fa-spin"></i> Cargando...
                            </span>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </Button>

                </form>
            </AuthCard>
        </div>
    );
}

export default LoginPage;