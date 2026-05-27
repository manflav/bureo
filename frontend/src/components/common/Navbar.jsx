import './Navbar.css'

export default function Navbar() {
  return (
    <header className="navbar">
      <button className="navbar__btn" aria-label="Menú">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 6H20M4 12H20M4 18H20"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <span className="navbar__logo">Bureo</span>

      <button className="navbar__btn" aria-label="Buscar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7"
            stroke="currentColor" strokeWidth="2"/>
          <path d="M16.5 16.5L21 21"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round"/>
        </svg>
      </button>
    </header>
  )
}