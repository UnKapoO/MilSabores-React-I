import React, { useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom'; 
import AdminLayout from '../../components/layout/admin/AdminLayout';
import { InputField } from '../../components/ui/common/InputField';
import { SelectField, type SelectOption } from '../../components/ui/common/SelectField';
import { Button } from '../../components/ui/common/Button';
import FormPanel from '../../components/ui/admin/FormPanel';
import AdminPageHeader from '../../components/ui/admin/AdminPageHeader';
import ImageUploader from '../../components/ui/admin/ImageUploader';

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
  imagenFile: null as File | null, // Para el objeto File
  imagenUrl: '', // Para la URL existente en modo edición
};

// Definimos el tipo de datos del estado
type FormDataType = typeof initialFormState;


const AdminCreateProductoPage = () => {
  const params = useParams(); // { id: '5' } o {}
  const productId = params.id; // Puede ser '5' o undefined

  const [formData, setFormData] = useState<FormDataType>(initialFormState);
  // El loading solo es necesario en modo edición
  const [isLoading, setIsLoading] = useState(!!productId); 
  // Contador para forzar el reseteo visual de ImageUploader
  const [imageResetKey, setImageResetKey] = useState(0); 

  

  // --- LÓGICA DE CARGA DE DATOS (Para modo Edición) ---
  useEffect(() => {
    if (!productId) return; // Si no hay ID, salimos (Modo Creación)

    const fetchProductForEdit = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/${productId}`);
        if (!response.ok) throw new Error('Producto no encontrado para edición');
        
        const data = await response.json();

        // Mapeamos los datos de la API al estado de nuestro formulario
        setFormData({
          ...data,
          // Guardamos la URL existente, si la hay
          imagenUrl: data.imagen || '',
          // El archivo a subir es nulo por defecto (solo se usa al cambiar)
          imagenFile: null, 
        });
      } catch (error) {
        console.error("Error al cargar producto para edición:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductForEdit();
  }, [productId]); // Se dispara cuando la URL de edición cambia

  // Función genérica para manejar el cambio en Input/Select
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    const finalValue: string | number = type === 'number' ? parseFloat(value) : value;

    setFormData(prevData => ({
      ...prevData,
      [name]: finalValue,
    }));
  };

  // Función para manejar la selección de Imagen
  const handleImageSelect = (file: File | null) => {
    setFormData(prevData => ({
      ...prevData,
      imagenFile: file, // Guardamos el objeto File o null
    }));
  };
  
  // --- LÓGICA DE ENVÍO (POST o PATCH) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Prepara los datos (remueve imagenFile y usa la URL correcta)
    const dataToSend = { 
        ...formData, 
        // Si hay una imagen nueva, usa el nombre del archivo. Si no, usa la URL antigua.
        imagen: formData.imagenFile ? `img/${formData.imagenFile.name}` : formData.imagenUrl,
        // Eliminamos las props de control del estado
        imagenFile: undefined,
        imagenUrl: undefined,
    };
    
    // Determina el método y la URL
    const method = productId ? 'PATCH' : 'POST'; 
    const url = productId ? `${API_URL}/${productId}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend), 
        });

        if (!response.ok) throw new Error(`Error ${method} en la API: Código ${response.status}`);
        
        // Muestra el mensaje de éxito
        const successMessage = productId ? 'actualizado' : 'creado';
        alert(`🎉 Producto ${successMessage} con éxito!`);
        
        // Limpia el formulario y reinicia la clave
        setFormData(initialFormState);
        setImageResetKey(prev => prev + 1);

    } catch (error) {
        alert(`🔴 Error al guardar. Asegúrate que 'npm run server' esté activo.`);
        console.error("Fallo al guardar:", error);
    }
  };

  // ----------------------------------------------------
  // LÓGICA DE RENDERIZADO
  // ----------------------------------------------------
  
  // Título y texto dinámico para el modo Creación/Edición
  const pageTitle = productId ? 'Editar Producto' : 'Nuevo Producto';
  const buttonText = productId ? 'Guardar Cambios' : 'Guardar Producto';

  if (isLoading) {
      return <AdminLayout><div className="p-20 text-center text-primary">Cargando producto...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title={pageTitle}
        subtitle="Administra los detalles y precios del catálogo."
      />

      <form onSubmit={handleSubmit} encType='multipart-form/data'>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna 1 y 2 (8/12) */}
          <div className="lg:col-span-2 space-y-6">
            
            <FormPanel title="Información Principal del Producto">
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
              <ImageUploader 
                key={imageResetKey} 
                onImageSelect={handleImageSelect}
                // Si existe una URL, la pasamos para la previsualización inicial
                initialPreviewUrl={formData.imagenUrl ? `/${formData.imagenUrl}` : undefined}
              />
            </FormPanel>

          </div>
        </div>

        {/* Botón de Guardar */}
        <div className="mt-8 text-right">
          <Button type="submit" variant="primary">
            <i className="fa-solid fa-save mr-2"></i>
            {buttonText} {/* Texto dinámico */}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminCreateProductoPage;