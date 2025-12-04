import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import { InputField } from '../../components/ui/common/InputField';
import { SelectField, type SelectOption } from '../../components/ui/common/SelectField';
import { Button } from '../../components/ui/common/Button';
import FormPanel from '../../components/ui/admin/FormPanel';
import AdminPageHeader from '../../components/ui/admin/AdminPageHeader';
import ImageUploader from '../../components/ui/admin/ImageUploader';

// Importamos la BASE URL para las imágenes
import { API_BASE_URL } from '../../config/api';

const API_URL = `${API_BASE_URL}/productos`;

// ... (Las definiciones de options y initialFormState están perfectas, déjalas igual) ...
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
  imagenFile: null as File | null,
  imagenUrl: '',
};

type FormDataType = typeof initialFormState;

const AdminCreateProductoPage = () => {
  const params = useParams();
  const productId = params.id;

  const [formData, setFormData] = useState<FormDataType>(initialFormState);
  const [isLoading, setIsLoading] = useState(!!productId);
  const [imageResetKey, setImageResetKey] = useState(0);

  // --- LÓGICA DE CARGA DE DATOS ---
  useEffect(() => {
    if (!productId) return;

    const fetchProductForEdit = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/${productId}`);
        if (!response.ok) throw new Error('Producto no encontrado para edición');
        
        const data = await response.json();

        setFormData({
          ...data,
          imagenUrl: data.imagen || '',
          imagenFile: null,
          // Mapeamos SKU del backend a 'codigo' del frontend si es necesario
          codigo: data.sku || '', 
        });
      } catch (error) {
        console.error("Error al cargar producto para edición:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductForEdit();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue: string | number = type === 'number' ? parseFloat(value) : value;
    setFormData(prevData => ({ ...prevData, [name]: finalValue }));
  };

  const handleImageSelect = (file: File | null) => {
    setFormData(prevData => ({ ...prevData, imagenFile: file }));
  };
  
  // --- LÓGICA DE ENVÍO (TU VERSIÓN CORREGIDA Y ÚNICA) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        let finalImageUrl = formData.imagenUrl; 

        // 1. SUBIDA DE IMAGEN
        if (formData.imagenFile) {
            const uploadData = new FormData();
            uploadData.append('file', formData.imagenFile);

            const uploadRes = await fetch(`${API_BASE_URL}/media/upload`, {
                method: 'POST',
                body: uploadData, 
            });

            if (!uploadRes.ok) throw new Error('Error al subir la imagen al servidor');
            
            const responseData = await uploadRes.json();
            finalImageUrl = responseData.url; 
        }

        // 2. PREPARACIÓN DE DATOS
        const dataToSend = { 
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            // historia: formData.historia, // Descomenta si agregaste este campo en Java
            sku: formData.codigo, // Enviamos 'sku' como espera el Backend
            categoria: formData.categoria,
            estado: formData.estado,
            precio: formData.precio,
            descuento: formData.descuento,
            stock: formData.stock,
            imagen: finalImageUrl, 
        };
        
        const method = productId ? 'PATCH' : 'POST'; 
        const url = productId ? `${API_URL}/${productId}` : API_URL;

        // 3. GUARDADO DE PRODUCTO
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend), 
        });

        if (!response.ok) throw new Error(`Error al guardar producto: ${response.status}`);
        
        const successMessage = productId ? 'actualizado' : 'creado';
        alert(`🎉 Producto ${successMessage} con éxito!`);
        
        if (!productId) {
            setFormData(initialFormState);
            setImageResetKey(prev => prev + 1);
        }

    } catch (error) {
        console.error("Fallo al guardar:", error);
        alert(`🔴 Error: ${error}`);
    } finally {
        setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // AQUÍ ESTABA EL ERROR: BORRÉ EL BLOQUE DE CÓDIGO DUPLICADO QUE HABÍA AQUÍ
  // ----------------------------------------------------
  
  // Helper para la previsualización en el ImageUploader
  const getPreviewUrl = () => {
    if (!formData.imagenUrl) return undefined;
    if (formData.imagenUrl.startsWith('http')) return formData.imagenUrl;
    // IMPORTANTE: Concatenamos la base URL para que se vea la foto del backend
    return `${API_BASE_URL}/${formData.imagenUrl}`; 
  };

  const pageTitle = productId ? 'Editar Producto' : 'Nuevo Producto';
  const buttonText = productId ? 'Guardar Cambios' : 'Guardar Producto';

  if (isLoading && productId) {
      return <AdminLayout><div className="p-20 text-center text-primary">Cargando producto...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <AdminPageHeader title={pageTitle} subtitle="Administra los detalles y precios del catálogo." />

      <form onSubmit={handleSubmit} encType='multipart-form/data'>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <FormPanel title="Información Principal del Producto">
              <InputField label="Nombre del Producto" type="text" name="nombre" placeholder="Ej: Torta de Chocolate" value={formData.nombre} onChange={handleChange as any} />
              <InputField label="Descripción" type="text" name="descripcion" placeholder="Describe el producto..." value={formData.descripcion} onChange={handleChange as any} />
              <InputField label="Historia" type="text" name="historia" placeholder="Historia del producto" value={formData.historia} onChange={handleChange as any} />
            </FormPanel>

            <FormPanel title="Precio y Stock">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label="Precio Base" type="number" name="precio" placeholder="10000" value={formData.precio} onChange={handleChange as any} min="0" />
                <InputField label="Descuento" type="number" name="descuento" placeholder="1000" value={formData.descuento} onChange={handleChange as any} min="0" />
                <InputField label="Stock" type="number" name="stock" placeholder="100" value={formData.stock} onChange={handleChange as any} min="0" />
              </div>
            </FormPanel>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <FormPanel title="Organización">
              <InputField label="ID / SKU" type="text" name="codigo" value={formData.codigo} onChange={handleChange as any} />
              <SelectField label="Categoría" name="categoria" value={formData.categoria} onChange={handleChange as any} options={categoriasOptions} />
              <SelectField label="Estado" name="estado" value={formData.estado} onChange={handleChange as any} options={estadoOptions} />
            </FormPanel>

            <FormPanel title="Imagen del Producto">
              <ImageUploader 
                key={imageResetKey} 
                onImageSelect={handleImageSelect}
                // AQUÍ USAMOS LA FUNCIÓN HELPER CORREGIDA
                initialPreviewUrl={getPreviewUrl()}
              />
            </FormPanel>
          </div>
        </div>

        <div className="mt-8 text-right">
          <Button type="submit" variant="primary">
            <i className="fa-solid fa-save mr-2"></i> {buttonText}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminCreateProductoPage;