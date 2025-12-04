import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/admin/AdminLayout';

// Componentes de Seguridad
import ProtectedRoute from './components/auth/ProtectedRoute'; // <-- 1. IMPORTAMOS EL GUARDIA

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
import LoginPage from './pages/public/LoginPage';

// Páginas Admin
import AdminHomePage from './pages/admin/AdminHomePage';
import AdminGestionProductosPage from './pages/admin/AdminGestionProductosPage';
import AdminCreateProductoPage from './pages/admin/AdminCreateProductoPage';
import AdminGestionPedidosPage from './pages/admin/AdminGestionPedidosPage';
import AdminGestionClientesPage from './pages/admin/AdminGestionClientesPage';
// Utils y Contextos
import ScrollToTop from './utils/ScrollToTop';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import NotificationToast from './components/ui/common/NotificationToast'; 


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>

          <NotificationToast />
          <ScrollToTop />

          <Routes>

            {/* BLOQUE 1: RUTAS PÚBLICAS (Acceso libre)*/}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/catalogo" element={<PublicLayout><CatalogoPage /></PublicLayout>} />
            <Route path="/producto/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
            <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />

            {/* Carrito y Checkout son públicos para permitir compra como invitado */}
            <Route path="/carrito" element={<PublicLayout><CarritoPage /></PublicLayout>} />
            <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
            <Route path="/confirmacion" element={<PublicLayout><ConfirmacionPage /></PublicLayout>} />

            {/* Rutas de Autenticación (Públicas) */}
            <Route path="/login" element={<PublicLayout showFooter={false}><LoginPage /></PublicLayout>} />
            <Route path="/registro" element={<PublicLayout showFooter={false}><RegisterPage /></PublicLayout>} />


            {/* BLOQUE 2: RUTAS DE USUARIO (Protegidas)*/}
            <Route
              path="/perfil"
              element={
                // 2. PROTEGEMOS EL PERFIL
                // Si no está logueado, lo manda al login
                <ProtectedRoute>
                  <PublicLayout><UserProfilePage /></PublicLayout>
                </ProtectedRoute>
              }
            />

            {/*BLOQUE 3: RUTAS DE ADMINISTRACIÓN (Protegidas + Admin)*/}
            <Route
              path="/admin"
              element={
                // 3. PROTEGEMOS EL ADMIN
                // Si no es admin, lo manda al home
                <ProtectedRoute requireAdmin={true}>
                  <AdminLayout><AdminHomePage /></AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/productos"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminGestionProductosPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/crear-producto"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminCreateProductoPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/editar/:id"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminCreateProductoPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/pedidos"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminGestionPedidosPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/clientes"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminGestionClientesPage /> 
                </ProtectedRoute>
              }
            />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;