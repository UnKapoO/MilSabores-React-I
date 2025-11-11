// Definimos la "interfaz" (la forma) de las props. TypeScript nos obligará a pasar un 'icon' y un 'text' cada vez que usemos este componente.
interface ContactItemProps {
  icon: string; 
  text: string; 
}

// Usamos "desestructuración" ({ icon, text }) para acceder a las props directamente.
function ContactItem({ icon, text }: ContactItemProps) {
  return (
    <div className="contacto-item">
      <i className={icon}></i>
      <span>{text}</span>
    </div>
  );
}

export default ContactItem;