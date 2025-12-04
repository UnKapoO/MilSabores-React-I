import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useParams, useNavigate } from 'react-router-dom'; // Añadí useNavigate
=======
import { useParams } from 'react-router-dom';
>>>>>>> 537f9494c277b8ee04607440a0d1e30003695ce2
import AdminLayout from '../../components/layout/admin/AdminLayout';
import { InputField } from '../../components/ui/common/InputField'; // Corregí ruta
import { SelectField, type SelectOption } from '../../components/ui/common/SelectField'; // Corregí ruta
import { TextAreaField } from '../../components/ui/common/TextAreaField'; // Asegúrate de tener este
import { Button } from '../../components/ui/common/Button'; // Corregí ruta
import FormPanel from '../../components/ui/admin/FormPanel';
import AdminPageHeader from '../../components/ui/admin/AdminPageHeader';
import ImageUploader from '../../components/ui/admin/ImageUploader';
import { useCart } from '../../context/CartContext'; // Para usar addToast

<<<<<<< HEAD
const API_URL = 'http://localhost:3001/productos';

=======
// Importamos la BASE URL para las imágenes
import { API_BASE_URL } from '../../config/api';

const API_URL = `${API_BASE_URL}/productos`;

// ... (Las definiciones de options y initialFormState están perfectas, déjalas igual) ...
>>>>>>> 537f9494c277b8ee04607440a0d1e30003695ce2
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

<<<<<<< HEAD
// Definimos el estado inicial
=======
>>>>>>> 537f9494c277b8ee04607440a0d1e30003695ce2
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

