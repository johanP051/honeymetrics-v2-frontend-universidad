import TaskAltIcon from '@mui/icons-material/TaskAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

export const ESTILOS_ESTADO = {
    Listo: { color: '#48d38e', borde: '#338A5E', fondo: '#1E2E30' },
    'Pendiente de Aprobación': { color: '#EDC217', borde: '#EDC217', fondo: '#323227' },
    Monitoreada: { color: '#EDC217', borde: '#EDC217', fondo: '#323227' },
    Procesando: { color: '#D2AE19', borde: '#D2AE19', fondo: '#2D2D29' },
    Rechazada: { color: '#E07A72', borde: '#E07A72', fondo: '#2B1719' },
    Bloqueada: { color: '#E07A72', borde: '#E07A72', fondo: '#2B1719' },
};

function Estado({ texto, mostrarIcono = true }) {
    const { color = '', borde: colorBorde = '', fondo = '' } = ESTILOS_ESTADO[texto] || {};
    let icono = null;

    if (texto === "Listo") {
        icono = <TaskAltIcon style={{fontSize: '16px', marginLeft: '2px', marginRight: '8px', color: '#48d38e'}}/>;
    } else if (texto === "Pendiente de Aprobación" || texto === "Monitoreada") {
        icono = <WarningAmberIcon style={{fontSize: '17px', marginLeft: '2px', marginRight: '8px'}}/>;
    } else if (texto === "Procesando") {
        icono = <AccessTimeOutlinedIcon style={{fontSize: '17px', marginLeft: '2px', marginRight: '8px', color: "#bd9b15"}}/>;
    } else if (texto === "Rechazada" || texto === "Bloqueada") {
        icono = <HighlightOffOutlinedIcon style={{fontSize: '17px', marginLeft: '2px', marginRight: '8px'}}/>;
    }

    return(
        <div style={{border: '1px solid', borderColor: colorBorde, backgroundColor: fondo, display: 'inline-flex', padding: '4px 8px', borderRadius: '4px'}}>
            <p style={{color: color}}>{mostrarIcono ? icono : null}{texto}</p>
        </div>
    );
}

export default Estado;
