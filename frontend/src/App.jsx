import { Routes, Route, Outlet } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Splash from './pages/Splash'
import Mapa from './pages/Home'
import Explorar from './pages/Explore'
import Calendario from './pages/Calendar'
import DetalleEvento from './pages/EventDetail'
import { FestivalsProvider } from './context/FestivalsContext'

function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default function App() {
  return (
    <FestivalsProvider>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route element={<LayoutWrapper />}>
          <Route path="/mapa"         element={<Mapa />} />
          <Route path="/explorar"     element={<Explorar />} />
          <Route path="/calendario"   element={<Calendario />} />
          <Route path="/festival/:id" element={<DetalleEvento />} />
        </Route>
      </Routes>
    </FestivalsProvider>
  )
}