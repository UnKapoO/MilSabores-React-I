import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import HomePage from './pages/public/HomePage';
import CatalogoPage from './pages/public/CatalogoPage';
import BlogPage from './pages/public/BlogPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import ScrollToTop from './utils/ScrollToTop';
import CarritoPage from './pages/public/CarritoPage';
import CheckoutPage from './pages/public/CheckoutPage';
import ConfirmacionPage from './pages/public/ConfirmacionPage';
//import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import AdminLayout from './components/layout/admin/AdminLayout';
import AdminHomePage from './pages/admin/AdminHomePage';
// (Componentes temporales para las otras rutas)
const LoginPage = () => <h1 style={{ padding: '2rem', height: '100vh' }}>Página de Login</h1>;
import UserProfilePage from './pages/public/UserProfilePage';


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout showFooter={false}><LoginPage /></PublicLayout>} />
        <Route
          path="/catalogo"
          element={<PublicLayout><CatalogoPage /></PublicLayout>}
        />
        <Route path="/producto/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
        <Route path="/carrito" element={<PublicLayout><CarritoPage /></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />


        {/* --- Rutas de Admin --- */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminHomePage />
            </AdminLayout>
          }
        />
        
        <Route path="/" element={ <PublicLayout><HomePage /></PublicLayout> } />
        <Route path="/login" element={ <PublicLayout showFooter={false}><LoginPage /></PublicLayout> } />
        <Route path="/registro" element={ <PublicLayout showFooter={false}><RegisterPage /></PublicLayout> } />
        <Route 
          path="/catalogo" 
          element={ <PublicLayout><CatalogoPage /></PublicLayout> } 
        />
        <Route path="/producto/:id" element={ <PublicLayout><ProductDetailPage /></PublicLayout> } />
        <Route path="/blog" element={ <PublicLayout><BlogPage /></PublicLayout> } />
        <Route path="/carrito" element={ <PublicLayout><CarritoPage /></PublicLayout> } />
        <Route path="/checkout" element={ <PublicLayout><CheckoutPage /></PublicLayout> } />
        <Route path='/confirmacion' element={ <PublicLayout><ConfirmacionPage /></PublicLayout>} />

        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout showFooter={false}><LoginPage /></PublicLayout>} />
        <Route
          path="/catalogo"
          element={<PublicLayout><CatalogoPage /></PublicLayout>}
        />
        <Route path="/producto/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
        <Route path="/carrito" element={<PublicLayout><CarritoPage /></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />

        <Route path="/perfil" element={ <PublicLayout><UserProfilePage /></PublicLayout> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

