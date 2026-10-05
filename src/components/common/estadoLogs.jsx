import TaskAltIcon from '@mui/icons-material/TaskAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

function Estado({texto}){
    let color = "";
    let colorBorde = "";
    let fondo = "";
    let icono = null;
    if (texto == "Listo"){
        icono = <TaskAltIcon style={{fontSize: '16px', marginLeft: '2px', marginRight: '8px', color: '#48d38e'}}/>;
        colorBorde = "#338A5E";
        color = "#48d38e";
        fondo = "#1E2E30";
        
    }else if (texto == "Pendiente"){
        icono = <WarningAmberIcon style={{fontSize: '17px', marginLeft: '2px', marginRight: '8px'}}/>;
        colorBorde = "#EDC217";
        color = "#EDC217";
        fondo = "#323227";
    }else if (texto == "Procesando"){
        icono = <AccessTimeOutlinedIcon style={{fontSize: '17px', marginLeft: '2px', marginRight: '8px', color: "#bd9b15"}}/>
        colorBorde = "#D2AE19";
        color = "#D2AE19";
        fondo = "#2D2D29";
    }
    else if (texto == "Rechazada"){
        icono = <HighlightOffOutlinedIcon style={{fontSize: '17px', marginLeft: '2px', marginRight: '8px'}}/>
        colorBorde = "#E07A72";
        color = "#E07A72";
        fondo = "#2B1719";
    }


    return(
        <div style={{border: '1px solid', borderColor: colorBorde, backgroundColor: fondo, display: 'inline-flex', padding: '4px 8px',
      borderRadius: '4px' }} >
            <p style={{color: color}}>{icono}{texto}</p>
        </div>
    );
}

export default Estado;