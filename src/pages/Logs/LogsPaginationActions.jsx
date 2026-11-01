import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import TableCell from '@mui/material/TableCell';
import styles from './logs.module.css';

export function TablePaginationActions({ count, page, rowsPerPage, onPageChange }) {
  const theme = useTheme();

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        className={styles.paginationIconButton}
        onClick={(e) => onPageChange(e, 0)}
        disabled={page === 0}
        aria-label="Primera página"
      >
        {theme.direction === 'rtl' ? <LastPageIcon aria-hidden="true" /> : <FirstPageIcon aria-hidden="true" />}
      </IconButton>
      <IconButton
        className={styles.paginationIconButton}
        onClick={(e) => onPageChange(e, page - 1)}
        disabled={page === 0}
        aria-label="Página anterior"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight aria-hidden="true" /> : <KeyboardArrowLeft aria-hidden="true" />}
      </IconButton>
      <IconButton
        className={styles.paginationIconButton}
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Página siguiente"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft aria-hidden="true" /> : <KeyboardArrowRight aria-hidden="true" />}
      </IconButton>
      <IconButton
        className={styles.paginationIconButton}
        onClick={(e) => onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="Última página"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon aria-hidden="true" /> : <LastPageIcon aria-hidden="true" />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export function TextoAnimado({ texto }) {
  return (
    <p className={styles.textoCelery} aria-label={texto}>
      <span aria-hidden="true">
        {texto.split('').map((caracter, indice) => (
          <span key={`${caracter}-${indice}`} style={{ '--i': indice + 1 }}>
            {caracter === ' ' ? '\u00a0' : caracter}
          </span>
        ))}
      </span>
    </p>
  );
}

export function SortableHeader({ etiqueta, columna, align = 'left', orden, onOrdenar }) {
  const activa = orden.columna === columna;
  const descendente = activa && orden.direccion === 'desc';
  const ordenTexto = activa ? (descendente ? 'descendente' : 'ascendente') : 'sin ordenar';
  const accionSiguiente = activa && !descendente ? 'descendente' : 'ascendente';

  return (
    <TableCell
      component="th"
      scope="col"
      align={align}
      aria-sort={activa ? (descendente ? 'descending' : 'ascending') : 'none'}
    >
      <button
        type="button"
        className={`${styles.sortButton} ${align === 'right' ? styles.sortButtonRight : ''} ${activa ? styles.sortButtonActive : ''}`}
        onClick={() => onOrdenar(columna)}
        aria-label={`Ordenar por ${etiqueta}. Orden actual: ${ordenTexto}. Presione para ordenar ${accionSiguiente}`}
      >
        <span>{etiqueta}</span>
        <ArrowDownwardIcon
          className={`${styles.sortIcon} ${activa && !descendente ? styles.sortIconAsc : ''}`}
          aria-hidden="true"
        />
      </button>
    </TableCell>
  );
}

export const MESES_MAP = {
  enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
  julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11,
};

export function parseFechaSolicitud(fechaStr) {
  if (!fechaStr) return 0;
  const isoTime = new Date(fechaStr).getTime();
  if (!isNaN(isoTime)) return isoTime;

  const regex = /(\d{1,2})\s+de\s+([a-zA-ZáéíóúÁÉÍÓÚ]+)\s+de\s+(\d{4}),?\s+(\d{1,2}):(\d{2})\s*(a\.?m\.?|p\.?m\.?)?/i;
  const match = String(fechaStr).toLowerCase().match(regex);
  if (!match) return 0;

  const dia = parseInt(match[1], 10);
  const mesNombre = match[2];
  const anio = parseInt(match[3], 10);
  let hora = parseInt(match[4], 10);
  const minuto = parseInt(match[5], 10);
  const ampm = match[6];

  const mes = MESES_MAP[mesNombre] ?? -1;
  if (mes === -1) return 0;

  if (ampm) {
    const esPM = ampm.startsWith('p');
    if (esPM && hora < 12) hora += 12;
    if (!esPM && hora === 12) hora = 0;
  }

  return new Date(anio, mes, dia, hora, minuto).getTime();
}
