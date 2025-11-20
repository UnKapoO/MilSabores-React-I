import { describe, test, expect } from 'vitest';
import { formatearPrecio, formatearFecha, obtenerNombreCategoria, obtenerNombreCategoriaBlog } from '../../src/utils/formatters';

describe('Pruebas unitarias: Formatters (precio, fecha, categorías)', () => {

    // --- 1. PRUEBAS DE PRECIO ---
    test('Debe formatear 5000 a pesos chilenos ($5.000)', () => {
        const valor = 5000;
        const resultado = formatearPrecio(valor);
        // normalize() ayuda con los espacios invisibles que a veces pone Intl
        expect(resultado.normalize()).toContain('$5.000');
    });

    test('Debe formatear 0 a $0', () => {
        const resultado = formatearPrecio(0);
        expect(resultado.normalize()).toContain('$0');
    });

    // --- 2. PRUEBAS DE FECHA ---
    test('formatearFecha debe manejar fechas simples, completas y vacías', () => {
        // Caso 1: Fecha simple del blog ("YYYY-MM-DD")
        const fechaSimple = "2024-01-15";
        const resultadoSimple = formatearFecha(fechaSimple);
        // Esperamos que contenga "15" y "2024" (el mes puede variar según idioma del sistema de prueba)
        expect(resultadoSimple).toContain('15');
        expect(resultadoSimple).toContain('2024');

        // Caso 2: Fecha completa de pedido (ISO con hora)
        const fechaCompleta = "2024-02-20T14:30:00.000Z";
        const resultadoCompleto = formatearFecha(fechaCompleta);
        expect(resultadoCompleto).toContain('20');
        expect(resultadoCompleto).toContain('2024');

        // Caso 3: String vacío (El que fallaba antes)
        // Ahora que arreglamos la función, esto debe devolver '' (string vacío)
        expect(formatearFecha('')).toBe('');
    });

    // --- 3. PRUEBAS DE CATEGORÍA DE PRODUCTOS ---
    test('obtenerNombreCategoria debe formatear correctamente', () => {
        expect(obtenerNombreCategoria('tortas-cuadradas')).toBe('Tortas Cuadradas');
        expect(obtenerNombreCategoria('vegana')).toBe('Vegana');
        expect(obtenerNombreCategoria('todas')).toBe('Todas'); // Probamos el fix de mayúscula

        // Caso borde: Categoría desconocida devuelve la misma string
        expect(obtenerNombreCategoria('extraterrestre')).toBe('extraterrestre');
    });

    // --- 4. PRUEBAS DE CATEGORÍA DE BLOG ---
    test('obtenerNombreCategoriaBlog debe devolver el nombre correcto', () => {
        expect(obtenerNombreCategoriaBlog('recetas')).toBe('Recetas');
        expect(obtenerNombreCategoriaBlog('noticias')).toBe('Noticias');
        expect(obtenerNombreCategoriaBlog('todas')).toBe('Todas');

        // Caso default para blog
        expect(obtenerNombreCategoriaBlog('algo-raro')).toBe('General');
    });

});