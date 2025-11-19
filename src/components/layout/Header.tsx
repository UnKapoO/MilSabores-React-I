import React, { useState } from 'react'; // Importamos useState para un pequeño menú dropdown si quieres
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // <-- 1. IMPORTAMOS AUTH

function Header() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user, logout } = useAuth(); // <-- 2. SACAMOS EL USUARIO Y LOGOUT

  const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Header Superior */}
      <div className="bg-acento-rosa shadow-sm">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          {/* Info Contacto */}
          <div className="hidden md:flex items-center gap-2 text-letra-cafe">
            <i className="fa-solid fa-phone"></i>
            <span>Soporte al cliente</span>
            <span className="font-bold">+56 9 99999999</span>
          </div>

          {/* Logo Principal */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/img/logo.jpg" alt="logo" className="h-10 w-10 rounded-full" />
            <span className="font-secundaria text-3xl text-dark">Mil Sabores</span>
          </Link>

          {/* Usuario y Carrito */}
          <div className="flex items-center gap-6">

            {/* --- 3. LÓGICA DE USUARIO --- */}
            {user ? (
              // A. SI ESTÁ LOGUEADO: Muestra Nombre y Botón Salir
              <div className="flex items-center gap-4">
                <Link to="/perfil" className="flex items-center gap-2 text-letra-cafe hover:text-primary group">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {/* Inicial del nombre */}
                    {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="font-bold group-hover:underline">
                    {user.nombre?.split(' ')[0]} {/* Solo el primer nombre */}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-700 font-medium"
                  title="Cerrar Sesión"
                >
                  <i className="fa-solid fa-right-from-bracket text-lg"></i>
                </button>
              </div>
            ) : (
              // B. SI NO ESTÁ LOGUEADO: Muestra Link al Login
              <Link to="/login" className="flex items-center gap-2 text-letra-cafe hover:text-primary">
                <i className="fa-solid fa-user text-xl"></i>
              </Link>
            )}
            {/* ---------------------------- */}

            <Link to="/carrito" className="flex items-center gap-2 text-letra-cafe hover:text-primary relative">
              <i className="fa-solid fa-cart-shopping text-xl"></i>
              <span className="hidden md:inline">Carrito</span>

              {totalItems > 0 && (
                <span className="bg-acento-rosa text-letra-cafe text-xs font-bold rounded-full 
                                h-5 w-5 flex items-center justify-center absolute -top-2 -right-2">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Header Inferior (Navegación) */}
      <div className="bg-letra-cafe h-12 flex justify-center items-center shadow-md">
        <nav className="flex gap-8 font-bold text-fondo-crema uppercase text-sm">
          <Link to="/" className="hover:text-primary">Inicio</Link>
          <Link to="/catalogo" className="hover:text-primary">Catálogo</Link>
          <Link to="/catalogo?categoria=especiales" className="hover:text-primary">Tortas Especiales</Link>
          <Link to="/blog" className="hover:text-primary">Blog</Link>
          {/* Si es admin, podríamos mostrar un link al Dashboard aquí */}
          {user?.rol === 'admin' && (
            <Link to="/admin" className="text-acento-cafe hover:text-dark">Administración</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
export default Header;