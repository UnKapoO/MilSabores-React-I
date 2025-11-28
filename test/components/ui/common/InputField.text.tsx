import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
// Asegúrate de que la ruta sea correcta (base o common)
import { InputField } from '../../../../src/components/ui/common/InputField';

describe('Componente: InputField (Cobertura Completa)', () => {

    // 1. Prueba del Escenario Normal (Sin error)
    test('Debe renderizar correctamente el label y el input (Estado Normal)', () => {
        const handleChange = vi.fn();

        render(
            <InputField
                label="Nombre"
                name="nombre"
                type="text"
                value=""
                onChange={handleChange}
            // NO pasamos error aquí
            />
        );

        // Verificamos que el label existe
        expect(screen.getByText("Nombre")).toBeDefined();

        // Verificamos que el input tiene el estilo "normal" (gris)
        // Buscamos el input por su etiqueta asociada
        const input = screen.getByLabelText("Nombre");
        expect(input.className).toContain('border-gray-300');

        // Verificamos que NO tenga el estilo de error
        expect(input.className).not.toContain('border-red-500');
    });

    // 2. Prueba del Escenario de Error
    test('Debe mostrar estilos rojos y mensaje cuando hay error', () => {
        const handleChange = vi.fn();
        const errorMsg = "El correo es inválido";

        render(
            <InputField
                label="Correo"
                name="email"
                type="email"
                value=""
                onChange={handleChange}
                error={errorMsg} // <-- ¡Forzamos el error!
            />
        );

        // Verificamos el mensaje de error
        const mensajeError = screen.getByText(errorMsg);
        expect(mensajeError).toBeDefined();
        expect(mensajeError.className).toContain('text-red-500');

        // Verificamos que el input tenga el borde rojo
        const input = screen.getByLabelText("Correo");
        expect(input.className).toContain('border-red-500');
    });

    // 3. Prueba de Interacción (Función)
    test('Debe llamar a onChange cuando el usuario escribe', () => {
        const handleChange = vi.fn();

        render(
            <InputField
                label="Escribir"
                name="test"
                type="text"
                value=""
                onChange={handleChange}
            />
        );

        const input = screen.getByLabelText("Escribir");

        // Simulamos que el usuario escribe "Hola"
        fireEvent.change(input, { target: { value: 'Hola' } });

        // Verificamos que la función se ejecutó
        expect(handleChange).toHaveBeenCalled();
    });
});