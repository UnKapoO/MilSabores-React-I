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
import LoginPage from './pages/public/LoginPage'; // 1. IMPORTAMOS LA PÁGINA REAL

// Páginas Admin
import AdminHomePage from './pages/admin/AdminHomePage';
import AdminGestionProductosPage from './pages/admin/AdminGestionProductosPage';
import AdminCreateProductoPage from './pages/admin/AdminCreateProductoPage';
import AdminGestionPedidosPage from './pages/admin/AdminGestionPedidosPage'; 

// Utils y Contextos
import ScrollToTop from './utils/ScrollToTop';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // 2. IMPORTAMOS CARTPROVIDER (Necesario para las notificaciones del login)
import NotificationToast from './components/ui/common/NotificationToast'; // 3. IMPORTAMOS EL TOAST

// Componente Temporal (Solo queda el de clientes)
const AdminGestionClientesPage = () => <h1 className="p-8 text-2xl">Gestión de Clientes (Próximamente)</h1>;


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* 4. ENVUELVE CON CARTPROVIDER: El Login usa 'addToast' de aquí */}
        <CartProvider>
          
          <NotificationToast /> {/* Para ver los mensajes de error/éxito */}
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

            {/* Rutas de Autenticación */}
            {/* Ahora usa el componente real importado arriba */}
            <Route path="/login" element={<PublicLayout showFooter={false}><LoginPage /></PublicLayout>} />
            <Route path="/registro" element={<PublicLayout showFooter={false}><RegisterPage /></PublicLayout>} />


            {/* =========================================
              BLOQUE 2: RUTAS DE ADMINISTRACIÓN
             ========================================= */}

            <Route
              path="/admin"
              element={<AdminLayout><AdminHomePage /></AdminLayout>}
            />

            <Route
              path="/admin/productos"
              element={<AdminGestionProductosPage />} 
            />
            <Route
              path="/admin/crear-producto"
              element={<AdminCreateProductoPage />}
            />
            <Route
              path="/admin/editar/:id"
              element={<AdminCreateProductoPage />}
            />

            <Route
              path="/admin/pedidos"
              element={<AdminGestionPedidosPage />}
            />

            <Route
              path="/admin/clientes"
              element={
                <AdminLayout>
                  <AdminGestionClientesPage />
                </AdminLayout>
              }
            />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;