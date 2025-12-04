import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Añadí useNavigate
import AdminLayout from '../../components/layout/admin/AdminLayout';
import { InputField } from '../../components/ui/common/InputField'; // Corregí ruta
import { SelectField, type SelectOption } from '../../components/ui/common/SelectField'; // Corregí ruta
import { TextAreaField } from '../../components/ui/common/TextAreaField'; // Asegúrate de tener este
import { Button } from '../../components/ui/common/Button'; // Corregí ruta
import FormPanel from '../../components/ui/admin/FormPanel';
import AdminPageHeader from '../../components/ui/admin/AdminPageHeader';
import ImageUploader from '../../components/ui/admin/ImageUploader';
import { useCart } from '../../context/CartContext'; // Para usar addToast

const API_URL = 'http://localhost:3001/productos';

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

// Definimos el estado inicial
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

const AdminCreateProductoPage = () => {
  const navigate = useNavigate();
  const { addToast } = useCart();
  const params = useParams();
  const productId = params.id;

  const [formData, setFormData] = useState(initialFormState);
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

  // --- FUNCIÓN HELPER: Convertir File a Base64 ---
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // --- ENVÍO DEL FORMULARIO ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. VALIDACIÓN DE NOMBRE REPETIDO
      // (Solo si es nuevo producto o si el nombre cambió)
      // Para simplificar, verificamos siempre.
      const checkRes = await fetch(`${API_URL}?nombre=${formData.nombre}`);
      const foundProducts = await checkRes.json();

      // Si encontramos productos con ese nombre...
      if (foundProducts.length > 0) {
        // Verificamos que NO sea el mismo producto que estamos editando
        const isSameProduct = productId && foundProducts[0].id === productId;

        if (!isSameProduct) {
          addToast("¡Ya existe un producto con ese nombre!", "error");
          setIsLoading(false);
          return; // Detenemos el guardado
        }
      }

      // 2. MANEJO DE IMAGEN (Conversión a Base64)
      let imagenFinal = formData.imagenUrl; // Por defecto, la URL antigua

      if (formData.imagenFile) {
        // Si hay archivo nuevo, lo convertimos
        try {
          imagenFinal = await convertToBase64(formData.imagenFile);
        } catch (error) {
          addToast("Error al procesar la imagen", "error");
          setIsLoading(false);
          return;
        }
      }

      // 3. PREPARAR DATOS
      const dataToSend = {
        ...formData,
        imagen: imagenFinal, // Guardamos el string Base64 (o la URL vieja)
        // Limpiamos campos temporales
        imagenFile: undefined,
        imagenUrl: undefined,
        // Aseguramos tipos numéricos
        precio: Number(formData.precio),
        stock: Number(formData.stock),
        descuento: Number(formData.descuento)
      };

      // 4. GUARDAR (POST o PUT)
      const method = productId ? 'PUT' : 'POST'; // Usamos PUT para reemplazar todo en edición
      const url = productId ? `${API_URL}/${productId}` : API_URL;

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      const successMessage = productId ? 'actualizado' : 'creado';
      addToast(`Producto ${successMessage} con éxito!`, "success");

      // Redirigir a la lista
      navigate('/admin/productos');

    } catch (error) {
      addToast("Error al guardar. Revisa tu conexión.", "error");
      console.error("Fallo al guardar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pageTitle = productId ? 'Editar Producto' : 'Nuevo Producto';
  const buttonText = productId ? 'Guardar Cambios' : 'Guardar Producto';

  if (isLoading && productId) { // Solo mostramos carga si estamos editando al inicio
    return <AdminLayout><div className="p-20 text-center text-primary">Cargando producto...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <AdminPageHeader
        title={pageTitle}
        subtitle="Administra los detalles y precios del catálogo."
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Columna 1 y 2 */}
          <div className="lg:col-span-2 space-y-6">

            <FormPanel title="Información Principal del Producto">
              <InputField
                label="Nombre del Producto" type="text" name="nombre" placeholder="Ej: Torta de Chocolate"
                value={formData.nombre} onChange={handleChange} />

              <TextAreaField // Usamos TextAreaField para descripción
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
                // Si hay imagenFile (nueva), no mostramos la URL vieja. Si no, mostramos la URL.
                initialPreviewUrl={formData.imagenUrl ? (formData.imagenUrl.startsWith('data:') ? formData.imagenUrl : `/${formData.imagenUrl}`) : undefined}
              />
              <p className="text-xs text-gray-400 mt-2">
                * La imagen se guardará internamente (Base64) para esta demo.
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