import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InputField } from '../../../../src/components/ui/common/InputField';

describe('Componente: InputField', () => {

    test('Debe mostrar el mensaje de error cuando la prop "error" existe', () => {
        // Creamos una función falsa (mock) para el onChange
        const handleChange = vi.fn();

        render(
            <InputField
                label="Correo"
                name="email"
                type="email"
                value=""
                onChange={handleChange}
                error="El correo es inválido" // <-- ¡Forzamos el error!
            />
        );

        // Verificamos que el texto del error aparezca en pantalla
        const mensajeError = screen.getByText("El correo es inválido");
        expect(mensajeError).toBeDefined();

        // Verificamos que sea de color rojo (clase de tailwind)
        expect(mensajeError.className).toContain('text-red-500');
    });
});