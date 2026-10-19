import React, { useState } from 'react';
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';
import ExportLogsModal from './ExportLogsModal';
import { generarReportePdf } from '../../pages/Logs/reportPdf';

const actions = [
  { icon: <GetAppOutlinedIcon />, name: 'Exportar logs', key: 'export_logs' },
  { icon: <PictureAsPdfOutlinedIcon />, name: 'Descargar Diccionario', key: 'download_dictionary' },
];

function SpeedDialComponent({ onExportSubmit, onExportSuccess, onDownloadDictionary }) {
  const [openModal, setOpenModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleActionClick = async (actionKey) => {
    if (actionKey === 'export_logs') {
      setOpenModal(true);
    } else if (actionKey === 'download_dictionary') {
      if (typeof onDownloadDictionary === 'function') {
        onDownloadDictionary();
      } else {
        try {
          setIsDownloading(true);
          await generarReportePdf('EXP-CANONICAL', {});
        } catch (err) {
          console.error('Error al descargar diccionario:', err);
        } finally {
          setIsDownloading(false);
        }
      }
    }
  };

  return (
    <>
      <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
        <SpeedDial
          ariaLabel="Acciones de exportación y utilidades de logs"
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
              '&:focus-visible': {
                outline: '3px solid #EDC217',
                outlineOffset: '3px',
              },
            },
          }}
          icon={<SpeedDialIcon aria-hidden="true" />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              aria-label={action.name}
              onClick={() => handleActionClick(action.key)}
              slotProps={{
                fab: {
                  'aria-label': action.name,
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
                    '&:focus-visible': {
                      outline: '3px solid #EDC217',
                      outlineOffset: '3px',
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