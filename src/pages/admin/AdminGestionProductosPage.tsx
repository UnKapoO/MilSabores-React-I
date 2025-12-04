import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/admin/AdminLayout';
import AdminPageHeader from '../../components/ui/admin/AdminPageHeader';
import AdminTable from '../../components/ui/admin/AdminTable';
import ProductTableRow from '../../components/ui/admin/ProductTableRow';
import { Button } from '../../components/ui/common/Button'; 
import { SelectField, type SelectOption } from '../../components/ui/common/SelectField'; 
import { InputField } from '../../components/ui/common/InputField'; 
import type { Product } from '../../types/Product';

import { Modal } from '../../components/ui/common/Modal';
import { useCart } from '../../context/CartContext'; 

const API_URL = 'http://localhost:3001/productos';

const AdminGestionProductosPage = () => {
    const navigate = useNavigate();
    const { addToast } = useCart(); // Para mostrar mensajes bonitos

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Estados de Filtro
    const [activeCategory, setActiveCategory] = useState('todos');
    const [searchTerm, setSearchTerm] = useState('');

    // 2. ESTADOS PARA EL MODAL DE ELIMINAR
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    // --- Lógica de Carga de Datos ---
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            const data: Product[] = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
            addToast("Error al cargar productos", "error");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // --- Lógica de Filtrado ---
    const categoryNames = products.map(p => p.categoria).filter(c => c);
    const uniqueCategories = [...new Set(categoryNames)];

    const filterOptions: SelectOption[] = [
        { value: 'todos', label: '— Mostrar Todas las Categorías —' },
        { value: 'tortas-cuadradas', label: 'Tortas Cuadradas' }, // Hardcodeamos para asegurar orden bonito
        { value: 'tortas-circulares', label: 'Tortas Circulares' },
        { value: 'postres-individuales', label: 'Postres Individuales' },
        { value: 'sin-azucar', label: 'Sin Azúcar' },
        { value: 'vegana', label: 'Vegana' },
        { value: 'especiales', label: 'Especiales' },
        // ...uniqueCategories.map(...) // Opcional: si quieres dinámicos
    ];

    const filteredAndSearchedProducts = products.filter(product => {
        const categoryMatch = activeCategory === 'todos' || product.categoria === activeCategory;
        const searchLower = searchTerm.toLowerCase();
        const nameLower = product.nombre.toLowerCase();
        const searchMatch = nameLower.includes(searchLower) || product.codigo.toLowerCase().includes(searchLower);
        return categoryMatch && searchMatch;
    });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setActiveCategory(e.target.value);
    };

    // --- ACCIONES ---

    const handleEdit = (id: number) => {
        navigate(`/admin/editar/${id}`);
    };

    // 3. NUEVA LÓGICA DE ELIMINAR (Con Modal)

    // Paso A: Abrir el modal
    const handleOpenDeleteModal = (id: number) => {
        const product = products.find(p => p.id === id);
        if (product) {
            setProductToDelete(product);
            setIsDeleteModalOpen(true);
        }
    };

    // Paso B: Confirmar y borrar de verdad
    const confirmDelete = async () => {
        if (!productToDelete) return;

        try {
            await fetch(`${API_URL}/${productToDelete.id}`, { method: 'DELETE' });

            // Actualizar UI
            setProducts(products.filter(p => p.id !== productToDelete.id));
            addToast("Producto eliminado correctamente", "success");

            // Cerrar modal
            setIsDeleteModalOpen(false);
            setProductToDelete(null);

        } catch (error) {
            addToast("No se pudo eliminar el producto", "error");
            console.error("Error al eliminar producto:", error);
        }
    };

    const newProductButton = (
        <Button onClick={() => navigate('/admin/crear-producto')} variant="primary">
            <i className="fa-solid fa-plus mr-2"></i>
            Añadir Producto
        </Button>
    );

    // --- RENDERIZADO ---

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="p-20 text-center text-gray-500">Cargando productos...</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <AdminPageHeader
                title="Gestión de Productos"
                subtitle={`Total de productos: ${products.length} (mostrando ${filteredAndSearchedProducts.length})`}
                actionButton={newProductButton}
            />

            {/* FILTROS Y BÚSQUEDA */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full max-w-sm">
                    <InputField
                        label=""
                        name="search"
                        type="text"
                        placeholder="Buscar por nombre o SKU..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="mb-0 pl-10" // Espacio para el ícono
                    />
                    <i className="fa-solid fa-search absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                </div>

                <div className="w-full sm:w-64">
                    <SelectField
                        label="Filtrar por Categoría"
                        name="categoryFilter"
                        value={activeCategory}
                        onChange={handleCategoryChange as any}
                        options={filterOptions}
                        className="mb-0"
                    />
                </div>
            </div>

            {/* TABLA */}
            <AdminTable
                headers={["Producto", "Categoría", "Precio", "Stock", "Acciones"]}
            >
                {filteredAndSearchedProducts.map(product => (
                    <ProductTableRow
                        key={product.id}
                        product={product}
                        onEdit={handleEdit}
                        onDelete={handleOpenDeleteModal} // 4. Pasamos la función que ABRE el modal
                    />
                ))}
            </AdminTable>

            {filteredAndSearchedProducts.length === 0 && (
                <div className="p-10 text-center bg-white rounded-xl shadow-lg mt-4 border border-gray-100">
                    <i className="fa-solid fa-box-open text-4xl text-gray-300 mb-2"></i>
                    <p className="text-lg text-gray-500">No se encontraron resultados.</p>
                </div>
            )}

            {/* 5. MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirmar Eliminación"
                size="md"
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <i className="fa-solid fa-triangle-exclamation text-red-600 text-xl"></i>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        ¿Estás seguro de eliminar este producto?
                    </h3>

                    {productToDelete && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-6 border border-gray-200 inline-flex items-center gap-3">
                            <img src={productToDelete.imagen.startsWith('data:') ? productToDelete.imagen : `/${productToDelete.imagen}`} alt="" className="w-10 h-10 rounded object-cover" />
                            <div className="text-left">
                                <p className="font-bold text-dark text-sm">{productToDelete.nombre}</p>
                                <p className="text-xs text-gray-500">{productToDelete.codigo}</p>
                            </div>
                        </div>
                    )}

                    <p className="text-sm text-gray-500 mb-6">
                        Esta acción eliminará el producto del catálogo permanentemente. No se puede deshacer.
                    </p>

                    <div className="flex justify-center gap-4">
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancelar
                        </Button>
                        <button
                            onClick={confirmDelete}
                            className="bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition-colors shadow"
                        >
                            Sí, Eliminar
                        </button>
                    </div>
                </div>
            </Modal>

        </AdminLayout>
    );
};

export default AdminGestionProductosPage;