<<<<<<< HEAD
const AdminCreateProductoPage = () => {
  const navigate = useNavigate();
  const { addToast } = useCart();
  const params = useParams();
  const productId = params.id;

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(!!productId);
  const [imageResetKey, setImageResetKey] = useState(0);

  // --- CARGA DE DATOS (Edición) ---
=======
type FormDataType = typeof initialFormState;

const AdminCreateProductoPage = () => {
  const params = useParams();
  const productId = params.id;

  const [formData, setFormData] = useState<FormDataType>(initialFormState);
  const [isLoading, setIsLoading] = useState(!!productId);
  const [imageResetKey, setImageResetKey] = useState(0);

  // --- LÓGICA DE CARGA DE DATOS ---
>>>>>>> 537f9494c277b8ee04607440a0d1e30003695ce2
  useEffect(() => {
    if (!productId) return;

    const fetchProductForEdit = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/${productId}`);
        if (!response.ok) throw new Error('Producto no encontrado');

<<<<<<< HEAD
        const data = await response.json();
=======
>>>>>>> 537f9494c277b8ee04607440a0d1e30003695ce2
        setFormData({
          ...data,
          imagenUrl: data.imagen || '',
          imagenFile: null,
<<<<<<< HEAD
=======
          // Mapeamos SKU del backend a 'codigo' del frontend si es necesario
          codigo: data.sku || '', 
>>>>>>> 537f9494c277b8ee04607440a0d1e30003695ce2
        });
      } catch (error) {
        console.error("Error:", error);
        addToast("Error al cargar producto", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductForEdit();
<<<<<<< HEAD
  }, [productId, addToast]);

  // --- MANEJADORES ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? parseFloat(value) : value;

=======
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue: string | number = type === 'number' ? parseFloat(value) : value;
>>>>>>> 537f9494c277b8ee04607440a0d1e30003695ce2
    setFormData(prevData => ({ ...prevData, [name]: finalValue }));
  };

  const handleImageSelect = (file: File | null) => {
    setFormData(prevData => ({ ...prevData, imagenFile: file }));
  };
<<<<<<< HEAD

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
=======
  
  // --- LÓGICA DE ENVÍO (TU VERSIÓN CORREGIDA Y ÚNICA) ---
>>>>>>> 537f9494c277b8ee04607440a0d1e30003695ce2
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
<<<<<<< HEAD
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
=======
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
>>>>>>> 537f9494c277b8ee04607440a0d1e30003695ce2
  }

  return (
    <AdminLayout>
      <AdminPageHeader title={pageTitle} subtitle="Administra los detalles y precios del catálogo." />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
<<<<<<< HEAD

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
=======
          <div className="lg:col-span-2 space-y-6">
            <FormPanel title="Información Principal del Producto">
              <InputField label="Nombre del Producto" type="text" name="nombre" placeholder="Ej: Torta de Chocolate" value={formData.nombre} onChange={handleChange as any} />
              <InputField label="Descripción" type="text" name="descripcion" placeholder="Describe el producto..." value={formData.descripcion} onChange={handleChange as any} />
              <InputField label="Historia" type="text" name="historia" placeholder="Historia del producto" value={formData.historia} onChange={handleChange as any} />
>>>>>>> 537f9494c277b8ee04607440a0d1e30003695ce2
            </FormPanel>

            <FormPanel title="Precio y Stock">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<<<<<<< HEAD
                <InputField
                  label="Precio Base" type="number" name="precio" placeholder="10000"
                  value={formData.precio} onChange={handleChange} min="0" />
                <InputField
                  label="Descuento" type="number" name="descuento" placeholder="0"
                  value={formData.descuento} onChange={handleChange} min="0" />
                <InputField
                  label="Stock" type="number" name="stock" placeholder="100"
                  value={formData.stock} onChange={handleChange} min="0" />
=======
                <InputField label="Precio Base" type="number" name="precio" placeholder="10000" value={formData.precio} onChange={handleChange as any} min="0" />
                <InputField label="Descuento" type="number" name="descuento" placeholder="1000" value={formData.descuento} onChange={handleChange as any} min="0" />
                <InputField label="Stock" type="number" name="stock" placeholder="100" value={formData.stock} onChange={handleChange as any} min="0" />
>>>>>>> 537f9494c277b8ee04607440a0d1e30003695ce2
              </div>
            </FormPanel>
          </div>

<<<<<<< HEAD
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
=======
          <div className="lg:col-span-1 space-y-6">
            <FormPanel title="Organización">
              <InputField label="ID / SKU" type="text" name="codigo" value={formData.codigo} onChange={handleChange as any} />
              <SelectField label="Categoría" name="categoria" value={formData.categoria} onChange={handleChange as any} options={categoriasOptions} />
              <SelectField label="Estado" name="estado" value={formData.estado} onChange={handleChange as any} options={estadoOptions} />
>>>>>>> 537f9494c277b8ee04607440a0d1e30003695ce2
            </FormPanel>

            <FormPanel title="Imagen del Producto">
              <ImageUploader
                key={imageResetKey}
                onImageSelect={handleImageSelect}
<<<<<<< HEAD
                // Si hay imagenFile (nueva), no mostramos la URL vieja. Si no, mostramos la URL.
                initialPreviewUrl={formData.imagenUrl ? (formData.imagenUrl.startsWith('data:') ? formData.imagenUrl : `/${formData.imagenUrl}`) : undefined}
=======
                // AQUÍ USAMOS LA FUNCIÓN HELPER CORREGIDA
                initialPreviewUrl={getPreviewUrl()}
>>>>>>> 537f9494c277b8ee04607440a0d1e30003695ce2
              />
              <p className="text-xs text-gray-400 mt-2">
                * La imagen se guardará internamente (Base64) para esta demo.
              </p>
            </FormPanel>
          </div>
        </div>

<<<<<<< HEAD
        <div className="mt-8 text-right pb-10">
          <Button type="submit" variant="primary" disabled={isLoading}>
            <i className="fa-solid fa-save mr-2"></i>
            {isLoading ? 'Guardando...' : buttonText}
=======
        <div className="mt-8 text-right">
          <Button type="submit" variant="primary">
            <i className="fa-solid fa-save mr-2"></i> {buttonText}
>>>>>>> 537f9494c277b8ee04607440a0d1e30003695ce2
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminCreateProductoPage;