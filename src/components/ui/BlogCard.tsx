import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './common/Button'; 

// Definimos la "forma" de un post (según tu db.json)
interface BlogPost {
    id: number;
    titulo: string;
    fecha: string;
    resumen: string;
    imagen: string;
}

// Definimos las props que recibirá
interface BlogCardProps {
    post: BlogPost;
}

// Usamos 'export default' para consistencia con los otros componentes
const BlogCard: React.FC<BlogCardProps> = ({ post }) => {

    return (
        // "Traducción" de tu .card-blog a Tailwind
        // (h-full es para que todas las tarjetas tengan el mismo alto en un grid)
        <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">

            {/* Imagen del Post */}
            <div className="relative">
                <img
                    src={`/${post.imagen}`}
                    alt={post.titulo}
                    className="w-full h-48 object-cover"
                />
            </div>

            {/* "Traducción" de tu .content-blog */}
            <div className="p-6 flex flex-col flex-grow">

                {/* Usamos el color 'primary' de tu config */}
                <span className="text-primary text-sm font-medium mb-2">
                    {post.fecha}
                </span>

                {/* Usamos el color 'dark' de tu config */}
                <h3 className="text-xl font-bold text-dark mb-3">
                    {post.titulo}
                </h3>

                <p className="text-gray-600 text-sm mb-6 flex-grow">
                    {post.resumen}
                </p>

                {/* ¡Reutilizamos nuestro Button! */}
                <Link to={`/blog/${post.id}`} className="mt-auto">
                    <Button variant="primary" className="w-full">
                        Leer más
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default BlogCard;