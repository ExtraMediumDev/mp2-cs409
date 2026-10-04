import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import DetailPage from './pages/DetailPage'
import GalleryPage from './pages/GalleryPage'
import ListPage from './pages/ListPage'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <nav>
        <Link to="/">List</Link>
        <Link to="/gallery">Gallery</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/pokemon/:id" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}
