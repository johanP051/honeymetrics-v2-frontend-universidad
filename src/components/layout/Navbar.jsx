import React, { useState } from "react";
import styles from "./Navbar.module.css"
import { useAuth } from "../../context/AuthContext";
import HomeIcon from '@mui/icons-material/Home';
import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import { Container } from '@mui/material';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import HistoryIcon from '@mui/icons-material/History';
import TableChartIcon from '@mui/icons-material/TableChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import api from '../../api/client';
import logo from '../assets/logo.png';

function Navbar(){
    //Que cerrado este en True, significa que la navbar debe estar cerrada, no debe estar expandida.
    const [cerrado, setCerrado] = React.useState(true);
    const [error, setError] = React.useState('');
    const [iconoBajoMouse, setIconoBajoMouse] = React.useState(null);
    const [indicadorY, setIndicadorY] = React.useState(0);
    const temporizadorHover = React.useRef(null);
        const navbarRef = React.useRef(null);
    const {logout} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const enlacesRef = React.useRef({});

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

    React.useEffect(() => {
        window.requestAnimationFrame(() => moverIndicador(iconoBajoMouse || location.pathname));
    }, [iconoBajoMouse, location.pathname, cerrado]);

    React.useEffect(() => {
        const actualizar = () => moverIndicador(iconoBajoMouse || location.pathname);
        window.addEventListener('resize', actualizar);
        return () => window.removeEventListener('resize', actualizar);
    }, [iconoBajoMouse, location.pathname]);

    function eventosIndicador(ruta) {
    return {
        onPointerEnter: (e) => {
            if (e.pointerType !== 'mouse') return;   // ignora toques
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

    async function cerrarSesion(){
        try{
            setError('');
            await api.post('/auth/logout');
            logout()
            navigate("/home");
        } catch (err){
            setError('No fue posible cerrar la sesión exitosamente')
        }
    }

    
    return(
    <>
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
            <NavLink end to="/home" ref={(enlace) => { enlacesRef.current['/home'] = enlace; }} className={({ isActive }) => claseIcono('/home', isActive)} {...eventosIndicador('/home')}><HomeIcon /><span className={styles.textoEnlace}>Home</span></NavLink>
            <NavLink to="/blacklist" ref={(enlace) => { enlacesRef.current['/blacklist'] = enlace; }} className={({ isActive }) => claseIcono('/blacklist', isActive)} {...eventosIndicador('/blacklist')}><VpnLockIcon /><span className={styles.textoEnlace}>Blacklist Ip</span></NavLink>
            <NavLink to="/logs" ref={(enlace) => { enlacesRef.current['/logs'] = enlace; }} className={({ isActive }) => claseIcono('/logs', isActive)} {...eventosIndicador('/logs')}><HistoryIcon /><span className={styles.textoEnlace}>Historial de Logs</span></NavLink>
            <NavLink to="/dashboard" ref={(enlace) => { enlacesRef.current['/dashboard'] = enlace; }} className={({ isActive }) => claseIcono('/dashboard', isActive)} {...eventosIndicador('/dashboard')}><TableChartIcon /><span className={styles.textoEnlace}>Dashboard</span></NavLink>
        </Container>

        <Container className={styles.accionInferior}>
            <Link className={styles.iconoInactivo}><AccessibilityIcon /><span className={styles.textoEnlace}>Accesibilidad</span></Link>
            <Link className={styles.iconoInactivo}><AccountCircleIcon /><span className={styles.textoEnlace}>Perfil</span></Link>
            <button
                ref={(enlace) => { enlacesRef.current['/logout'] = enlace; }}
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
export default Navbar;
