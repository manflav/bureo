import Navbar from '../common/Navbar'
import BottomNav from '../common/BottomNav'
import './Layout.css'

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}