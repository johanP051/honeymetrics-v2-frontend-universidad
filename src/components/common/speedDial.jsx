import React, { useState } from 'react';
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';
import ExportLogsModal from './ExportLogsModal';

const actions = [
  { icon: <GetAppOutlinedIcon />, name: 'Exportar logs', key: 'export_logs' },
  { icon: <PictureAsPdfOutlinedIcon />, name: 'Descargar Diccionario', key: 'download_dictionary' },
];

function SpeedDialComponent({ onExportSubmit, onExportSuccess }) {
  const [openModal, setOpenModal] = useState(false);

  const handleActionClick = (actionKey) => {
    if (actionKey === 'export_logs') {
      setOpenModal(true);
    }
  };

  return (
    <>
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
              onClick={() => handleActionClick(action.key)}
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

      {/* Modal de interfaz para exportar logs */}
      <ExportLogsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={onExportSubmit}
        onExportSuccess={onExportSuccess}
      />
    </>
  );
}

export default SpeedDialComponent;