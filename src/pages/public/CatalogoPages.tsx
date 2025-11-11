import React, {useState, useEffect} from 'react';
import { formatearPrecio } from '../utils/formatters';

interface Producto{
    id: number;
    codigo: string;
    categoria: string;
    nombre: string;
    precio: number;
    descripcion: string;
    imagen: string;
    icono: string;
}

export const CatalogoPage: React.FC = () => {
    //Array vacío [], prepara para guardar productos
    const [productos, setProductos] = useState<Producto[]>([]); 
    //Se ejecuta una vez cuando la página carga
    useEffect(() => {
        const fetchProductos = async () => { //función para pedir datos
            try {
                const response = await fetch('http://localhost:3001/productos');
                const data = await response.json();
                setProductos(data); //guardó los productos omg
            } catch (error){
                console.error("Error al cargar productos:", error);
            }
        };
        fetchProductos(); //llamamos a la función
    }, []); //[] significa ejecutar solo una vez, waos

    return(
        <>
            <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-6">Nuestro Catálogo</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
                //Usamos el 'codigo' como 'key'
                <div key={producto.codigo} className="border rounded-lg shadow-lg overflow-hidden flex flex-col">
                <img 
                    src={`/${producto.imagen}`} 
                    alt={producto.nombre} 
                    className="w-full h-48 object-cover" 
                />
                {/* Contenido de la tarjeta con los nuevos campos */}
                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-xl font-semibold mb-2">{producto.nombre}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">{producto.descripcion}</p>
                    <p className="text-lg text-pink-700 font-bold mt-2">
                    {/*Función para formatear el precio*/}
                    {formatearPrecio(producto.precio)}
                    </p>
                    <button className="mt-4 w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700">
                    Agregar al carrito
                    </button>
                </div>
                </div>
            ))}
            </div>
        </div>
        </>
    )
}