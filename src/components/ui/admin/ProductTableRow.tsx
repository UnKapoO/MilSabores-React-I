import React from 'react';
import type { Product } from '../../../types/Product';
import { formatearPrecio, obtenerNombreCategoria } from '../../../utils/formatters';
import { Button } from '../common/Button'; // Usamos tu componente Button

interface ProductTableRowProps {
  product: Product;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ProductTableRow: React.FC<ProductTableRowProps> = ({ product, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-rose-50 transition-colors">

      {/* Columna 1: Imagen y Nombre */}
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={`/${product.imagen}`}
              alt={product.nombre}
            />
          </div>
          <div className="ml-4 truncate">
            <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
            <div className="text-xs text-gray-500">SKU: {product.codigo}</div>
          </div>
        </div>
      </td>

      {/* Columna 2: Categoría */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
          {obtenerNombreCategoria(product.categoria)}
        </span>
      </td>

      {/* Columna 3: Precio */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatearPrecio(product.precio)}
      </td>

      {/* Columna 4: Stock */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.stock ?? 0}
      </td>

      {/* Columna 5: Acciones (Botones) */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {/* 🚨 CORRECCIÓN: Usamos un div flex para el contenedor de botones */}
        <div className="flex justify-end items-center space-x-2">
          <Button
            onClick={() => onEdit(product.id)}
            variant="outline"
            className="text-primary"
            title="Editar producto"
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </Button>
          <Button
            onClick={() => onDelete(product.id)}
            variant="outline"
            className="text-red-500"
            title="Eliminar producto"
          >
            <i className="fa-solid fa-trash"></i>
          </Button>
        </div>
      </td>

    </tr>
  );
};

export default ProductTableRow;