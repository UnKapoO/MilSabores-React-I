import { Container, Button, Navbar, Nav } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Header() {
  // El hook 'useNavigate' se encarga de la navegación
  const navigate = useNavigate();

  // Funciones para los botones del header superior
  const handleNavigateLogin = () => navigate("/login");
  const handleNavigateCarrito = () => navigate("/carrito");

  return (
    <header className="header-doble">

      {/* --- HEADER SUPERIOR --- */}
      <div className="header-superior">
        <Container>
          <div className="header-superior-content">
            <div className="contacto-info">
              <i className="fa-solid fa-phone"></i>
              <span>Soporte al cliente</span>
              <span className="telefono">+56 9 99999999</span>
            </div>

            <div className="logo-principal">
              <img src="/img/logo.jpg" alt="logo" />
              <span className="pacifico-regular">Mil Sabores</span>
            </div>

            <div className="usuario-carrito">
              {/* Usamos onClick con 'useNavigate' para la navegación */}
              <Button
                variant="link" // 'variant="link"' quita los estilos de botón
                className="btn-usuario"
                onClick={handleNavigateLogin}
              >
                <i className="fa-solid fa-user"></i>
              </Button>
              <Button
                variant="link"
                className="btn-carrito"
                onClick={handleNavigateCarrito}
              >
                <div className="carrito-icon-wraper">
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span className="cart-count">0</span>

                </div>
                <span className="carrito-texto">Carrito</span>

              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* --- HEADER INFERIOR --- */}
      <Navbar expand="lg" className="header-inferior" variant="dark" collapseOnSelect>
        <Container>

          {/* Este es el BOTÓN HAMBURGUESA.*/}
          <Navbar.Toggle aria-controls="main-navbar-nav" />

          {/* Este es el CONTENEDOR COLAPSABLE. */}
          <Navbar.Collapse id="main-navbar-nav">

            <Nav className="me-auto navegacion-principal">

              {/* Usamos <Nav.Link> "as" (como) <NavLink> de react-router-dom.
                  Esto nos da la clase 'active' automáticamente al navegar.
              */}
              <Nav.Link as={NavLink} to="/" end>INICIO</Nav.Link>
              <Nav.Link as={NavLink} to="/catalogo">CATÁLOGO</Nav.Link>
              <Nav.Link as={NavLink} to="/especiales">TORTAS ESPECIALES</Nav.Link>
              <Nav.Link as={NavLink} to="/sin-azucar">SIN AZÚCAR</Nav.Link>
              <Nav.Link as={NavLink} to="/vegana">VEGANO</Nav.Link>
              <Nav.Link as={NavLink} to="/blog">BLOG</Nav.Link>
            </Nav>
            
            <div className="busqueda-header">
              <input
                type="text"
                placeholder="Buscar..."
                className="input-busqueda-header"
              />
              <button className="btn-buscar">
                <i className="fa-solid fa-search"></i>
              </button>
            </div>



          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;