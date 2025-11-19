import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.tsx'
import Results from './pages/Results.tsx'
import Company from './pages/Company.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/results" element={<Results />} />
        <Route path="/company/:siren" element={<Company />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
