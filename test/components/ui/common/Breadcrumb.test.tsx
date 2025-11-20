import React from 'react';
import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Breadcrumb } from '../../../../src/components/ui/common/Breadcrumb';

describe('Componente: Breadcrumb (Snapshot)', () => {
    test('Debe renderizar correctamente la ruta de navegación', () => {
        const links = [
            { to: "/", label: "Inicio" },
            { to: "/catalogo", label: "Catálogo" }
        ];

        const view = render(
            <BrowserRouter>
                <Breadcrumb links={links} currentPage="Torta Chocolate" />
            </BrowserRouter>
        );

        expect(view).toMatchSnapshot();
    });
});