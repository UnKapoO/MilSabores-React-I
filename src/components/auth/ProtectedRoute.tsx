import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean; // Para proteger rutas de admin
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Si no está logueado, mandar al login
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user?.rol !== 'admin') {
        // Si requiere admin y no lo es, mandar al home (o página de acceso denegado)
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;