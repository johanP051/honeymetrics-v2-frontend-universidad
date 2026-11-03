import React, { useState, useRef, useEffect } from "react";
import styles from "./Navbar.module.css";
import { useAuth } from "../../context/AuthContext";
import HomeIcon from '@mui/icons-material/Home';
import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import { Container } from '@mui/material';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import HistoryIcon from '@mui/icons-material/History';
import TableChartIcon from '@mui/icons-material/TableChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import logo from '../assets/logo.png';

export default function Navbar() {
  const [cerrado, setCerrado] = useState(true);
  const [iconoBajoMouse, setIconoBajoMouse] = useState(null);
  const [indicadorY, setIndicadorY] = useState(0);
  const temporizadorHover = useRef(null);
  const navbarRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const enlacesRef = useRef({});

  function claseIcono(ruta, isActive) {
    const debeDestacar = iconoBajoMouse === ruta || (iconoBajoMouse === null && isActive);
    return debeDestacar ? styles.iconoActivo : styles.iconoInactivo;
  }

  function moverIndicador(ruta) {
    const enlace = enlacesRef.current[ruta];
    const navbar = navbarRef.current;
    if (enlace && navbar) {
      const enlaceRect = enlace.getBoundingClientRect();
      const navbarRect = navbar.getBoundingClientRect();
      setIndicadorY(enlaceRect.top - navbarRect.top + enlaceRect.height / 2);
    }
  }

  useEffect(() => {
    window.requestAnimationFrame(() => moverIndicador(iconoBajoMouse || location.pathname));
  }, [iconoBajoMouse, location.pathname, cerrado]);

  useEffect(() => {
    const actualizar = () => moverIndicador(iconoBajoMouse || location.pathname);
    window.addEventListener('resize', actualizar);
    return () => window.removeEventListener('resize', actualizar);
  }, [iconoBajoMouse, location.pathname]);

  function eventosIndicador(ruta) {
    return {
      onPointerEnter: (e) => {
        if (e.pointerType !== 'mouse') return;
        window.clearTimeout(temporizadorHover.current);
        temporizadorHover.current = window.setTimeout(() => {
          setIconoBajoMouse(ruta);
          moverIndicador(ruta);
        }, 0);
      },
      onMouseLeave: () => {
        window.clearTimeout(temporizadorHover.current);
      },
    };
  }

  function salirDeNavegacion() {
    window.clearTimeout(temporizadorHover.current);
    setIconoBajoMouse(null);
    moverIndicador(location.pathname);
  }

  async function cerrarSesion() {
    await logout();
    void navigate("/login");
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-hm-gold focus:text-slate-950 focus:font-bold focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Saltar al contenido principal
      </a>

      <header className="md:hidden sticky top-0 z-30 bg-hm-card/95 backdrop-blur-md border-b border-hm-border px-2 sm:px-3.5 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-3 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 overflow-hidden">
          <button
            type="button"
            onClick={() => setCerrado(!cerrado)}
            aria-label="Abrir menú"
            className="p-1 -ml-1 text-hm-muted hover:text-hm-gold transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-hm-gold rounded-lg"
          >
            <MenuOpenIcon sx={{ fontSize: 20 }} />
          </button>
          <img src={logo} alt="HoneyMetrics Logo" className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0" />
          <span className="font-display font-bold text-hm-gold text-xs sm:text-base truncate">
            HoneyMetrics
          </span>
        </div>

        <button
          type="button"
          onClick={cerrarSesion}
          aria-label="Salir de la sesión"
          className="flex items-center gap-1 px-2 min-[340px]:px-2.5 py-1.5 rounded-lg border border-hm-danger/30 text-hm-danger hover:bg-hm-danger/10 text-xs font-semibold transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-hm-danger"
        >
          <LogoutIcon sx={{ fontSize: 16 }} aria-hidden="true" />
          <span className="hidden min-[340px]:inline">Salir</span>
        </button>
      </header>

      {!cerrado && (
        <button
          type="button"
          className={styles.capaOscura}
          aria-label="Cerrar menú de navegación"
          onClick={() => setCerrado(true)}
        />
      )}

      <Container
        ref={navbarRef}
        className={`${styles.contenedorNavbar} ${cerrado ? '' : styles.abierto}`}
        onMouseLeave={salirDeNavegacion}
      >
        <Link to="/home" className={styles.marca} aria-label="HoneyMetrics, ir al inicio">
          <img src={logo} alt="" className={styles.logo} />
          <span className={styles.nombreMarca}>
            Honey<span>Metrics</span>
          </span>
        </Link>

        <button
          type="button"
          className={styles.botonMenu}
          aria-label={cerrado ? "Expandir menú de navegación" : "Contraer menú de navegación"}
          aria-expanded={!cerrado}
          onClick={() => setCerrado(!cerrado)}
        >
          <MenuOpenIcon />
        </button>

        <span className={styles.indicadorActivo} style={{ top: indicadorY }} aria-hidden="true" />

        <Container className={styles.accionMedia}>
          <NavLink end to="/home" ref={(el) => { enlacesRef.current['/home'] = el; }} className={({ isActive }) => claseIcono('/home', isActive)} {...eventosIndicador('/home')}><HomeIcon /><span className={styles.textoEnlace}>Home</span></NavLink>
          <NavLink to="/blacklist" ref={(el) => { enlacesRef.current['/blacklist'] = el; }} className={({ isActive }) => claseIcono('/blacklist', isActive)} {...eventosIndicador('/blacklist')}><VpnLockIcon /><span className={styles.textoEnlace}>Blacklist Ip</span></NavLink>
          <NavLink to="/logs" ref={(el) => { enlacesRef.current['/logs'] = el; }} className={({ isActive }) => claseIcono('/logs', isActive)} {...eventosIndicador('/logs')}><HistoryIcon /><span className={styles.textoEnlace}>Historial de Logs</span></NavLink>
          <NavLink to="/dashboard" ref={(el) => { enlacesRef.current['/dashboard'] = el; }} className={({ isActive }) => claseIcono('/dashboard', isActive)} {...eventosIndicador('/dashboard')}><TableChartIcon /><span className={styles.textoEnlace}>Dashboard</span></NavLink>
          <NavLink to="/admin" ref={(el) => { enlacesRef.current['/admin'] = el; }} className={({ isActive }) => claseIcono('/admin', isActive)} {...eventosIndicador('/admin')}><AdminPanelSettingsIcon /><span className={styles.textoEnlace}>Admin</span></NavLink>
        </Container>

        <Container className={styles.accionInferior}>
          <NavLink to="/settings" ref={(el) => { enlacesRef.current['/settings'] = el; }} className={({ isActive }) => claseIcono('/settings', isActive)} {...eventosIndicador('/settings')}><AccountCircleIcon /><span className={styles.textoEnlace}>Perfil</span></NavLink>
          <button
            ref={(el) => { enlacesRef.current['/logout'] = el; }}
            className={iconoBajoMouse === '/logout' ? styles.iconoActivo : styles.iconoInactivo}
            {...eventosIndicador('/logout')}
            onClick={cerrarSesion}
          >
            <LogoutIcon />
            <span className={styles.textoEnlace}>Cerrar sesión</span>
          </button>
        </Container>
      </Container>
    </>
  );
}
