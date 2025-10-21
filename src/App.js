import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import TelaInicial from './pages/Filme/TelaInicial/TelaInicial';
import CadastroOpcoes from './pages/Filme/Cadastro/CadastroOpcoes';
import CadastroFilme from './pages/Filme/Cadastro/CadastroFilme';
import Cadastro from './pages/Usuario/Cadastro/Cadastro';
import EditarConta from './components/EditarConta/EditarConta';
import Login from './pages/Usuario/Login/Login';
import Estatisticas from './pages/Usuario/Estatisticas/Estatisticas';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    let usuarioObj = null;

    try {
      usuarioObj = JSON.parse(usuarioLogado);
    } catch (e) {
      console.warn('Erro ao fazer parse do localStorage:', e);
    }

    if (usuarioObj?.idUsuario) {
      setIsLoggedIn(true);
      setUsuarioLogado(usuarioObj);
    } else {
      setIsLoggedIn(false);
      setUsuarioLogado(null);
    }


  }, [location.pathname]);

  const normalizePathname = (path) => {
    if (path.length > 1 && path.endsWith('/')) {
      return path.slice(0, -1);
    }
    return path;
  };

  const pathname = (
    location.pathname.endsWith("/") && location.pathname.length > 1
      ? location.pathname.slice(0, -1)
      : location.pathname
  ).toLowerCase(); // 

  const noNavbarRoutes = ['/', '/home', '/login', '/cadastro'];

  const shouldShowNavbar = !['/', '/home', '/login', '/cadastro'].includes(pathname);

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    setIsLoggedIn(false);
    setUsuarioLogado(null);
    navigate('/');
  };

  return (
    <>
      {shouldShowNavbar && <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/inicial" element={isLoggedIn ? <TelaInicial usuario={usuarioLogado} /> : <Login />} />
        <Route path="/cadastro-opcoes" element={<CadastroOpcoes />} />
        <Route path="/cadastro-filme" element={<CadastroFilme />} />
        <Route path="/editar-conta" element={<EditarConta />} />
        <Route path="/estatisticas" element={isLoggedIn ? <Estatisticas /> : <Login />} />
      </Routes>
    </>
  );
}

export default App;
