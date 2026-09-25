import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import ScrollToTop from './components/common/ScrollToTop.jsx'
import DevConfigBanner from './components/common/DevConfigBanner.jsx'
import Home from './pages/Home.jsx'
import ListYourNetwork from './pages/ListYourNetwork.jsx'

/* The landing page plus the listing intake. /directory is still a later step — it
   needs real listings to show, and there are none until applications are reviewed. */
export default function App() {
  return (
    <>
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
