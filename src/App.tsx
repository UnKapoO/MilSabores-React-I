import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/admin/AdminLayout';

// Páginas Públicas
import HomePage from './pages/public/HomePage';
import CatalogoPage from './pages/public/CatalogoPage';
import BlogPage from './pages/public/BlogPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import CarritoPage from './pages/public/CarritoPage';
import CheckoutPage from './pages/public/CheckoutPage';
import ConfirmacionPage from './pages/public/ConfirmacionPage';
import UserProfilePage from './pages/public/UserProfilePage';
import RegisterPage from './pages/public/RegisterPage';

// Páginas Admin
import AdminHomePage from './pages/admin/AdminHomePage';
import AdminGestionProductosPage from './pages/admin/AdminGestionProductosPage';
import AdminCreateProductoPage from './pages/admin/AdminCreateProductoPage';
import AdminGestionPedidosPage from './pages/admin/AdminGestionPedidosPage'; // <-- Asegúrate de importar esto

// Utils
import ScrollToTop from './utils/ScrollToTop';

// Componentes Temporales
const LoginPage = () => <h1 style={{ padding: '2rem', height: '100vh' }}>Página de Login</h1>;
const AdminGestionClientesPage = () => <h1 className="p-8 text-2xl">Gestión de Clientes (Próximamente)</h1>; // Placeholder


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      
      <Routes>
        
        {/* =========================================
            BLOQUE 1: RUTAS PÚBLICAS
           ========================================= */}

        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/catalogo" element={<PublicLayout><CatalogoPage /></PublicLayout>} />
        <Route path="/producto/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
        <Route path="/carrito" element={<PublicLayout><CarritoPage /></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
        <Route path="/confirmacion" element={<PublicLayout><ConfirmacionPage /></PublicLayout>} />
        <Route path="/perfil" element={<PublicLayout><UserProfilePage /></PublicLayout>} />

        {/* Rutas de Autenticación (sin Footer) */}
        <Route path="/login" element={<PublicLayout showFooter={false}><LoginPage /></PublicLayout>} />
        <Route path="/registro" element={<PublicLayout showFooter={false}><RegisterPage /></PublicLayout>} />


        {/* =========================================
            BLOQUE 2: RUTAS DE ADMINISTRACIÓN
           ========================================= */}
        
        {/* Dashboard */}
        <Route 
          path="/admin" 
          element={ <AdminLayout><AdminHomePage /></AdminLayout> } 
        />

        {/* Gestión de Productos */}
        <Route 
          path="/admin/productos" 
          element={ <AdminGestionProductosPage /> } // El layout ya está dentro de la página
        />
        <Route 
          path="/admin/crear-producto" 
          element={ <AdminCreateProductoPage /> } 
        />
        <Route 
          path="/admin/editar/:id" 
          element={ <AdminCreateProductoPage /> } 
        />

        {/* Gestión de Pedidos */}
        <Route 
          path="/admin/pedidos" 
          element={ <AdminGestionPedidosPage /> } 
        />

        {/* Gestión de Clientes */}
        <Route 
          path="/admin/clientes" 
          element={ 
            <AdminLayout>
              <AdminGestionClientesPage />
            </AdminLayout> 
          } 
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;