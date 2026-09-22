import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';


const actions = [
  {icon: <GetAppOutlinedIcon/>, name: 'Exportar logs'},
  {icon: <PictureAsPdfOutlinedIcon/>, name: 'Descargar Diccionario'},
]

function speedDial (){
    return (
    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          '& .MuiFab-root': {
            backgroundColor: '#323227',
            color: '#EDC217',
            border: '2px solid #EDC217',
            '&:hover': {
              backgroundColor: '#584b13',
            },
          },
        }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            slotProps={{
              fab: {
                sx: {
                width: 56,
                height: 56,
                minHeight: 56,
                backgroundColor: '#323227',
                color: '#EDC217',
                border: '2px solid #EDC217',
                '&:hover': {
                  backgroundColor: '#584b13',
                },
                },
              },
              tooltip: {
                title: action.name,
              },
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}

export default speedDial;