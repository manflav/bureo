import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'
import IconoBureo from './IconoBureo'

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="navbar">
      <button className="navbar__btn navbar__hamburger" aria-label="Menú"
        onClick={() => setMenuAbierto(!menuAbierto)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 6H20M4 12H20M4 18H20"
            stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

        <span className="navbar__logo">
            <IconoBureo size={22} color="#FF5C00" />
            Bureo
        </span>

      {/* Links para desktop */}
      <nav className="navbar__links">
        <NavLink to="/mapa"        className={({ isActive }) => isActive ? 'active' : ''}>Mapa</NavLink>
        <NavLink to="/explorar"    className={({ isActive }) => isActive ? 'active' : ''}>Explorar</NavLink>
        <NavLink to="/calendario"  className={({ isActive }) => isActive ? 'active' : ''}>Calendario</NavLink>
      </nav>

      <button className="navbar__btn" aria-label="Buscar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
          <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Menú desplegable móvil/tablet */}
      {menuAbierto && (
        <div className="navbar__dropdown">
          <NavLink to="/mapa"       onClick={() => setMenuAbierto(false)}>Mapa</NavLink>
          <NavLink to="/explorar"   onClick={() => setMenuAbierto(false)}>Explorar</NavLink>
          <NavLink to="/calendario" onClick={() => setMenuAbierto(false)}>Calendario</NavLink>
        </div>
      )}
    </header>
  )
}