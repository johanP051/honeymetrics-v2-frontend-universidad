import React, { useState } from "react";
import styles from "./Navbar.module.css"
import HomeIcon from '@mui/icons-material/Home';
import { useLocation } from "react-router-dom";
import { Container } from '@mui/material';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import HistoryIcon from '@mui/icons-material/History';
import TableChartIcon from '@mui/icons-material/TableChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccessibilityIcon from '@mui/icons-material/Accessibility';


function Navbar(props){
    const [cerrado, setCerrado] = React.useState(true);
    const [abierto, setAbierto] = React.useState(false);
    
    
    return(
        <>
        <Container className={styles.contenedorNavbar}> 
            <button>{useLocation().pathname == "/home" ? <HomeIcon/> : <h1>2</h1>}</button>
            <br />
            <button>{useLocation().pathname == "/blacklist" ? <VpnLockIcon/> : <h1>6</h1>}</button>
            <button>{useLocation().pathname == "/logs" ? <HistoryIcon/> : <h1></h1>}</button>
            <button>{useLocation().pathname == "/dashboard" ? <TableChartIcon/> : <h1>w</h1>}</button>
            <button><AccessibilityIcon/></button>
            <button><AccountCircleIcon/></button>
        </Container>
        </>
    );
}
export default Navbar;