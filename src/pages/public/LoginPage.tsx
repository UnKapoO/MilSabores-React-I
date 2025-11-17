//EJEMPLO DE CÓMO SE USA EL BUTTON E INPUTFIELD

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '../../components/ui/common/Button';
import { InputField } from '../../components/ui/common/InputField';
// ------------------------------------------

// (Probablemente también importaremos AuthCard.tsx más adelante)

function LoginPage() {

    // --- 1. "Memoria" para guardar lo que el usuario escribe ---
    // Creamos un "estado" para el email y otro para la contraseña
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Evita que la página se recargue
        console.log("Datos del Login:", { email, password });
        // Aquí irá la lógica de 'fetch' para iniciar sesión
    };

    return (
        // Usamos 'flex' de Tailwind para centrar la tarjeta de login
        <div className="flex justify-center items-center py-20 bg-fondo-crema">

            {/* (Aquí iría el <AuthCard> que vimos en el HTML) */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

                <h1 className="font-secundaria text-4xl text-center text-dark mb-4">
                    Iniciar Sesión
                </h1>

                {/* --- 2. Usamos nuestro InputField --- */}
                <InputField
                    label="Correo electrónico"
                    type="email"
                    name="email"
                    placeholder="ejemplo@gmail.com"
                    value={email} // Le pasamos el "estado"
                    onChange={(e) => setEmail(e.target.value)} // Le pasamos la "función" para actualizar el estado
                />

                {/* --- 3. Lo reutilizamos para la contraseña --- */}
                <InputField
                    label="Contraseña"
                    type="password"
                    name="password"
                    placeholder="Tu contraseña"
                    value={password} // Le pasamos el "estado"
                    onChange={(e) => setPassword(e.target.value)} // Le pasamos la "función"
                />

                {/* --- 4. Usamos nuestro Button --- */}
                <Button type="submit" variant="primary" className="w-full mt-4">
                    <i className="fa-solid fa-sign-in-alt mr-2"></i>
                    Iniciar Sesión
                </Button>

                <div className="text-center mt-6">
                    <p className="text-letra-cafe">
                        ¿No tienes una cuenta?
                        <Link to="/registro" className="text-primary font-bold ml-1 hover:underline">
                            Crear cuenta nueva
                        </Link>
                    </p>
                </div>

            </form>
        </div>
    );
}

export default LoginPage;