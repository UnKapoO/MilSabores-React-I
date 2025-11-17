import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Para leer el "mensaje" del Home

// --- 1. Importamos todos nuestros LEGOs del Kit ---
import { Breadcrumb } from '../../components/ui/common/Breadcrumb';
import { PageHeader } from '../../components/ui/common/PageHeader';
import { EmptyState } from '../../components/ui/common/EmptyState';
import { Modal } from '../../components/ui/common/Modal'; // ¡Importamos el Modal!
import ProductFilterBar from '../../components/ui/ProductFilterBar';
import BlogCard from '../../components/ui/BlogCard';
import { formatearFecha, obtenerNombreCategoriaBlog } from '../../utils/formatters';

// --- 2. Definimos la "forma" del Post (completa) ---
interface BlogPost {
    id: number;
    categoria: string;
    titulo: string;
    resumen: string;
    fecha: string;
    autor: string;
    imagen: string;
    contenido: string;
}

// --- 3. Definimos los "links" para el Breadcrumb ---
const breadcrumbLinks = [
    { to: "/", label: "Inicio" }
];

function BlogPage() {

    // --- 4. Estados de la Página ---
    const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
    const [categories, setCategories] = useState<string[]>(['todas']);
    const [activeCategory, setActiveCategory] = useState('todas');

    // Estados para el Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const location = useLocation(); // Hook para leer la "ubicación"

    // --- 5. Pedimos los datos del API ---
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:3001/blog');
                const data: BlogPost[] = await response.json();
                setAllPosts(data);

                const allCategories = data.map((p: BlogPost) => p.categoria);
                const uniqueCategories = [...new Set(allCategories)];
                setCategories(["todas", ...uniqueCategories]);

                // ¡Magia! Leemos el "mensaje" (state) que pudo enviar el Home
                const postIdToOpen = location.state?.openPostId;

                if (postIdToOpen) {
                    const postToOpen = data.find(p => p.id === postIdToOpen);
                    if (postToOpen) {
                        handleOpenModal(postToOpen);
                    }
                    // Limpiamos el "mensaje" para que no se vuelva a abrir
                    window.history.replaceState({}, document.title)
                }

            } catch (error) {
                console.error("Error al cargar posts:", error);
            }
        };
        fetchPosts();
    }, [location.state]); // Se ejecuta si cambia el 'location.state'

    // --- 6. Lógica de Filtrado ---
    const filteredPosts = allPosts.filter(post => {
        if (activeCategory === "todas") return true;
        return post.categoria === activeCategory;
    });

    // --- 7. Funciones del Modal ---
    const handleOpenModal = (post: BlogPost) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
    };

    return (
        <>
            <div className="container mx-auto py-12 px-4">

                <Breadcrumb links={breadcrumbLinks} currentPage="Blog" />

                <PageHeader
                    title="Blog y Noticias"
                    subtitle="Descubre las últimas tendencias, recetas exclusivas y noticias de nuestra pastelería."
                />

                <ProductFilterBar
                    categories={categories}
                    activeCategory={activeCategory}
                    onFilterChange={setActiveCategory}
                    getCategoryName={obtenerNombreCategoriaBlog}
                />

                {/* --- Grid de Posts --- */}
                <section className="mt-12">
                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPosts.map(post => (
                                <BlogCard
                                    key={post.id}
                                    post={post}
                                    onClick={() => handleOpenModal(post)}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon="fa-solid fa-newspaper"
                            title="No se encontraron artículos"
                            message="Intenta con otra categoría o filtro."
                        />
                    )}
                </section>
            </div>

            {/* --- El Modal --- */}
            {selectedPost && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    title={selectedPost.titulo}
                    size="2xl" 
                >
                    <div>
                        <img
                            src={`/${selectedPost.imagen}`}
                            alt={selectedPost.titulo}
                            className="w-full h-64 object-cover rounded-md mb-4"
                        />
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-letra-gris mb-4">
                            <span className="flex items-center gap-1">
                                <i className="fa-solid fa-calendar"></i>
                                {formatearFecha(selectedPost.fecha)}
                            </span>
                            <span className="flex items-center gap-1">
                                <i className="fa-solid fa-user"></i>
                                {selectedPost.autor}
                            </span>
                            <span className="flex items-center gap-1">
                                <i className="fa-solid fa-tag"></i>
                                {obtenerNombreCategoriaBlog(selectedPost.categoria)}
                            </span>
                        </div>

                        {/* 'prose' es una clase de Tailwind que estiliza HTML crudo */}
                        <div
                            className="prose prose-lg max-w-none text-letra-cafe"
                            dangerouslySetInnerHTML={{ __html: selectedPost.contenido }}
                        />
                    </div>
                </Modal>
            )}
        </>
    );
}

export default BlogPage;