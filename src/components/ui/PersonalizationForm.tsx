import React, { useState, useEffect } from 'react';
import type { Product } from '../../types/Product';
import { formatearPrecio, getImageUrl} from '../../utils/formatters';
import { Button } from './common/Button';
import { SelectField } from './common/SelectField';
import { InputField } from './common/InputField';

// Opciones de tamaño
const opcionesTamano = [
    { value: "", label: "Selecciona el tamaño *" },
    { value: "0.8", label: "Pequeño (4-6 personas) - 20% menos" },
    { value: "1", label: "Estándar (10-12 personas) - Precio base" },
    { value: "1.3", label: "Grande (12-15 personas) - 30% más" },
    { value: "1.6", label: "Extra Grande (18-20 personas) - 60% más" },
];

// Opciones de color
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
    // Estados del formulario
    const [tamano, setTamano] = useState("1");
    const [mensaje, setMensaje] = useState("");
    const [color, setColor] = useState("");
    const [precioFinal, setPrecioFinal] = useState(product.precio);

    // Estados de error
    const [errorTamano, setErrorTamano] = useState("");
    const [errorColor, setErrorColor] = useState("");
    const [errorMensaje, setErrorMensaje] = useState(""); // <-- ¡Error para el mensaje!

    // Cálculo de precio
    useEffect(() => {
        const multiplicador = parseFloat(tamano) || 1;
        setPrecioFinal(product.precio * multiplicador);
    }, [tamano, product.precio]);

    // Validación y Envío
    const handleSubmit = () => {
        // 1. Limpiar errores previos
        setErrorTamano("");
        setErrorColor("");
        setErrorMensaje("");

        let hayErrores = false;

        if (!tamano) {
            setErrorTamano("Debes seleccionar un tamaño");
            hayErrores = true;
        }
        if (!color) {
            setErrorColor("Debes seleccionar un color");
            hayErrores = true;
        }

        // Validación ESTRICTA del mensaje
        if (mensaje.length > 50) {
            setErrorMensaje("El mensaje es demasiado largo (máx 50 caracteres)");
            hayErrores = true;
        }

        if (hayErrores) return;

        // Si todo está bien, enviamos
        onAddToCart({
            cantidadPersonas: opcionesTamano.find(o => o.value === tamano)?.label,
            mensajeEspecial: mensaje,
            colorGlaseado: color,
        }, precioFinal);
    };

    return (
        <div className="bg-fondo-crema flex flex-col gap-4"> {/* <-- Fondo Crema si lo querías aquí */}

            {/* 1. Preview del Producto */}
            <div className="bg-white flex gap-4 items-center p-4 rounded-lg border border-gray-200">
                <img src={getImageUrl(product.imagen)} alt={product.nombre} className="w-20 h-20 rounded-md object-cover" />
                <div>
                    <h4 className="font-bold text-lg text-dark">{product.nombre}</h4>
                    <p className="text-letra-cafe">Precio base: {formatearPrecio(product.precio)}</p>
                </div>
            </div>

            {/* 2. Formulario */}
            <form className="space-y-2"> 

                {/* Tamaño */}
                <div>
                    <SelectField
                        label="Cantidad de Personas"
                        name="tamano"
                        value={tamano}
                        onChange={(e) => setTamano(e.target.value)}
                        options={opcionesTamano}
                        className="mb-1" // Menos margen para mostrar el error cerca
                    />
                    {errorTamano && <p className="text-red-500 text-sm mb-2">{errorTamano}</p>}
                </div>

                {/* Color */}
                <div>
                    <SelectField
                        label="Color del Glaseado"
                        name="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        options={opcionesColor}
                        className="mb-1"
                    />
                    {errorColor && <p className="text-red-500 text-sm mb-2">{errorColor}</p>}
                </div>

                {/* Mensaje (Con validación y contador) */}
                <div>
                    <InputField
                        label="Mensaje Especial (opcional)"
                        name="mensaje"
                        type="text"
                        placeholder="Ej: Feliz Cumpleaños"
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        className="mb-1"
                    // maxLength={50} // Lo quitamos para permitir que el usuario se equivoque y vea el error rojo
                    />

                    {/* Contador de caracteres inteligente */}
                    <div className="flex justify-between text-xs px-1">
                        <span className={`${mensaje.length > 50 ? 'text-red-500 font-bold' : 'text-letra-gris'}`}>
                            {mensaje.length}/50 caracteres
                        </span>
                        {/* Mensaje de error visual */}
                        {mensaje.length > 50 && (
                            <span className="text-red-500 font-bold">¡Límite excedido!</span>
                        )}
                    </div>
                    {/* Mensaje de error formal (si intenta enviar) */}
                    {errorMensaje && <p className="text-red-500 text-sm mt-1">{errorMensaje}</p>}
                </div>

            </form>

            {/* 3. Footer del Formulario */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-2xl font-bold text-dark text-right mb-4">
                    Precio Final: <span className="text-primary">{formatearPrecio(precioFinal)}</span>
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