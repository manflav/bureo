import SearchBar from '../../components/common/SearchBar'
import './Explore.css'

export default function Explorar() {
  return (
    <div className="explore">
      <SearchBar />
      <HeroCard />
      <Categorias />
      <ProximasFiestas />
      <DescubreProvincia />
    </div>
  )
}

function HeroCard() {
  return (
    <div className="hero-card">
      <img
        src="https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80"
        alt="Feria de Abril"
        className="hero-card__img"
      />
      <div className="hero-card__overlay">
        <span className="hero-card__badge">Destacado</span>
        <h2 className="hero-card__title">Feria de Abril</h2>
        <p className="hero-card__location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              fill="currentColor"/>
          </svg>
          Sevilla · 14 - 20 de Abril
        </p>
        <button className="hero-card__btn">Ver detalles</button>
      </div>
    </div>
  )
}

function Categorias() {
  const cats = [
    { label: 'Ferias',        activo: true },
    { label: 'Romerías',      activo: false },
    { label: 'Semana Santa',  activo: false },
    { label: 'Carnavales',    activo: false },
    { label: 'Verbenas',      activo: false },
  ]

  return (
    <div className="categorias">
      {cats.map(cat => (
        <button
          key={cat.label}
          className={`categorias__chip ${cat.activo ? 'categorias__chip--activo' : ''}`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}

function ProximasFiestas() {

  const fiestas = [
  { nombre: 'Feria del Caballo', lugar: 'Jerez de la Frontera', mes: 'Mayo',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { nombre: 'Fiesta de los Patios', lugar: 'Córdoba', mes: 'Mayo',
    img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80' },
]

  return (
    <section className="proximas">
      <div className="proximas__header">
        <h2 className="proximas__titulo">Próximas Fiestas</h2>
        <button className="proximas__ver-todas">Ver todas</button>
      </div>
      <div className="proximas__lista">
        {fiestas.map(f => (
          <div key={f.nombre} className="proximas__card">
            <img src={f.img} alt={f.nombre} className="proximas__img" />
            <p className="proximas__nombre">{f.nombre}</p>
            <p className="proximas__lugar">{f.lugar} · {f.mes}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function DescubreProvincia() {
    const provincias = [
    { nombre: 'SEVILLA', img: 'https://images.unsplash.com/photo-1559564436-978e6986e7c5?w=400&q=80' },
    { nombre: 'GRANADA', img: 'https://images.unsplash.com/photo-1591465153780-ede0e7a64f4c?w=400&q=80' },
    { nombre: 'CÓRDOBA', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80' },
    { nombre: 'MÁLAGA',  img: 'https://images.unsplash.com/photo-1571406252241-db0280bd36cd?w=400&q=80' },
    ]

  return (
    <section className="provincias">
      <h2 className="provincias__titulo">Descubre por Provincia</h2>
      <div className="provincias__grid">
        {provincias.map(p => (
          <div key={p.nombre} className="provincias__item">
            <img src={p.img} alt={p.nombre} className="provincias__img" />
            <span className="provincias__nombre">{p.nombre}</span>
          </div>
        ))}
      </div>
    </section>
  )
}