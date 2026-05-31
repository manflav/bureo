import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getFiestaById } from '../../services/festivalsService'
import { IMAGENES_CATEGORIAS } from '../../utils/categoriaImagenes'
import './EventDetail.css'

export default function DetalleEvento() {
  const { id }               = useParams()
  const navigate             = useNavigate()
  const [fiesta, setFiesta]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFiestaById(id)
      .then(setFiesta)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="detalle-loader">Cargando...</div>
  if (!fiesta)  return <div className="detalle-loader">Fiesta no encontrada.</div>

  const categoria = fiesta.categoria?.toLowerCase().replace(' ', '')

  const formatFecha = () => {
    const ini = fiesta.fecha_inicio?.slice(0, 10)
    const fin = fiesta.fecha_fin?.slice(0, 10)
    if (!fin || ini === fin) return ini
    return `${ini} — ${fin}`
  }

  const compartir = () => {
    if (navigator.share) {
      navigator.share({
        title: fiesta.nombre,
        text: `${fiesta.nombre} — ${fiesta.municipio}, ${fiesta.provincia}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Enlace copiado al portapapeles')
    }
  }

  return (
    <div className="detalle">

      {/* Hero con botones encima */}
      <div className="detalle-hero">
        <img
          src={IMAGENES_CATEGORIAS[categoria] || IMAGENES_CATEGORIAS['feria']}
          alt={fiesta.nombre}
          className="detalle-hero__img"
        />

        {/* Botones sobre la foto */}
        <div className="detalle-hero__acciones">
          <button className="detalle-hero__back" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Volver
          </button>
          <button className="detalle-hero__compartir" onClick={compartir}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="18" cy="5"  r="3" stroke="currentColor" strokeWidth="2"/>
              <circle cx="6"  cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Overlay con título */}
        <div className="detalle-hero__overlay">
          {fiesta.declaracion && (
            <span className="detalle-hero__declaracion">{fiesta.declaracion}</span>
          )}
          <h1 className="detalle-hero__titulo">{fiesta.nombre}</h1>
          <p className="detalle-hero__lugar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                fill="currentColor"/>
            </svg>
            {fiesta.municipio}, {fiesta.provincia}
          </p>
        </div>
      </div>

      {/* Grid de info rápida */}
      <div className="detalle-info">
        <div className="detalle-info__item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="detalle-info__label">Fecha</span>
          <span className="detalle-info__valor">{formatFecha()}</span>
        </div>
        <div className="detalle-info__item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="detalle-info__label">Tipo</span>
          <span className="detalle-info__valor">{fiesta.categoria}</span>
        </div>
        <div className="detalle-info__item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="detalle-info__label">Ubicación</span>
          <span className="detalle-info__valor">{fiesta.municipio}</span>
        </div>
        {fiesta.aforo && (
          <div className="detalle-info__item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
                stroke="currentColor" strokeWidth="2"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="detalle-info__label">Aforo</span>
            <span className="detalle-info__valor">{fiesta.aforo}</span>
          </div>
        )}
      </div>

      {/* Descripción */}
      {fiesta.descripcion && (
        <section className="detalle-desc">
          <h2 className="detalle-desc__titulo">Sobre la fiesta</h2>
          <p className="detalle-desc__texto">{fiesta.descripcion}</p>
        </section>
      )}

      {/* Gratuita */}
      <div className="detalle-gratuita">
        <span className={`detalle-gratuita__badge ${fiesta.gratuita ? 'detalle-gratuita__badge--si' : 'detalle-gratuita__badge--no'}`}>
          {fiesta.gratuita ? '✓ Entrada gratuita' : 'Entrada de pago'}
        </span>
      </div>

      {/* Gastronomía */}
      {fiesta.gastronomia?.length > 0 && (
        <section className="detalle-seccion">
          <div className="detalle-seccion__header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h2 className="detalle-seccion__titulo">Gastronomía</h2>
          </div>
          <div className="detalle-seccion__chips">
            {fiesta.gastronomia.map(g => (
              <span key={g.id} className="detalle-seccion__chip">{g.nombre}</span>
            ))}
          </div>
          {fiesta.gastronomia.filter(g => g.descripcion).map(g => (
            <p key={g.id} className="detalle-seccion__desc">{g.descripcion}</p>
          ))}
        </section>
      )}

      {/* Vestimenta */}
      {fiesta.vestimenta?.length > 0 && (
        <section className="detalle-seccion">
          <div className="detalle-seccion__header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"
                stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h2 className="detalle-seccion__titulo">Vestimenta</h2>
          </div>
          <div className="detalle-seccion__chips">
            {fiesta.vestimenta.map(v => (
              <span key={v.id} className="detalle-seccion__chip">{v.nombre}</span>
            ))}
          </div>
          {fiesta.vestimenta.filter(v => v.descripcion).map(v => (
            <p key={v.id} className="detalle-seccion__desc">{v.descripcion}</p>
          ))}
        </section>
      )}

      {/* Planifica tu visita */}
      <section className="detalle-planifica">
        <h2 className="detalle-planifica__titulo">Planifica tu visita</h2>
        <div className="detalle-planifica__btns">
          {fiesta.lat && fiesta.lng && (
            <button
              className="detalle-planifica__btn detalle-planifica__btn--primario"
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${fiesta.lat},${fiesta.lng}`, '_blank')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                  fill="currentColor"/>
              </svg>
              Cómo llegar
            </button>
          )}
          <button
            className="detalle-planifica__btn detalle-planifica__btn--secundario"
            onClick={() => navigate(`/mapa?fiesta=${fiesta.id}`)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4M9 7l6-3"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Ver en el mapa
          </button>
          {fiesta.url_info && (
            <button
              className="detalle-planifica__btn detalle-planifica__btn--secundario"
              onClick={() => window.open(fiesta.url_info, '_blank')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Más información
            </button>
          )}
        </div>
      </section>

    </div>
  )
}