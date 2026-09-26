import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/common/ScrollToTop.jsx'
import DevConfigBanner from './components/common/DevConfigBanner.jsx'
import Home from './pages/Home.jsx'
import ListYourNetwork from './pages/ListYourNetwork.jsx'

export default function App() {
  return (
    <>
      {/* Fixed atmosphere behind everything — never scrolls. */}
      <div className="backdrop" aria-hidden="true" />
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<ListYourNetwork />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
      <DevConfigBanner />
    </>
  )
}
