import './App.css'; 
import './assets/styles/global.css';
import './assets/styles/header.css';
import './assets/styles/footer.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';

// --- Componentes temporales de página ---
const CatalogoPage = () => <h1 style={{ padding: '2rem', height: '100vh' }}>¡Página de Catálogo!</h1>;
const BlogPage = () => <h1 style={{ padding: '2rem', height: '100vh' }}>¡Página de Blog!</h1>;
const LoginPage = () => <h1 style={{ padding: '2rem', height: '100vh' }}>Página de Login</h1>;
const HomePage = () => <h1 style={{ padding: '2rem', height: '100vh' }}>Página de Inicio</h1>;
const EspecialPage = () => <h1 style={{ padding: '2rem', height: '100vh' }}>Tortas Especiales</h1>; 
// ----------------------------------------

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Ruta Principal (con Footer) */}
        <Route 
          path="/" 
          element={ <PublicLayout><HomePage /></PublicLayout> } 
        />

        {/* Ruta de Login (sin Footer) */}
        <Route 
          path="/login" 
          element={ <PublicLayout showFooter={false}><LoginPage /></PublicLayout> } 
        />

        {/* Ruta de Catálogo (con Footer) */}
        <Route 
          path="/catalogo" 
          element={ <PublicLayout><CatalogoPage /></PublicLayout> } 
        />

        {/* Ruta de Blog (con Footer) */}
        <Route 
          path="/blog" 
          element={ <PublicLayout><BlogPage /></PublicLayout> } 
        />

        {/*Ruta especiales */}
        <Route
          path='/especiales'
          element={<PublicLayout><EspecialPage/></PublicLayout>}

        />

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