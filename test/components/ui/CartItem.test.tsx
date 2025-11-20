import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CartItem from '../../../src/components/ui/CartItem';

// Mock básico
const itemBase = {
    id: 1, nombre: "Torta", precio: 1000, descripcion: "", imagen: "", categoria: "", codigo: "", icono: "",
    cantidad: 2 // Empezamos con 2 para poder bajar
};

describe('Componente: CartItem (Lógica Completa)', () => {

    test('Botón "+" aumenta la cantidad', () => {
        const handleUpdate = vi.fn();
        render(
            <BrowserRouter>
                <CartItem item={itemBase} onRemove={() => { }} onUpdateCantidad={handleUpdate} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('+'));
        expect(handleUpdate).toHaveBeenCalledWith(1, 3); // 2 + 1 = 3
    });

    test('Botón "-" disminuye la cantidad si es mayor a 1', () => {
        const handleUpdate = vi.fn();
        render(
            <BrowserRouter>
                <CartItem item={itemBase} onRemove={() => { }} onUpdateCantidad={handleUpdate} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('-'));
        expect(handleUpdate).toHaveBeenCalledWith(1, 1); // 2 - 1 = 1
    });

    test('Botón "-" ELIMINA el item si la cantidad es 1', () => {
        const handleRemove = vi.fn();
        const itemUno = { ...itemBase, cantidad: 1 }; // Cantidad 1

        render(
            <BrowserRouter>
                <CartItem item={itemUno} onRemove={handleRemove} onUpdateCantidad={() => { }} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText('-'));
        // No debe llamar a update, debe llamar a REMOVE
        expect(handleRemove).toHaveBeenCalledWith(1);
    });

    test('Botón de Basura elimina el item', () => {
        const handleRemove = vi.fn();
        render(
            <BrowserRouter>
                <CartItem item={itemBase} onRemove={handleRemove} onUpdateCantidad={() => { }} />
            </BrowserRouter>
        );

        // Buscamos el botón por el icono o title
        const trashBtn = screen.getByTitle('Eliminar producto'); // Asegúrate de tener title="Eliminar producto" en tu componente
        fireEvent.click(trashBtn);
        expect(handleRemove).toHaveBeenCalledWith(1);
    });
});