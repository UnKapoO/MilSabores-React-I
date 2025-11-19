// src/pages/admin/AdminCreateProductoPage.tsx
import React, { useState } from 'react';
import AdminLayout from '../../components/layout/admin/AdminLayout';

// --- Importamos los componentes de la compañera ---
import { InputField } from '../../components/ui/common/InputField';
import { SelectField, type SelectOption } from '../../components/ui/common/SelectField';
import { Button } from '../../components/ui/common/Button';

// --- Importamos nuestros componentes de Admin y el Uploader ---
import FormPanel from '../../components/ui/admin/FormPanel';
import AdminPageHeader from '../../components/ui/admin/AdminPageHeader';
import ImageUploader from '../../components/ui/admin/ImageUploader'; // <-- ¡NUEVO!

// La URL de tu API (json-server)
const API_URL = 'http://localhost:3001/productos';


// --- Definiciones de datos estáticos para SelectField ---
const categoriasOptions: SelectOption[] = [
  { value: 'tortas-cuadradas', label: 'Tortas Cuadradas' },
  { value: 'tortas-circulares', label: 'Tortas Circulares' },
  { value: 'postres-individuales', label: 'Postres Individuales' },
  { value: 'sin-azucar', label: 'Sin Azúcar' },
  { value: 'tradicional', label: 'Tradicional' },
  { value: 'sin-gluten', label: 'Sin Gluten' },
  { value: 'vegana', label: 'Vegana' },
  { value: 'especiales', label: 'Especiales' },
];

const estadoOptions: SelectOption[] = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Oculto' },
];

// --- Estado Inicial del Formulario ---
const initialFormState = {
  nombre: '',
  descripcion: '',
  historia: '',
  codigo: '',
  categoria: 'tortas-cuadradas', 
  estado: 'activo', 
  precio: 0,
  descuento: 0,
  stock: 0,
  imagenFile: null as File | null, // ESTADO PARA EL ARCHIVO
};

type FormDataType = typeof initialFormState;


const AdminCreateProductoPage = () => {
  const [formData, setFormData] = useState<FormDataType>(initialFormState);
  
  // 1. NUEVO ESTADO: Contador para forzar el reseteo visual
  const [imageResetKey, setImageResetKey] = useState(0); 

  // Función genérica para manejar el cambio en Input/Select
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    const finalValue: string | number = type === 'number' ? parseFloat(value) : value;

    setFormData(prevData => ({
      ...prevData,
      [name]: finalValue,
    }));
  };

  // Función específica para manejar el cambio de la Imagen (ImageUploader)
  const handleImageSelect = (file: File | null) => {
    setFormData(prevData => ({
      ...prevData,
      imagenFile: file, 
    }));
  };
  
  // Función que se ejecuta al presionar Guardar (Conexión a la API)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validación de imagen
    if (!formData.imagenFile) {
        alert("Debes seleccionar una imagen para el producto.");
        return;
    }
    
    const newProductData = {
        // ... (otros campos)
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        historia: formData.historia,
        codigo: formData.codigo,
        categoria: formData.categoria,
        estado: formData.estado,
        precio: formData.precio,
        descuento: formData.descuento,
        stock: formData.stock,
        
        // Simulación de la URL de la imagen
        imagen: `img/${formData.imagenFile.name}`, 
        
        rating: 5,
        id: Date.now(), 
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProductData), 
        });

        if (!response.ok) {
            throw new Error(`Error al guardar: Código ${response.status}`);
        }

        const result = await response.json();
        
        // 2. Éxito: Limpiamos el formulario y forzamos el reinicio de la imagen
        alert(`🎉 Producto "${result.nombre}" guardado con ID: ${result.id} en el Catálogo (db.json).`);
        setFormData(initialFormState);      
        setImageResetKey(prev => prev + 1); // <-- ¡LA CLAVE PARA EL RESET VISUAL!

    } catch (error) {
        console.error("Fallo al guardar el producto:", error);
        alert(`🔴 Ocurrió un error al intentar guardar el producto. Asegúrate que 'npm run server' esté activo.`);
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Nuevo Producto"
        subtitle="Rellena la información para añadir un item al catálogo."
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna 1 y 2 (8/12) */}
          <div className="lg:col-span-2 space-y-6">
            
            <FormPanel title="Información Principal del Producto">
              {/* Nombre, Descripción, Historia */}
              <InputField
                label="Nombre del Producto" type="text" name="nombre" placeholder="Ej: Torta de Chocolate Intenso"
                value={formData.nombre} onChange={handleChange as any} />
              <InputField
                label="Descripción" type="text" name="descripcion" placeholder="Describe el producto..."
                value={formData.descripcion} onChange={handleChange as any} />
              <InputField
                label="Historia" type="text" name="historia" placeholder="Historia del producto"
                value={formData.historia} onChange={handleChange as any} />
            </FormPanel>

            <FormPanel title="Precio y Stock">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Precio Base, Descuento y Stock */}
                <InputField
                  label="Precio Base" type="number" name="precio" placeholder="10000"
                  value={formData.precio} onChange={handleChange as any} min="0" />
                <InputField
                  label="Descuento" type="number" name="descuento" placeholder="1000"
                  value={formData.descuento} onChange={handleChange as any} min="0" />
                <InputField
                  label="Stock" type="number" name="stock" placeholder="100"
                  value={formData.stock} onChange={handleChange as any} min="0" />
              </div>
            </FormPanel>
          </div>

          {/* Columna 3 (4/12) */}
          <div className="lg:col-span-1 space-y-6">
            
            <FormPanel title="Organización">
              <InputField
                label="ID / SKU" type="text" name="codigo"
                value={formData.codigo} onChange={handleChange as any} />

              {/* SelectField para Categoría */}
              <SelectField
                label="Categoría" name="categoria" value={formData.categoria}
                onChange={handleChange as any} options={categoriasOptions} />

              {/* SelectField para Estado */}
              <SelectField
                label="Estado" name="estado" value={formData.estado}
                onChange={handleChange as any} options={estadoOptions} />
            </FormPanel>

            <FormPanel title="Imagen del Producto">
              {/* 3. ¡USAMOS LA LLAVE! Esto fuerza la destrucción y creación del componente al resetear. */}
              <ImageUploader 
                key={imageResetKey} 
                onImageSelect={handleImageSelect} 
              />
            </FormPanel>

          </div>
        </div>

        {/* Botón de Guardar */}
        <div className="mt-8 text-right">
          <Button type="submit" variant="primary">
            <i className="fa-solid fa-save mr-2"></i>
            Guardar Producto
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminCreateProductoPage;