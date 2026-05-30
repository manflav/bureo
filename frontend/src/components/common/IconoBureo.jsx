export default function IconoBureo({ size = 32, color = '#FF5C00' }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size}>
      {/* Líneas largas */}
      <line x1="100" y1="100" x2="100" y2="20"  stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="100" x2="100" y2="180" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="100" x2="20"  y2="100" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="100" x2="180" y2="100" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="100" y1="100" x2="44"  y2="44"  stroke={color} strokeWidth="2"   strokeLinecap="round"/>
      <line x1="100" y1="100" x2="156" y2="156" stroke={color} strokeWidth="2"   strokeLinecap="round"/>
      <line x1="100" y1="100" x2="156" y2="44"  stroke={color} strokeWidth="2"   strokeLinecap="round"/>
      <line x1="100" y1="100" x2="44"  y2="156" stroke={color} strokeWidth="2"   strokeLinecap="round"/>
      {/* Líneas cortas */}
      <line x1="100" y1="100" x2="68"  y2="30"  stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="100" y1="100" x2="132" y2="30"  stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="100" y1="100" x2="170" y2="68"  stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="100" y1="100" x2="170" y2="132" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="100" y1="100" x2="132" y2="170" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="100" y1="100" x2="68"  y2="170" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="100" y1="100" x2="30"  y2="132" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="100" y1="100" x2="30"  y2="68"  stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      {/* Puntos */}
      <circle cx="100" cy="18"  r="3.5" fill={color}/>
      <circle cx="100" cy="182" r="3.5" fill={color}/>
      <circle cx="18"  cy="100" r="5"   fill={color}/>
      <circle cx="182" cy="100" r="3.5" fill={color}/>
      <circle cx="32"  cy="32"  r="3"   fill={color}/>
      <circle cx="168" cy="168" r="3"   fill={color}/>
      <circle cx="168" cy="32"  r="3"   fill={color}/>
      <circle cx="32"  cy="168" r="5"   fill={color}/>
      {/* Centro */}
      <polygon points="100,94 102,98 106,100 102,102 100,106 98,102 94,100 98,98" fill={color}/>
    </svg>
  )
}