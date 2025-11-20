import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectField } from '../../../../src/components/ui/common/SelectField';

const opcionesPrueba = [
    { value: "opcion1", label: "Opción 1" },
    { value: "opcion2", label: "Opción 2" }
];

describe('Componente: SelectField', () => {

    test('Debe renderizar las opciones correctamente', () => {
        const handleChange = vi.fn();

        render(
            <SelectField
                label="Prueba Select"
                name="test"
                value=""
                onChange={handleChange}
                options={opcionesPrueba}
            />
        );

        // Verifica que el label existe
        expect(screen.getByText("Prueba Select")).toBeDefined();

        // Verifica que las opciones están ahí
        expect(screen.getByText("Opción 1")).toBeDefined();
        expect(screen.getByText("Opción 2")).toBeDefined();
    });

    test('Debe aplicar borde rojo si hay error', () => {
        const handleChange = vi.fn();

        // Renderizamos con error
        const { container } = render(
            <SelectField
                label="Error Select"
                name="test"
                value=""
                onChange={handleChange}
                options={opcionesPrueba}
                error="Campo requerido"
            />
        );

        // Buscamos el mensaje de error
        expect(screen.getByText("Campo requerido")).toBeDefined();

        // Buscamos el select y verificamos la clase de error (border-red-500)
        // (Usamos querySelector para buscar por etiqueta 'select')
        const selectElement = container.querySelector('select');
        expect(selectElement?.className).toContain('border-red-500');
    });
});