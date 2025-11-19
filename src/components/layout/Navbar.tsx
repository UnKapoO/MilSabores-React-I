import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
    return(
        <nav className='w-full bg-black p-4 text-white shadow-md'>
            <div className='container mx-auto flex justify-between items-center'>
                {/* Logo */}
                <Link to='/' className='font-bold text-2xl'>
                Mil Sabores
                </Link>
                {/* Links navegación */}
                <div className='hidden md:flex gap-6'>
                    <Link to='/' className='hover:text-pink-200'>Inicio</Link>
                    <Link to='/catalogo' className='hover:text-pink-200'>Catálogo</Link>
                    <Link to='/blog' className='hover:text-pink-200'>Blog</Link>
                </div>
                {/* Íconos */}
                <div className='flex gap-4'>
                    <Link to='/login' className='hover:text-pink-200'>
                    <i className='fa-solid fa-user'></i>
                    </Link>
                    <Link to='/carrito' className='hover:text-pink-200'>
                    <i className='fa-solid fa-cart-shopping'></i>
                    </Link>
                </div>
            </div>

        </nav>
    )
}