import { useEffect, useRef, useState } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Style, Circle, Fill, Stroke } from 'ol/style'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'
import { useNavigate } from 'react-router-dom'
import { IMAGENES_CATEGORIAS } from '../../utils/categoriaImagenes'
import { getFiestas, getCategorias, getProvincias } from '../../services/festivalsService'
import 'ol/ol.css'
import './Home.css'

const CAPAS = [
  { id: 'claro',    label: 'Claro',    url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' },
  { id: 'satelite', label: 'Satélite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' },
  { id: 'osm',      label: 'OSM',      url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png' },
]

const ESTILO_NORMAL = new Style({
  image: new Circle({
    radius: 9,
    fill: new Fill({ color: '#1B3A6B' }),
    stroke: new Stroke({ color: '#FFFFFF', width: 2 }),
  }),
})

const ESTILO_ACTIVO = new Style({
  image: new Circle({
    radius: 11,
    fill: new Fill({ color: '#FF5C00' }),
    stroke: new Stroke({ color: '#FFFFFF', width: 2 }),
  }),
})

export default function Mapa() {
  const mapRef            = useRef(null)
  const mapInstance       = useRef(null)
  const vectorSourceRef   = useRef(null)
  const tileLayerRef      = useRef(null)
  const filtrosRefMovil   = useRef(null)
  const filtrosRefDesktop = useRef(null)
  const navigate          = useNavigate()

  const [fiestas, setFiestas]                       = useState([])
  const [fiestaSeleccionada, setFiestaSeleccionada] = useState(null)
  const [popupVisible, setPopupVisible]             = useState(false)
  const [capaActiva, setCapaActiva]                 = useState('claro')
  const [categorias, setCategorias]                 = useState([])
  const [provincias, setProvincias]                 = useState([])
  const [categoriaActiva, setCategoriaActiva]       = useState(null)
  const [provinciaActiva, setProvinciaActiva]       = useState(null)
  const [fechaInicio, setFechaInicio]               = useState('')
  const [fechaFin, setFechaFin]                     = useState('')
  const [desplegable, setDesplegable]               = useState(null)

  // Cerrar desplegable al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (e.target.type === 'date') return
      if (e.target.closest('.mapa-filtros__dropdown--fecha')) return
      if (e.target.closest('.mapa-filtros__dropdown')) return

      const dentroMovil   = filtrosRefMovil.current?.contains(e.target)
      const dentroDesktop = filtrosRefDesktop.current?.contains(e.target)
      if (!dentroMovil && !dentroDesktop) {
        setDesplegable(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Cargar categorías y provincias
  useEffect(() => {
    getCategorias().then(setCategorias)
    getProvincias().then(setProvincias)
  }, [])

  // Ajustar vista del mapa a los puntos
  const ajustarVistaFiestas = (data) => {
    setTimeout(() => {
      if (!mapInstance.current || data.length === 0) return

      const conCoords = data.filter(f => f.lng && f.lat)
      if (conCoords.length === 0) return

      if (conCoords.length === 1) {
        mapInstance.current.getView().animate({
          center: fromLonLat([parseFloat(conCoords[0].lng), parseFloat(conCoords[0].lat)]),
          zoom: 12,
          duration: 800,
        })
        return
      }

      const lngs   = conCoords.map(f => parseFloat(f.lng))
      const lats   = conCoords.map(f => parseFloat(f.lat))
      const minLng = Math.min(...lngs)
      const maxLng = Math.max(...lngs)
      const minLat = Math.min(...lats)
      const maxLat = Math.max(...lats)

      const extent = [
        ...fromLonLat([minLng, minLat]),
        ...fromLonLat([maxLng, maxLat]),
      ]

      mapInstance.current.getView().fit(extent, {
        padding: [60, 60, 60, 60],
        duration: 800,
        maxZoom: 12,
      })
    }, 100)
  }

  // Cargar fiestas con filtros
  useEffect(() => {
    const filters = {}
    if (categoriaActiva) filters.categoria    = categoriaActiva
    if (provinciaActiva) filters.provincia    = provinciaActiva
    if (fechaInicio)     filters.fecha_inicio = fechaInicio
    if (fechaFin)        filters.fecha_fin    = fechaFin
    getFiestas(filters).then(data => {
      setFiestas(data)
      if (data.length > 0) setFiestaSeleccionada(data[0])
      ajustarVistaFiestas(data)
    })
  }, [categoriaActiva, provinciaActiva, fechaInicio, fechaFin])

  // Inicializar mapa
  useEffect(() => {
    const tileLayer = new TileLayer({
      source: new XYZ({ url: CAPAS[0].url })
    })
    tileLayerRef.current = tileLayer

    const map = new Map({
      target: mapRef.current,
      layers: [tileLayer],
      view: new View({
        center: fromLonLat([-4.5, 37.5]),
        zoom: 7,
      }),
    })
    mapInstance.current = map
    return () => map.setTarget(null)
  }, [])

  // Cambiar capa
  useEffect(() => {
    if (!tileLayerRef.current) return
    const capa = CAPAS.find(c => c.id === capaActiva)
    if (capa) tileLayerRef.current.setSource(new XYZ({ url: capa.url }))
  }, [capaActiva])

  // Actualizar pins
  useEffect(() => {
    if (!mapInstance.current) return

    if (vectorSourceRef.current) {
      vectorSourceRef.current.getFeatures()
        .filter(f => f.get('fiesta'))
        .forEach(f => vectorSourceRef.current.removeFeature(f))
    }

    if (fiestas.length === 0) return

    const features = fiestas
      .filter(f => f.lng && f.lat)
      .map(f => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([parseFloat(f.lng), parseFloat(f.lat)])),
          fiesta: f,
        })
        feature.setStyle(ESTILO_NORMAL)
        return feature
      })

    if (!vectorSourceRef.current) {
      const vectorSource = new VectorSource({ features })
      vectorSourceRef.current = vectorSource
      const vectorLayer = new VectorLayer({ source: vectorSource })
      mapInstance.current.addLayer(vectorLayer)

      mapInstance.current.on('click', (e) => {
        const hit = mapInstance.current.forEachFeatureAtPixel(e.pixel, (feature) => {
          const fiesta = feature.get('fiesta')
          if (fiesta) {
            seleccionarFiesta(fiesta)
            return true
          }
        })
        if (!hit) setPopupVisible(false)
      })

      mapInstance.current.on('pointermove', (e) => {
        const hit = mapInstance.current.hasFeatureAtPixel(e.pixel)
        mapInstance.current.getTargetElement().style.cursor = hit ? 'pointer' : ''
      })
    } else {
      features.forEach(f => vectorSourceRef.current.addFeature(f))
    }

    features[0]?.setStyle(ESTILO_ACTIVO)
  }, [fiestas])

  const seleccionarFiesta = (f) => {
    if (vectorSourceRef.current) {
      vectorSourceRef.current.getFeatures().forEach(feat => {
        if (feat.get('fiesta')) feat.setStyle(ESTILO_NORMAL)
      })
      vectorSourceRef.current.getFeatures().forEach(feat => {
        if (feat.get('fiesta')?.id === f.id) feat.setStyle(ESTILO_ACTIVO)
      })
    }
    setFiestaSeleccionada(f)
    setPopupVisible(true)
    setDesplegable(null)
    if (mapInstance.current && f.lng && f.lat) {
      mapInstance.current.getView().animate({
        center: fromLonLat([parseFloat(f.lng), parseFloat(f.lat)]),
        zoom: 12,
        duration: 800,
      })
    }
  }

  const geolocalizarme = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        if (vectorSourceRef.current) {
          vectorSourceRef.current.getFeatures()
            .filter(f => f.get('tipo') === 'geolocalizacion')
            .forEach(f => vectorSourceRef.current.removeFeature(f))
        }
        const halo = new Feature({
          geometry: new Point(fromLonLat([longitude, latitude])),
          tipo: 'geolocalizacion',
        })
        halo.setStyle(new Style({
          image: new Circle({
            radius: 20,
            fill: new Fill({ color: 'rgba(74, 144, 217, 0.2)' }),
            stroke: new Stroke({ color: 'rgba(74, 144, 217, 0.4)', width: 1 }),
          }),
        }))
        const punto = new Feature({
          geometry: new Point(fromLonLat([longitude, latitude])),
          tipo: 'geolocalizacion',
        })
        punto.setStyle(new Style({
          image: new Circle({
            radius: 10,
            fill: new Fill({ color: '#4A90D9' }),
            stroke: new Stroke({ color: '#FFFFFF', width: 3 }),
          }),
        }))
        if (vectorSourceRef.current) {
          vectorSourceRef.current.addFeature(halo)
          vectorSourceRef.current.addFeature(punto)
        }
        if (mapInstance.current) {
          mapInstance.current.getView().animate({
            center: fromLonLat([longitude, latitude]),
            zoom: 14,
            duration: 800,
          })
        }
      },
      () => alert('No se pudo obtener tu ubicación.')
    )
  }

  const resetFiltros = () => {
    setCategoriaActiva(null)
    setProvinciaActiva(null)
    setFechaInicio('')
    setFechaFin('')
    setDesplegable(null)
  }

  const hayFiltros = categoriaActiva || provinciaActiva || fechaInicio || fechaFin
  const categoria  = fiestaSeleccionada?.categoria?.toLowerCase().replace(' ', '')

  const FiltrosContenido = () => (
    <>
      <div className="mapa-filtros__grupo">
        <button
          className={`mapa-filtros__btn ${categoriaActiva ? 'mapa-filtros__btn--activo' : ''} ${desplegable === 'categoria' ? 'mapa-filtros__btn--abierto' : ''}`}
          onClick={() => setDesplegable(desplegable === 'categoria' ? null : 'categoria')}
        >
          {categoriaActiva || 'Categoría'}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        {desplegable === 'categoria' && (
          <div className="mapa-filtros__dropdown">
            <button className={`mapa-filtros__opcion ${!categoriaActiva ? 'mapa-filtros__opcion--activa' : ''}`}
              onClick={() => { setCategoriaActiva(null); setDesplegable(null) }}>Todas</button>
            {categorias.map(cat => (
              <button key={cat.id}
                className={`mapa-filtros__opcion ${categoriaActiva === cat.nombre ? 'mapa-filtros__opcion--activa' : ''}`}
                onClick={() => { setCategoriaActiva(cat.nombre); setDesplegable(null) }}>
                {cat.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mapa-filtros__grupo">
        <button
          className={`mapa-filtros__btn ${provinciaActiva ? 'mapa-filtros__btn--activo' : ''} ${desplegable === 'provincia' ? 'mapa-filtros__btn--abierto' : ''}`}
          onClick={() => setDesplegable(desplegable === 'provincia' ? null : 'provincia')}
        >
          {provinciaActiva || 'Provincia'}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        {desplegable === 'provincia' && (
          <div className="mapa-filtros__dropdown">
            <button className={`mapa-filtros__opcion ${!provinciaActiva ? 'mapa-filtros__opcion--activa' : ''}`}
              onClick={() => { setProvinciaActiva(null); setDesplegable(null) }}>Todas</button>
            {provincias.map(p => (
              <button key={p.id}
                className={`mapa-filtros__opcion ${provinciaActiva === p.nombre ? 'mapa-filtros__opcion--activa' : ''}`}
                onClick={() => { setProvinciaActiva(p.nombre); setDesplegable(null) }}>
                {p.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mapa-filtros__grupo">
        <button
          className={`mapa-filtros__btn ${(fechaInicio || fechaFin) ? 'mapa-filtros__btn--activo' : ''} ${desplegable === 'fecha' ? 'mapa-filtros__btn--abierto' : ''}`}
          onClick={() => setDesplegable(desplegable === 'fecha' ? null : 'fecha')}
        >
          {fechaInicio ? fechaInicio : 'Fecha'}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        {desplegable === 'fecha' && (
          <div className="mapa-filtros__dropdown mapa-filtros__dropdown--fecha">
            <label className="mapa-filtros__label">Desde</label>
            <input type="date" className="mapa-filtros__date" value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)} />
            <label className="mapa-filtros__label">Hasta</label>
            <input type="date" className="mapa-filtros__date" value={fechaFin}
              onChange={e => setFechaFin(e.target.value)} />
            <button className="mapa-filtros__aplicar" onClick={() => setDesplegable(null)}>
              Aplicar
            </button>
          </div>
        )}
      </div>

      {hayFiltros && (
        <button className="mapa-filtros__reset" onClick={resetFiltros}>
          ✕ Limpiar filtros
        </button>
      )}
    </>
  )

  const PopupContenido = () => (
    fiestaSeleccionada && popupVisible ? (
      <>
        <button className="mapa-popup__cerrar" onClick={() => setPopupVisible(false)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="mapa-popup__img-wrap">
          <img
            src={IMAGENES_CATEGORIAS[categoria] || IMAGENES_CATEGORIAS['feria']}
            alt={fiestaSeleccionada.nombre}
            className="mapa-popup__img"
          />
          <span className="mapa-popup__badge">{fiestaSeleccionada.categoria}</span>
        </div>
        <div className="mapa-popup__body">
          <h3 className="mapa-popup__titulo">{fiestaSeleccionada.nombre}</h3>
          <p className="mapa-popup__lugar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                fill="currentColor"/>
            </svg>
            {fiestaSeleccionada.municipio}, {fiestaSeleccionada.provincia}
          </p>
          <p className="mapa-popup__fecha">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {fiestaSeleccionada.fecha_inicio?.slice(0, 10)}
            {fiestaSeleccionada.fecha_fin && ` — ${fiestaSeleccionada.fecha_fin?.slice(0, 10)}`}
          </p>
          {fiestaSeleccionada.descripcion_corta && (
            <p className="mapa-popup__desc">{fiestaSeleccionada.descripcion_corta}</p>
          )}
          <button
            className="mapa-popup__btn"
            onClick={() => navigate(`/festival/${fiestaSeleccionada.id}`)}
          >
            Ver detalles
          </button>
        </div>
      </>
    ) : null
  )

  return (
    <div className="mapa-page">
      <div ref={mapRef} className="mapa-canvas" />

      {/* Selector de capas */}
      <div className="mapa-capas">
        {CAPAS.map(c => (
          <button
            key={c.id}
            className={`mapa-capas__btn ${capaActiva === c.id ? 'mapa-capas__btn--activo' : ''}`}
            onClick={() => setCapaActiva(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Botón geolocalización */}
      <button className="mapa-geo" onClick={geolocalizarme} aria-label="Mi ubicación">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </button>

      {/* Filtros flotantes móvil/tablet */}
      <div className="mapa-filtros" ref={filtrosRefMovil}>
        <FiltrosContenido />
      </div>

      {/* Popup móvil y tablet */}
      {fiestaSeleccionada && popupVisible && (
        <div className="mapa-popup-movil">
          <div className="mapa-popup__backdrop" onClick={() => setPopupVisible(false)} />
          <div className="mapa-popup__panel">
            <PopupContenido />
          </div>
        </div>
      )}

      {/* Popup desktop */}
      {fiestaSeleccionada && popupVisible && (
        <div className="mapa-popup-desktop">
          <div className="mapa-popup__panel">
            <PopupContenido />
          </div>
        </div>
      )}

      {/* Sidebar desktop */}
      <aside className="mapa-sidebar">
        <div className="mapa-sidebar__filtros" ref={filtrosRefDesktop}>
          <FiltrosContenido />
        </div>

        <h2 className="mapa-sidebar__titulo">
          Fiestas
          <span className="mapa-sidebar__count">{fiestas.length}</span>
        </h2>

        <div className="mapa-sidebar__lista">
          {fiestas.map(f => {
            const cat = f.categoria?.toLowerCase().replace(' ', '')
            return (
              <button
                key={f.id}
                className={`mapa-sidebar__item ${fiestaSeleccionada?.id === f.id ? 'mapa-sidebar__item--activo' : ''}`}
                onClick={() => seleccionarFiesta(f)}
              >
                <img
                  src={IMAGENES_CATEGORIAS[cat] || IMAGENES_CATEGORIAS['feria']}
                  alt={f.nombre}
                  className="mapa-sidebar__img"
                />
                <div className="mapa-sidebar__info">
                  <span className="mapa-sidebar__categoria">{f.categoria?.toUpperCase()}</span>
                  <p className="mapa-sidebar__nombre">{f.nombre}</p>
                  <p className="mapa-sidebar__ciudad">{f.municipio}</p>
                </div>
              </button>
            )
          })}
        </div>
      </aside>
    </div>
  )
}