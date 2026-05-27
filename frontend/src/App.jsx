import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Mapa from './pages/Home'
import Explorar from './pages/Explore'
import Calendario from './pages/Calendar'
import DetalleEvento from './pages/EventDetail'
import { FestivalsProvider } from './context/FestivalsContext'

export default function App() {
  return (
    <FestivalsProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/mapa" replace />} />
          <Route path="/mapa"        element={<Mapa />} />
          <Route path="/explorar"    element={<Explorar />} />
          <Route path="/calendario"  element={<Calendario />} />
          <Route path="/festival/:id" element={<DetalleEvento />} />
        </Routes>
      </Layout>
    </FestivalsProvider>
  )
}