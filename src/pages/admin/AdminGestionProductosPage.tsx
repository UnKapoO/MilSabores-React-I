import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import AdminPageHeader from '../../components/ui/admin/AdminPageHeader';
import AdminTable from '../../components/ui/admin/AdminTable';
import ProductTableRow from '../../components/ui/admin/ProductTableRow';
import { Button } from '../../components/ui/common/Button';
import { SelectField, type SelectOption } from '../../components/ui/common/SelectField';
import type { Product } from '../../types/Product';
import { obtenerNombreCategoria } from '../../utils/formatters';

import { API_BASE_URL } from '../../config/api';

const API_URL = `${API_BASE_URL}/productos`; // le asignas el valor importado de api.ts

const AdminGestionProductosPage = () => {
    const navigate = useNavigate();
    
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // 1. ESTADO CLAVE: Guarda la categoría activa
    const [activeCategory, setActiveCategory] = useState('todos'); 
    // 2. NUEVO ESTADO: Guarda el término de búsqueda
    const [searchTerm, setSearchTerm] = useState(''); 

    // --- Lógica de Carga de Datos (Fetch) ---
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            const data: Product[] = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
            alert("Error al cargar productos. Asegúrate que 'npm run server' esté activo.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []); 

    // --- Lógica de Filtrado (Calculada antes del renderizado) ---
    
    // 3. Cálculo de Opciones de Filtro
    const categoryNames = products.map(p => p.categoria).filter(c => c);
    const uniqueCategories = [...new Set(categoryNames)];

    const filterOptions: SelectOption[] = [
        { value: 'todos', label: '— Mostrar Todas las Categorías —' },
        ...uniqueCategories.map(cat => ({
            value: cat,
            label: obtenerNombreCategoria(cat),
        })),
    ];

    // 4. Aplicación de Filtro y Búsqueda
    const filteredAndSearchedProducts = products.filter(product => {
        const categoryMatch = activeCategory === 'todos' || product.categoria === activeCategory;
        
        // Convertimos el término de búsqueda y el nombre del producto a minúsculas para una comparación insensible
        const searchLower = searchTerm.toLowerCase();
        const nameLower = product.nombre.toLowerCase();

        const searchMatch = nameLower.includes(searchLower) || product.codigo.toLowerCase().includes(searchLower);

        return categoryMatch && searchMatch;
    });

    // 5. Handler para el cambio de la búsqueda
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // 6. Handler para el cambio del SelectField
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setActiveCategory(e.target.value);
    };

    // --- Lógica de Acciones (handleEdit y handleDelete, sin cambios) ---

    const handleEdit = (id: number) => {
        navigate(`/admin/editar/${id}`);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            setProducts(products.filter(p => p.id !== id));
            alert("✅ Producto eliminado correctamente.");

        } catch (error) {
            alert("❌ No se pudo eliminar el producto. Verifica la conexión."); 
            console.error("Error al eliminar producto:", error);
        }
    };

    // Botón de acción para el encabezado
    const newProductButton = (
        <Button onClick={() => navigate('/admin/crear-producto')} variant="primary">
            <i className="fa-solid fa-plus mr-2"></i>
            Añadir Producto
        </Button>
    );

    // --- Lógica de Renderizado Condicional ---
    
    if (isLoading) {
        return (
            <AdminLayout>
                <div className="p-20 text-center text-gray-500">Cargando productos...</div>
            </AdminLayout>
        );
    }

    if (products.length === 0 && !isLoading) {
        // ... (Mensaje de sin productos) ...
    }

    // --- Renderizado de la Tabla ---
    return (
        <AdminLayout>
            {/* Encabezado */}
            <AdminPageHeader
                title="Gestión de Productos"
                subtitle={`Total de productos en el catálogo: ${products.length} (mostrando ${filteredAndSearchedProducts.length} filtrados)`}
                actionButton={newProductButton}
            />

            {/* FILTROS Y BÚSQUEDA */}
            <div className="mb-6 flex justify-between items-center gap-4">
                
                {/* BARRA DE BÚSQUEDA */}
                <div className="relative w-full max-w-sm">
                    <i className="fa-solid fa-search absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o SKU..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors"
                    />
                </div>
                
                {/* FILTRO DE CATEGORÍA */}
                <div className="w-64">
                    <SelectField
                        label="Filtrar por Categoría"
                        name="categoryFilter"
                        value={activeCategory}
                        onChange={handleCategoryChange}
                        options={filterOptions}
                    />
                </div>
            </div>

            {/* Tabla con productos filtrados */}
            <AdminTable
                headers={["Producto", "Categoría", "Precio", "Stock", "Acciones"]}
            >
                {/* 7. Usamos filteredAndSearchedProducts en la tabla */}
                {filteredAndSearchedProducts.map(product => (
                    <ProductTableRow
                        key={product.id}
                        product={product}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </AdminTable>
            
            {/* Mensaje de "No hay resultados" */}
            {filteredAndSearchedProducts.length === 0 && (
                <div className="p-10 text-center bg-white rounded-xl shadow-lg mt-4">
                    <p className="text-lg text-gray-500">No se encontraron resultados que coincidan con la búsqueda.</p>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminGestionProductosPage;