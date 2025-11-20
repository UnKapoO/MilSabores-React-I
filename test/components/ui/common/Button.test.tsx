import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../../../src/components/ui/common/Button'; // Ajusta la ruta si es necesario

describe('Componente: Button (Cobertura Completa)', () => {

    test('Renderiza texto y maneja el clic', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);

        const btn = screen.getByText('Click Me');
        fireEvent.click(btn);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('Aplica estilos de variante "secondary"', () => {
        render(<Button variant="secondary">Secundario</Button>);
        const btn = screen.getByRole('button');
        // Buscamos una clase específica del estilo secundario (revisar tu Button.tsx)
        expect(btn.className).toContain('bg-acento-rosa');
    });

    test('Aplica estilos de variante "outline"', () => {
        render(<Button variant="outline">Borde</Button>);
        const btn = screen.getByRole('button');
        // Buscamos la clase del borde
        expect(btn.className).toContain('border-2');
    });

    test('Muestra estado deshabilitado', () => {
        render(<Button disabled>Deshabilitado</Button>);
        const btn = screen.getByRole('button');
        expect(btn.hasAttribute('disabled')).toBe(true);
        expect(btn.className).toContain('opacity-50'); // Si usaste esa clase
    });
});