import React, { useState } from "react";
import styles from "./Navbar.module.css"
import { useAuth } from "../../context/AuthContext";
import HomeIcon from '@mui/icons-material/Home';
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Container } from '@mui/material';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import HistoryIcon from '@mui/icons-material/History';
import TableChartIcon from '@mui/icons-material/TableChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import LogoutIcon from '@mui/icons-material/Logout';
import api from '../../api/client';


function Navbar(){
    const [cerrado, setCerrado] = React.useState(true);
    const [abierto, setAbierto] = React.useState(false);
    const [error, setError] = React.useState('');
    const {logout} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

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
        <Container className={styles.contenedorNavbar}> 
            <Link to="/home">{location.pathname == "/home" ? <HomeIcon/> : <h1>2</h1>}</Link>
            <Link to="/blacklist">{location.pathname == "/blacklist" ? <VpnLockIcon/> : <h1>3</h1>}</Link>
            <Link to="/logs">{location.pathname == "/logs" ? <HistoryIcon/> : <h1>1</h1>}</Link>
            <Link to="/dashboard">{location.pathname == "/dashboard" ? <TableChartIcon/> : <h1>2</h1>}</Link>
            <Link><AccessibilityIcon/></Link>
            <Link><AccountCircleIcon/></Link>
            <button onClick={cerrarSesion}> <LogoutIcon/></button>
        </Container>
        </>
    );
}
export default Navbar;