import React, { useState, useEffect } from 'react';
import type { Product } from '../../types/Product';
import { formatearPrecio } from '../../utils/formatters';
import { Button } from './common/Button';
import { SelectField } from './common/SelectField';
import { InputField } from './common/InputField';

// Opciones de tamaño de tu JS
const opcionesTamano = [
    { value: "", label: "Selecciona el tamaño *" },
    { value: "0.8", label: "Pequeño (4-6 personas) - 20% menos" },
    { value: "1", label: "Estándar (10-12 personas) - Precio base" },
    { value: "1.3", label: "Grande (12-15 personas) - 30% más" },
    { value: "1.6", label: "Extra Grande (18-20 personas) - 60% más" },
];

// Opciones de color de tu JS
const opcionesColor = [
    { value: "", label: "Selecciona un color *" },
    { value: "blanco", label: "Blanco clásico" },
    { value: "chocolate", label: "Chocolate" },
    { value: "rosa", label: "Rosa" },
    { value: "azul", label: "Azul" },
];

interface PersonalizationFormProps {
    product: Product;
    onAddToCart: (personalizacion: any, precioFinal: number) => void;
    onCancel: () => void;
}

export const PersonalizationForm: React.FC<PersonalizationFormProps> = ({ product, onAddToCart, onCancel }) => {
    // Estados para el formulario
    const [tamano, setTamano] = useState("1"); // Estándar por defecto
    const [mensaje, setMensaje] = useState("");
    const [color, setColor] = useState("");
    const [precioFinal, setPrecioFinal] = useState(product.precio);

    // Estado para los errores (como en tu JS)
    const [errorTamano, setErrorTamano] = useState("");
    const [errorColor, setErrorColor] = useState("");

    // Lógica para calcular el precio (como en tu JS)
    useEffect(() => {
        const multiplicador = parseFloat(tamano) || 1;
        const nuevoPrecio = product.precio * multiplicador;
        setPrecioFinal(nuevoPrecio);
    }, [tamano, product.precio]);

    // Lógica de validación (como en tu JS)
    const handleSubmit = () => {
        setErrorTamano("");
        setErrorColor("");
        let hayErrores = false;

        if (!tamano) {
            setErrorTamano("Debes seleccionar un tamaño");
            hayErrores = true;
        }
        if (!color) {
            setErrorColor("Debes seleccionar un color");
            hayErrores = true;
        }

        if (hayErrores) return;

        // Si pasa la validación, llamamos a la función del padre
        onAddToCart({
            cantidadPersonas: opcionesTamano.find(o => o.value === tamano)?.label,
            mensajeEspecial: mensaje,
            colorGlaseado: color,
        }, precioFinal);
    };

    return (
        <div className="bg-fondo-crema flex flex-col gap-4">
            {/* 1. Preview del Producto */}
            <div className="bg-white flex gap-4 items-center p-4 rounded-lg">
                <img src={`/${product.imagen}`} alt={product.nombre} className="w-20 h-20 rounded-md object-cover" />
                <div>
                    <h4 className="font-bold text-lg text-dark">{product.nombre}</h4>
                    <p className="text-letra-cafe">Precio base: {formatearPrecio(product.precio)}</p>
                </div>
            </div>

            {/* 2. Formulario */}
            <form>
                <SelectField
                    label="Cantidad de Personas"
                    name="tamano"
                    value={tamano}
                    onChange={(e) => setTamano(e.target.value)}
                    options={opcionesTamano}
                />
                {errorTamano && <p className="text-red-500 text-sm -mt-2 mb-2">{errorTamano}</p>}

                <SelectField
                    label="Color del Glaseado"
                    name="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    options={opcionesColor}
                />
                {errorColor && <p className="text-red-500 text-sm -mt-2 mb-2">{errorColor}</p>}

                <InputField
                    label="Mensaje Especial (opcional)"
                    name="mensaje"
                    type="text"
                    placeholder="Ej: Feliz Cumpleaños"
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className="mb-0" // Quitamos margen para el contador
                />
                <small className="text-letra-gris text-xs">{mensaje.length}/50 caracteres</small>
            </form>

            {/* 3. Footer del Formulario */}
            <div className="mt-4">
                <p className="text-2xl font-bold text-dark text-right mb-4">
                    Precio Final: {formatearPrecio(precioFinal)}
                </p>
                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Agregar al Carrito
                    </Button>
                </div>
            </div>
        </div>
    );
};