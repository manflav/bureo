import './SearchBar.css'

export default function SearchBar({ value = '', onChange, placeholder = 'Buscar ferias, ciudades o fechas...' }) {
  return (
    <div className="searchbar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
        <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        className="searchbar__input"
        value={value}
        onChange={e => onChange?.(e.target.value)}
      />
    </div>
  )
}