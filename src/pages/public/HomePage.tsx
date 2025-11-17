// src/pages/public/HomePage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ui/ProductCard';
import type { Product } from '../../types/Product';
import { FeatureCard } from '../../components/ui/FeatureCard';
import { CategoryCard } from '../../components/ui/CategoryCard';
import BlogCard from '../../components/ui/BlogCard';
interface BlogPost {
  id: number;
  categoria: string,
  titulo: string;
  resumen: string;
  fecha: string;
  autor: string;
  imagen: string;
  contenido: string;
}

function HomePage() {
  const features = [
    { icon: "fa-solid fa-shield-halved", title: "Garantía de frescura", subtitle: "100% productos frescos del día" },
    { icon: "fa-solid fa-gift", title: "Personalización", subtitle: "Diseños únicos para ocasiones" },
    { icon: "fa-solid fa-headset", title: "Atención 24/7", subtitle: "Contáctanos cuando necesites" },
    { icon: "fa-solid fa-truck-fast", title: "Programa tu envío", subtitle: "Tu pedido en 24 horas" }
  ];

  const categories = [
    {
      title: "Tortas Artesanales",
      imageUrl: "/img/tortas-artesanales.jpg",
      linkTo: "/catalogo?categoria=tortas-cuadradas"
    },
    {
      title: "Postres Individuales",
      imageUrl: "/img/postres-individuales.jpg",
      linkTo: "/catalogo?categoria=postres-individuales"
    },
    {
      title: "Ocasiones Especiales",
      imageUrl: "/img/tortas-especiales.jpg",
      linkTo: "/catalogo?categoria=especiales"
    },
  ];
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // 1. Creamos un "estado" para guardar los productos que lleguen del API
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // 2. Usamos useEffect para pedir los datos CUANDO la página cargue
  useEffect(() => {
    // Pedimos solo 4 productos para el Home
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/productos?_limit=3');
        const data = await response.json();
        setFeaturedProducts(data); // 3. Guardamos los productos en el estado
      } catch (error) {
        console.error("Error al cargar productos destacados:", error);
      }
    };
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/blog?_limit=3'); // Traemos 3
        const data: BlogPost[] = await response.json(); // Tipamos la data
        setBlogPosts(data); // Guardamos en el nuevo estado
      } catch (error) {
        console.error("Error al cargar posts del blog:", error);
      }
    };

    fetchFeaturedProducts();
    fetchBlogPosts();
  }, []); // El [] vacío asegura que solo se ejecute 1 vez

  return (
    <>
      {/* --- SECCIÓN 1: BANNER --- */}
      <section
        className="relative flex flex-col justify-center items-center text-center text-white
        bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(#00000060, #00000040), url('/img/banner.jpg')" }}
      >
        {/* 2. Usamos 'calc()' para que mida el 100% del alto (100vh) MENOS
               la altura del header (7rem o 112px, que es lo mismo que h-28) */}
        <div
          className="container mx-auto px-4 flex flex-col justify-center items-center"
          style={{ minHeight: 'calc(100vh - 7rem)' }}
        >
          {/* 3. Tu contenido (usamos tus fuentes de Tailwind) */}
          <h1 className="text-7xl font-secundaria">Mil Sabores</h1>
          <p className="text-2xl font-principal mt-4">Sabores únicos, momentos inolvidables.</p>
          <Link to="/catalogo">
            <button className="bg-acento-rosa text-white py-3 px-8 mt-8 rounded-full 
            font-bold uppercase tracking-wider 
            transition-transform hover:scale-105 shadow-2xl ">
              Ver Catálogo
            </button>
          </Link>
        </div>
      </section>
      {/* --- SECCIÓN 2: FEATURES --- */}
      <div className='bg-fondo-crema py-16'>
        <div className='container mx-auto px-4'>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Map y uso de FeatureCard */}
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                subtitle={feature.subtitle}
              />
            ))}
          </div>
        </div>
      </div>
      {/* --- SECCIÓN 3: CATEGORÍAS --- */}
      <div className='bg-fondo-crema container mx-auto py-16 px-4'>
        <h2 className="text-4xl font-secundaria text-dark text-center mb-10">
          Nuestras Especialidades
        </h2>

        {/* Usamos un grid de 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Hacemos .map() y usamos nuestro nuevo LEGO */}
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              imageUrl={category.imageUrl}
              linkTo={category.linkTo}
            />
          ))}
        </div>
      </div>
      {/* --- SECCIÓN 4: DESTACADOS --- */}
      <div className='bg-fondo-crema container mx-auto py-16 px-4'>
        <section>
          <h2 className="text-3xl font-bold mb-4">Productos Destacados</h2>
          {/* 4. Hacemos .map() sobre el ESTADO (featuredProducts) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
      {/* --- SECCIÓN 5: GALERÍA --- */}
      <div className="bg-fondo-crema container mx-auto py-16 px-4">
        <h2 className="text-4xl font-secundaria text-dark text-center mb-10">
          Nuestra Galería
        </h2>
        {/* Traducción del grid de tu CSS: 4 columnas, 2 filas.
          La imagen 3 (Vitrina) ocupa 2x2 en el medio.*/}
        <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[32rem]">
          <img
            src="/img/interior-pasteleria.jpg"
            alt="Interior Pastelería"
            className="w-full h-full object-cover rounded-lg shadow-md col-start-1 row-start-1 overflow-hidden cursor-pointer transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
          />
          <img
            src="/img/chef-decorando.jpg"
            alt="Chef Decorando"
            className="w-full h-full object-cover rounded-lg shadow-md col-start-1 row-start-2 overflow-hidden cursor-pointer transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
          />
          <img
            src="/img/vitrina-principal.jpg"
            alt="Vitrina Principal"
            className="w-full h-full object-cover rounded-lg shadow-md col-start-2 row-start-1 col-span-2 row-span-2 overflow-hidden cursor-pointer transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
          />
          <img
            src="/img/ingredientes-frescos.jpg"
            alt="Ingredientes Frescos"
            className="w-full h-full object-cover rounded-lg shadow-md col-start-4 row-start-1 overflow-hidden cursor-pointer transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
          />
          <img
            src="/img/tortas-personalizadas.jpg"
            alt="Tortas Personalizadas"
            className="w-full h-full object-cover rounded-lg shadow-md col-start-4 row-start-2 overflow-hidden cursor-pointer transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
          />
        </div>
      </div>

      {/* --- SECCIÓN 6: BLOG --- */}
      <div className="bg-fondo-crema py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-secundaria text-dark text-center mb-10">
            Últimas Noticias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              // Envolvemos la tarjeta en un <Link> que pasa "estado"
              <Link
                key={post.id}
                to="/blog" // Navega a la página de Blog
                // "state" es el "mensaje secreto" que le enviamos a la página /blog
                state={{ openPostId: post.id }}
              >
                <BlogCard
                  post={post}
                  onClick={() => { }} // Pasamos una función vacía (o modificamos BlogCard para que onClick sea opcional)
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;