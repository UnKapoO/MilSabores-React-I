import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import { InputField } from '../../components/ui/common/InputField';
import { SelectField, type SelectOption } from '../../components/ui/common/SelectField';
import { TextAreaField } from '../../components/ui/common/TextAreaField';
import { Button } from '../../components/ui/common/Button';
import FormPanel from '../../components/ui/admin/FormPanel';
import AdminPageHeader from '../../components/ui/admin/AdminPageHeader';
import ImageUploader from '../../components/ui/admin/ImageUploader';
import { useCart } from '../../context/CartContext'; // Para usar addToast

// Importamos la BASE URL para las imágenes y API
import { API_BASE_URL } from '../../config/api';

const API_URL = `${API_BASE_URL}/productos`;

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
  const navigate = useNavigate();
  const { addToast } = useCart();
  const params = useParams();
  const productId = params.id;

  const [formData, setFormData] = useState<FormDataType>(initialFormState);
  const [isLoading, setIsLoading] = useState(!!productId);
  const [imageResetKey, setImageResetKey] = useState(0);

  // --- CARGA DE DATOS (Edición) ---
  useEffect(() => {
    if (!productId) return;

    const fetchProductForEdit = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/${productId}`);
        if (!response.ok) throw new Error('Producto no encontrado');

        const data = await response.json();
        
        setFormData({
          ...data,
          imagenUrl: data.imagen || '',
          imagenFile: null,
          // Mapeo inteligente: Si viene 'sku' (Java) úsalo, si no usa 'codigo' (json-server)
          codigo: data.sku || data.codigo || '',
        });
      } catch (error) {
        console.error("Error:", error);
        addToast("Error al cargar producto", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductForEdit();
  }, [productId, addToast]);

  // --- MANEJADORES ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? parseFloat(value) : value;
    setFormData(prevData => ({ ...prevData, [name]: finalValue }));
  };

  const handleImageSelect = (file: File | null) => {
    setFormData(prevData => ({ ...prevData, imagenFile: file }));
  };

  // Helper para mostrar la imagen correcta (Backend o Local)
  const getPreviewUrl = () => {
    if (!formData.imagenUrl) return undefined;
    if (formData.imagenUrl.startsWith('http') || formData.imagenUrl.startsWith('data:')) return formData.imagenUrl;
    // Concatenamos la base URL si es una imagen del servidor
    return `${API_BASE_URL}/${formData.imagenUrl}`;
  };

  // --- LÓGICA DE ENVÍO (MEZCLADA: FormData + Validaciones tuyas) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        let finalImageUrl = formData.imagenUrl;

        // 1. SUBIDA DE IMAGEN (Lógica de ella para Spring Boot)
        if (formData.imagenFile) {
            const uploadData = new FormData();
            uploadData.append('file', formData.imagenFile);

            const uploadRes = await fetch(`${API_BASE_URL}/media/upload`, {
                method: 'POST',
                body: uploadData,
            });

            if (!uploadRes.ok) throw new Error('Error al subir la imagen al servidor');
            
            const responseData = await uploadRes.json();
            finalImageUrl = responseData.url; // La URL que devuelve el backend
        }

        // 2. PREPARAR DATOS
        const dataToSend = {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            historia: formData.historia,
            sku: formData.codigo, // Enviamos 'sku' para el backend nuevo
            codigo: formData.codigo, // Mantenemos 'codigo' por compatibilidad
            categoria: formData.categoria,
            estado: formData.estado,
            precio: Number(formData.precio),
            descuento: Number(formData.descuento),
            stock: Number(formData.stock),
            imagen: finalImageUrl,
        };

        // 3. GUARDAR EN BD
        const method = productId ? 'PUT' : 'POST'; // Java suele usar PUT para updates completos
        const url = productId ? `${API_URL}/${productId}` : API_URL;

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) throw new Error(`Error al guardar: ${response.status}`);

        // 4. FEEDBACK (Tu UX)
        const successMessage = productId ? 'actualizado' : 'creado';
        addToast(`Producto ${successMessage} con éxito!`, "success");
        
        // Redirigir
        navigate('/admin/productos');

    } catch (error) {
        console.error("Fallo al guardar:", error);
        addToast("Error al guardar. Revisa la conexión.", "error");
    } finally {
        setIsLoading(false);
    }
  };

  const pageTitle = productId ? 'Editar Producto' : 'Nuevo Producto';
  const buttonText = productId ? 'Guardar Cambios' : 'Guardar Producto';

  if (isLoading && productId) {
      return <AdminLayout><div className="p-20 text-center text-primary">Cargando producto...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <AdminPageHeader title={pageTitle} subtitle="Administra los detalles y precios del catálogo." />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna 1 y 2 */}
          <div className="lg:col-span-2 space-y-6">
            <FormPanel title="Información Principal del Producto">
              <InputField
                label="Nombre del Producto" type="text" name="nombre" placeholder="Ej: Torta de Chocolate"
                value={formData.nombre} onChange={handleChange} />
              
              <TextAreaField
                label="Descripción" name="descripcion" placeholder="Describe el producto..."
                value={formData.descripcion} onChange={handleChange as any} rows={4} />
              
              <TextAreaField
                label="Historia" name="historia" placeholder="Historia del producto"
                value={formData.historia} onChange={handleChange as any} rows={2} />
            </FormPanel>

            <FormPanel title="Precio y Stock">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Precio Base" type="number" name="precio" placeholder="10000"
                  value={formData.precio} onChange={handleChange} min="0" />
                <InputField
                  label="Descuento" type="number" name="descuento" placeholder="0"
                  value={formData.descuento} onChange={handleChange} min="0" />
                <InputField
                  label="Stock" type="number" name="stock" placeholder="100"
                  value={formData.stock} onChange={handleChange} min="0" />
              </div>
            </FormPanel>
          </div>

          {/* Columna 3 */}
          <div className="lg:col-span-1 space-y-6">
            <FormPanel title="Organización">
              <InputField
                label="ID / SKU" type="text" name="codigo"
                value={formData.codigo} onChange={handleChange} />

              <SelectField
                label="Categoría" name="categoria" value={formData.categoria}
                onChange={handleChange as any} options={categoriasOptions} />

              <SelectField
                label="Estado" name="estado" value={formData.estado}
                onChange={handleChange as any} options={estadoOptions} />
            </FormPanel>

            <FormPanel title="Imagen del Producto">
              <ImageUploader 
                key={imageResetKey} 
                onImageSelect={handleImageSelect}
                initialPreviewUrl={getPreviewUrl()}
              />
              <p className="text-xs text-gray-400 mt-2">
                * La imagen se subirá al servidor al guardar.
              </p>
            </FormPanel>
          </div>
        </div>

        <div className="mt-8 text-right pb-10">
          <Button type="submit" variant="primary" disabled={isLoading}>
            <i className="fa-solid fa-save mr-2"></i>
            {isLoading ? 'Guardando...' : buttonText}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminCreateProductoPage;