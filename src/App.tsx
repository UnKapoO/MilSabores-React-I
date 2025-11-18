import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import HomePage from './pages/public/HomePage';
import CatalogoPage from './pages/public/CatalogoPage';
import BlogPage from './pages/public/BlogPage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import ScrollToTop from './utils/ScrollToTop';
import CarritoPage from './pages/public/CarritoPage';
// (Componentes temporales para las otras rutas)
const LoginPage = () => <h1 style={{ padding: '2rem', height: '100vh' }}>Página de Login</h1>;

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={ <PublicLayout><HomePage /></PublicLayout> } />
        <Route path="/login" element={ <PublicLayout showFooter={false}><LoginPage /></PublicLayout> } />
        <Route 
          path="/catalogo" 
          element={ <PublicLayout><CatalogoPage /></PublicLayout> } 
        />
        <Route path="/producto/:id" element={ <PublicLayout><ProductDetailPage /></PublicLayout> } />
        <Route path="/blog" element={ <PublicLayout><BlogPage /></PublicLayout> } />
        <Route path="/carrito" element={ <PublicLayout><CarritoPage /></PublicLayout> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

