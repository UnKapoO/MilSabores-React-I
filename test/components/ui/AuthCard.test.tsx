import React from 'react';
import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AuthCard } from '../../../src/components/ui/AuthCard';
import { BrowserRouter } from 'react-router-dom';

describe('Componente: AuthCard (Snapshot)', () => {
    test('Debe mantener su estructura visual (Snapshot)', () => {
        // Renderizamos el componente dentro de BrowserRouter porque usa <Link>
        const view = render(
            <BrowserRouter>
                <AuthCard
                    title="Título de Prueba"
                    subtitle="Subtítulo de prueba"
                    footerText="Texto pie"
                    footerLinkText="Link pie"
                    footerLinkTo="/test"
                >
                    <form>
                        <input type="text" placeholder="Input de prueba" />
                    </form>
                </AuthCard>
            </BrowserRouter>
        );

        // Esto creará una carpeta __snapshots__ la primera vez
        expect(view).toMatchSnapshot();
    });
});