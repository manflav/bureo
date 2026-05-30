import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../../components/common/SearchBar'
import './Explore.css'
import { IMAGENES_CATEGORIAS } from '../../utils/categoriaImagenes'
import {
  getFiestasDestacadas,
  getFiestas,
  getCategorias
} from '../../services/festivalsService'

export default function Explorar() {
  const [categorias, setCategorias]         = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState(null)
  const [fiestas, setFiestas]               = useState([])
  const [destacada, setDestacada]           = useState(null)
  const [query, setQuery]                   = useState('')
  const [provinciaActiva, setProvinciaActiva] = useState(null)

  // Cargar categorías
  useEffect(() => {
    getCategorias().then(setCategorias)
  }, [])

  // Cargar destacada
  useEffect(() => {
    getFiestasDestacadas().then(data => setDestacada(data[0]))
  }, [])

  // Cargar fiestas con filtros
  useEffect(() => {
    const filters = {}
    if (categoriaActiva)  filters.categoria = categoriaActiva
    if (query)            filters.q         = query
    if (provinciaActiva)  filters.provincia = provinciaActiva
    getFiestas(filters).then(setFiestas)
  }, [categoriaActiva, query, provinciaActiva])

  return (
    <div className="explore">
      <SearchBar value={query} onChange={setQuery} />
      <HeroCard fiesta={destacada} />
      <Categorias
        categorias={categorias}
        activa={categoriaActiva}
        onSelect={setCategoriaActiva}
      />
      <ProximasFiestas fiestas={fiestas} />
      <DescubreProvincia onSelect={setProvinciaActiva} activa={provinciaActiva} />    </div>
  )
}

function HeroCard({ fiesta }) {
  const navigate = useNavigate()
  if (!fiesta) return null
  const categoria = fiesta.categoria?.toLowerCase().replace(' ', '')

  return (
    <div className="hero-card">
      <img
        src={IMAGENES_CATEGORIAS[categoria] || IMAGENES_CATEGORIAS['feria']}
        alt={fiesta.nombre}
        className="hero-card__img"
      />
      <div className="hero-card__overlay">
        <span className="hero-card__badge">Destacado</span>
        <h2 className="hero-card__title">{fiesta.nombre}</h2>
        <p className="hero-card__location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              fill="currentColor"/>
          </svg>
          {fiesta.municipio} · {fiesta.fecha_inicio?.slice(0, 10)}
        </p>
        <button
          className="hero-card__btn"
          onClick={() => navigate(`/festival/${fiesta.id}`)}
        >
          Ver detalles
        </button>
      </div>
    </div>
  )
}

function Categorias({ categorias, activa, onSelect }) {
  return (
    <div className="categorias">
      <button
        className={`categorias__chip ${!activa ? 'categorias__chip--activo' : ''}`}
        onClick={() => onSelect(null)}
      >
        Todas
      </button>
      {categorias.map(cat => (
        <button
          key={cat.id}
          className={`categorias__chip ${activa === cat.nombre ? 'categorias__chip--activo' : ''}`}
          onClick={() => onSelect(cat.nombre)}
        >
          {cat.nombre}
        </button>
      ))}
    </div>
  )
}

function ProximasFiestas({ fiestas }) {
  const navigate = useNavigate()

  return (
    <section className="proximas">
      <div className="proximas__header">
        <h2 className="proximas__titulo">Próximas Fiestas</h2>
        <span className="proximas__contador">{fiestas.length} encontradas</span>
      </div>
      <div className="proximas__lista">
        {fiestas.map(f => {
          const cat = f.categoria?.toLowerCase().replace(' ', '')
          return (
            <div
              key={f.id}
              className="proximas__card"
              onClick={() => navigate(`/festival/${f.id}`)}
            >
              <div className="proximas__img-wrap">
                <img
                  src={IMAGENES_CATEGORIAS[cat] || IMAGENES_CATEGORIAS['feria']}
                  alt={f.nombre}
                  className="proximas__img"
                />
                <span className="proximas__badge">{f.categoria}</span>
              </div>
              <p className="proximas__nombre">{f.nombre}</p>
              <p className="proximas__lugar">{f.municipio} · {f.fecha_inicio?.slice(0, 7)}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function DescubreProvincia({ onSelect, activa }) {
  const provincias = [
    { nombre: 'Almería', img: 'https://plus.unsplash.com/premium_photo-1697729633663-9d48ce741e9b?w=400&q=80' },
    { nombre: 'Cádiz',   img: 'https://images.unsplash.com/photo-1610807974000-c536ca329d61?w=400&q=80' },
    { nombre: 'Córdoba', img: 'https://images.unsplash.com/photo-1732799208209-29cfcff75d3b?w=400&q=80' },
    { nombre: 'Granada', img: 'https://images.unsplash.com/photo-1602024444756-f046553a8ec9?w=400&q=80' },
    { nombre: 'Huelva',  img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' },
    { nombre: 'Jaén',    img: 'https://images.unsplash.com/photo-1609763951640-c0d7bd98b257?w=400&q=80' },
    { nombre: 'Málaga',  img: 'https://images.unsplash.com/photo-1641667710644-fb8a6abf2a06?w=400&q=80' },
    { nombre: 'Sevilla', img: 'https://images.unsplash.com/photo-1560964598-dee5d2b9dd6b?w=400&q=80' },
  ]

  return (
    <section className="provincias">
      <div className="provincias__header">
        <h2 className="provincias__titulo">Descubre por Provincia</h2>
        {activa && (
          <button className="provincias__reset" onClick={() => onSelect(null)}>
            Ver todas
          </button>
        )}
      </div>
      <div className="provincias__grid">
        {provincias.map(p => (
          <div
            key={p.nombre}
            className={`provincias__item ${activa === p.nombre ? 'provincias__item--activo' : ''}`}
            onClick={() => onSelect(activa === p.nombre ? null : p.nombre)}
          >
            <img src={p.img} alt={p.nombre} className="provincias__img" />
            <span className="provincias__nombre">{p.nombre.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </section>
  )
}