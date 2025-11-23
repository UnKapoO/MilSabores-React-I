import React from 'react';

interface MenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MenuToggle: React.FC<MenuToggleProps> = ({ isOpen, onToggle }) => (
  // 1. Clases de posición: 'fixed' y 'z-[100]' para que flote sobre todo.
  // 2. Clases de visibilidad: 'lg:hidden' (solo visible en móviles).
  <button
    onClick={onToggle}
    className={`lg:hidden fixed top-4 left-4 z-[100] p-3 rounded-full bg-primary text-white shadow-lg transition-transform duration-300 ${
      // 3. Movemos el botón cuando la sidebar está abierta (efecto 'push')
      isOpen ? 'translate-x-64' : '' 
    }`}
    title={isOpen ? "Cerrar menú" : "Abrir menú"}
  >
    <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
  </button>
);

export default MenuToggle;