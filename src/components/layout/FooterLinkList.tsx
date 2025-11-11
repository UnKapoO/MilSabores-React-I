import { Link } from 'react-router-dom';

// Definimos la "forma" de un objeto de link individual
interface LinkItem {
  to: string;   // La URL a la que irá, ej: "/catalogo"
  label: string; // El texto que verá el usuario, ej: "Catálogo"
}

// Dfinimos la "forma" de las props que este componente espera recibir de su padre (el Footer).
interface FooterLinkListProps {
  title: string;     // El <h4>, ej: "Nuestros Productos"
  links: LinkItem[]; // Un ARRAY de los objetos 'LinkItem' que definimos arriba
}

// Componente
// Usamos las props 'title' y 'links' para rellenar el JSX.
function FooterLinkList({ title, links }: FooterLinkListProps) {
  return (
    <div className="footer-section">
      <h4>{title}</h4>
      <ul className="footer-links">

        {/* Usamos .map() para "mapear" (transformar) nuestro array de datos links' en una lista de elementos JSX (<li>).
    
         * Por cada 'link' en el array, creamos un <li>.
         * 'key={index}' es un ID especial que React necesita para optimizar las listas */}

        {links.map((link, index) => (
          <li key={index}>
            {/* Usamos el componente <Link> de react-router-dom
                para una navegación rápida sin recargar la página.
            */}
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}

      </ul>
    </div>
  );
}

export default FooterLinkList;