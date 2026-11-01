import React, { useEffect, useRef } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { ESTILOS_ESTADO } from '../../components/common/estados';
import styles from './logs.module.css';

export default function LogsHeaderToolbar({
  busqueda,
  onBusquedaChange,
  onBuscar,
  menuFiltrosAbierto,
  estados,
  estadosSeleccionados,
  onAlternarFiltro,
  onCerrarFiltro,
  onAlternarEstado,
  onLimpiar,
  filterButtonRef,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuFiltrosAbierto) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCerrarFiltro();
        filterButtonRef?.current?.focus();
      }
    };

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        filterButtonRef?.current &&
        !filterButtonRef.current.contains(e.target)
      ) {
        onCerrarFiltro();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuFiltrosAbierto, onCerrarFiltro, filterButtonRef]);

  return (
    <Toolbar className={styles.headerBarra} component="header">
      <Typography component="h1" className={styles.titulo}>
        Historial de exportaciones
      </Typography>
      <div className={styles.toolbarActions}>
        <form className={styles.searchForm} onSubmit={onBuscar} role="search" aria-label="Búsqueda de exportaciones">
          <label className={styles.srOnly} htmlFor="buscar-registros">
            Buscar por ID, cantidad o fecha
          </label>
          <input
            id="buscar-registros"
            type="search"
            value={busqueda}
            onChange={(event) => onBusquedaChange(event.target.value)}
            placeholder="ID, cantidad o fecha"
            aria-label="Buscar exportaciones por ID, cantidad o fecha"
          />
          {busqueda ? (
            <IconButton
              type="button"
              className={styles.clearSearch}
              onClick={onLimpiar}
              aria-label="Limpiar campo de búsqueda"
            >
              <CloseIcon aria-hidden="true" />
            </IconButton>
          ) : null}
          <button type="submit" className={styles.searchButton}>
            <SearchOutlinedIcon aria-hidden="true" />
            <span>Buscar</span>
          </button>
        </form>
        <div className={styles.filterMenuContainer}>
          <button
            ref={filterButtonRef}
            type="button"
            className={`${styles.filterButton} ${menuFiltrosAbierto ? styles.filterButtonActive : ''}`}
            onClick={onAlternarFiltro}
            aria-expanded={menuFiltrosAbierto}
            aria-controls="filtro-estados-menu"
            aria-haspopup="true"
          >
            <FilterListOutlinedIcon aria-hidden="true" />
            <span>Filtro</span>
          </button>
          {menuFiltrosAbierto && (
            <div
              ref={menuRef}
              id="filtro-estados-menu"
              className={styles.filterMenu}
              role="region"
              aria-label="Opciones de filtro por estado"
            >
              <fieldset className={styles.filterFieldset}>
                <legend className={styles.filterLegend}>Filtrar por estado</legend>
                {estados.map((estado) => {
                  const colores = ESTILOS_ESTADO[estado] || { borde: '#3B4655', fondo: '#1B212B', color: '#E3EAF1' };
                  const seleccionado = estadosSeleccionados.includes(estado);
                  return (
                    <label className={styles.filterOption} key={estado}>
                      <input
                        type="checkbox"
                        checked={seleccionado}
                        onChange={() => onAlternarEstado(estado)}
                        aria-label={`Filtrar estado ${estado}`}
                      />
                      <span
                        className={styles.statusCheck}
                        style={{ '--estado-borde': colores.borde, '--estado-fondo': colores.fondo, '--estado-check': colores.color }}
                        aria-hidden="true"
                      >
                        {seleccionado ? '✓' : ''}
                      </span>
                      <span>{estado}</span>
                    </label>
                  );
                })}
              </fieldset>
            </div>
          )}
        </div>
      </div>
    </Toolbar>
  );
}
