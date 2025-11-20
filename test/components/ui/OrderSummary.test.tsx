import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrderSummary } from '../../../src/components/ui/OrderSummary';

describe('Componente: OrderSummary', () => {

    test('Debe mostrar los totales correctamente formateados', () => {
        render(
            <OrderSummary
                subtotal={11111}
                envio={2222}
                descuento={0}
                total={13333}
                buttonText="Pagar"
                onButtonClick={() => { }}
            />
        );

        // Verificamos que los números aparezcan en pantalla (formato chileno aproximado)
        // Usamos una expresión regular para ser flexibles con los puntos/comas
        expect(screen.getByText(/11.?111/)).toBeDefined(); // Subtotal
        expect(screen.getByText(/2.?222/)).toBeDefined();  // Envio
        expect(screen.getByText(/13.?333/)).toBeDefined(); // Total
    });

    test('NO debe mostrar el input de descuento si no se pasan las props (Caso Checkout)', () => {
        render(
            <OrderSummary
                subtotal={100} envio={0} descuento={0} total={100}
                buttonText="Pagar"
                onButtonClick={() => { }}
            // No pasamos onPromoChange, así que el input debería estar oculto
            />
        );

        // Intentamos buscar el texto "Código de Descuento"
        const labelPromo = screen.queryByText("Código de Descuento");
        // Esperamos que sea NULL (no existe)
        expect(labelPromo).toBeNull();
    });
});