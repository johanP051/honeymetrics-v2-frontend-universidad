import TaskAltIcon from '@mui/icons-material/TaskAlt';

function Estado({texto}){
    let color = "";
    let colorBorde = "";
    let fondo = "";
    let icono = null;
    if (texto == "Listo"){
        icono = <TaskAltIcon/>;
        colorBorde = "#338A5E";
        color = "#338A5E";
        fondo = "#1E2E30";
        
    }else if (texto == "Pendiente"){
        colorBorde = "#EDC217";
        color = "#EDC217";
        fondo = "#323227";
    }else if (texto == "Procesando"){
        colorBorde = "#D2AE19";
        color = "#D2AE19";
        fondo = "#2D2D29";
    }
    else if (texto == "Rechazada"){
        colorBorde = "#C4665E";
        color = "#C4665E";
        fondo = "#2C272D";
    }


    return(
        <div style={{border: '1px solid', borderColor: colorBorde, backgroundColor: fondo, display: 'inline-flex', padding: '4px 8px',
      borderRadius: '4px' }} >
            <p style={{color: color}}>{texto}</p>
        </div>
    );
}

export default Estado;