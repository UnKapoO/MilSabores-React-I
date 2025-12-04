import { Link } from 'react-router-dom';
import { formatearFecha, obtenerNombreCategoriaBlog, getImageUrl } from '../../utils/formatters';

// 1. Definimos la nueva "forma" del Post (¡con autor y contenido!)
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

interface BlogCardProps {
    post: BlogPost;
    // Añadimos una prop para manejar el clic y abrir el modal
    onClick: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onClick }) => {
    return (
        // 3. Traducimos tu .articulo-card
        <div
            className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-md 
                transition-all duration-300 hover:shadow-xl hover:-translate-y-1 
                h-full cursor-pointer"
            onClick={onClick} 
        >

            {/* 5. Traducimos tu .articulo-imagen */}
            <div className="relative">
                <img
                    src={getImageUrl(post.imagen)}
                    alt={post.titulo}
                    className="w-full h-48 object-cover"
                />
                {/* 6. Traducimos tu .categoria-badge */}
                <span
                    className="absolute top-3 left-3 bg-primary text-white 
                    text-xs font-bold uppercase px-2 py-1 rounded shadow-lg"
                >
                    {obtenerNombreCategoriaBlog(post.categoria)}
                </span>
            </div>

            {/* 7. Traducimos tu .articulo-info */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-sm text-letra-gris mb-2 gap-4">
                    {/* 8. Fecha (con nuestra función de formateo) */}
                    <span className="flex items-center gap-1">
                        <i className="fa-solid fa-calendar"></i>
                        {formatearFecha(post.fecha)}
                    </span>
                    {/* 9. Autor */}
                    <span className="flex items-center gap-1">
                        <i className="fa-solid fa-user"></i>
                        {post.autor}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-dark mb-3">
                    {post.titulo}
                </h3>

                <p className="text-gray-600 text-sm mb-6 flex-grow">
                    {post.resumen}
                </p>

                {/* 10. Footer con botón "Leer más" */}
                <div className="mt-auto text-primary font-bold hover:underline">
                    Leer más <i className="fa-solid fa-arrow-right ml-1"></i>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;