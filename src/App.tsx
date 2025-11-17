import './components/layout/Header.tsx';
import './components/layout/Footer.tsx';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import HomePage from './pages/public/HomePage';
import CatalogoPage from './pages/public/CatalogoPage';
import BlogPage from './pages/public/BlogPage.tsx';

// (Componentes temporales para las otras rutas)
const LoginPage = () => <h1 style={{ padding: '2rem', height: '100vh' }}>Página de Login</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <PublicLayout><HomePage /></PublicLayout> } />
        <Route path="/login" element={ <PublicLayout showFooter={false}><LoginPage /></PublicLayout> } />

        {/* 2. REEMPLAZA la ruta de catálogo */}
        <Route 
          path="/catalogo" 
          element={ <PublicLayout><CatalogoPage /></PublicLayout> } 
        />

        <Route path="/blog" element={ <PublicLayout><BlogPage /></PublicLayout> } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;


/*
QUÉ
okey
primero
{{}}
por quÉ los corchetes están así basta dios 
lo otro, ya tenía esta duda desde hace rato, por qué <Navbar/>, o sea lo de los <> y el /, por qué sólo uno, si normalemnte son duplicados
QUÉ PUTAS ES EL REACT ROUTER DOM y por qué me trae lo del browserrouter
otra más, afecta en algo si ponog con '' o ""?

useState<Producto[]>([]); QUÉ ES ESO 
también aclara lo del await, entiendo pero no entiendo

Yass si lees esto es porque se me olvidó borrarlo, bórralo de la faz de la tierra
porque no debería estar ahí mi crisis ajskajsk
*/