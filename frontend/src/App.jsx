import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../routes/AppRoutes.jsx';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === '/' && window.location.hash.startsWith('#/')) {
      navigate(window.location.hash.slice(1), { replace: true });
    }
  }, [navigate]);

  return <AppRoutes />;
}
