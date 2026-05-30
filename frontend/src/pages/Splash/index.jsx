import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Splash.css'

export default function Splash() {
  const navigate = useNavigate()
  const [saliendo, setSaliendo] = useState(false)

  useEffect(() => {
    const timerSalida = setTimeout(() => setSaliendo(true), 3500)
    const timerNavega = setTimeout(() => navigate('/explorar'), 4200)
    return () => {
      clearTimeout(timerSalida)
      clearTimeout(timerNavega)
    }
  }, [navigate])

  return (
    <div className={`splash ${saliendo ? 'splash--saliendo' : ''}`}>

      <video className="splash__video" autoPlay muted loop playsInline>
        <source src="/src/assets/videos/splash.mp4" type="video/mp4" />
      </video>

      <div className="splash__overlay" />

      <div className="splash__content">
        <div className="splash__firework">
          <svg viewBox="0 0 200 200" width="160" height="160">
            <line className="fw-line fw-l1" x1="100" y1="100" x2="100" y2="20"  stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line className="fw-line fw-l2" x1="100" y1="100" x2="100" y2="180" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line className="fw-line fw-l3" x1="100" y1="100" x2="20"  y2="100" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line className="fw-line fw-l4" x1="100" y1="100" x2="180" y2="100" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line className="fw-line fw-l5" x1="100" y1="100" x2="44"  y2="44"  stroke="white" strokeWidth="2"   strokeLinecap="round"/>
            <line className="fw-line fw-l6" x1="100" y1="100" x2="156" y2="156" stroke="white" strokeWidth="2"   strokeLinecap="round"/>
            <line className="fw-line fw-l7" x1="100" y1="100" x2="156" y2="44"  stroke="white" strokeWidth="2"   strokeLinecap="round"/>
            <line className="fw-line fw-l8" x1="100" y1="100" x2="44"  y2="156" stroke="white" strokeWidth="2"   strokeLinecap="round"/>
            <line className="fw-line fw-s1" x1="100" y1="100" x2="68"  y2="30"  stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <line className="fw-line fw-s2" x1="100" y1="100" x2="132" y2="30"  stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <line className="fw-line fw-s3" x1="100" y1="100" x2="170" y2="68"  stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <line className="fw-line fw-s4" x1="100" y1="100" x2="170" y2="132" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <line className="fw-line fw-s5" x1="100" y1="100" x2="132" y2="170" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <line className="fw-line fw-s6" x1="100" y1="100" x2="68"  y2="170" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <line className="fw-line fw-s7" x1="100" y1="100" x2="30"  y2="132" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <line className="fw-line fw-s8" x1="100" y1="100" x2="30"  y2="68"  stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <circle className="fw-dot fw-d1" cx="100" cy="18"  r="3.5" fill="white"/>
            <circle className="fw-dot fw-d2" cx="100" cy="182" r="3.5" fill="white"/>
            <circle className="fw-dot fw-d3" cx="18"  cy="100" r="5"   fill="white"/>
            <circle className="fw-dot fw-d4" cx="182" cy="100" r="3.5" fill="white"/>
            <circle className="fw-dot fw-d5" cx="32"  cy="32"  r="3"   fill="white"/>
            <circle className="fw-dot fw-d6" cx="168" cy="168" r="3"   fill="white"/>
            <circle className="fw-dot fw-d7" cx="168" cy="32"  r="3"   fill="white"/>
            <circle className="fw-dot fw-d8" cx="32"  cy="168" r="5"   fill="white"/>
            <polygon className="fw-center" points="100,94 102,98 106,100 102,102 100,106 98,102 94,100 98,98" fill="white"/>
          </svg>
        </div>
        <div className="splash__logo">bureo</div>
        <p className="splash__slogan">El mapa de las fiestas de Andalucía</p>
      </div>

    </div>
  )
}