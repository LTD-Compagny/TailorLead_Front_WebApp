import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.tsx'
import Results from './pages/Results.tsx'
import Company from './pages/Company.tsx'
import AnalyseEntreprise from './pages/AnalyseEntreprise.tsx'
// import Test from './pages/Test.tsx'
// import TestIAIcon from './pages/TestIAIcon.tsx'
import TestMiniIA from './pages/TestMiniIA.tsx'
import TestAIBadge from './pages/TestAIBadge.tsx'
// import TestTailorIAButtons from './pages/TestTailorIAButtons.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/results" element={<Results />} />
        <Route path="/company/:siren" element={<Company />} />
        <Route path="/analyse-entreprise" element={<AnalyseEntreprise />} />
        {/* <Route path="/test" element={<Test />} /> */}
        {/* <Route path="/test-ia" element={<TestIAIcon />} /> */}
        <Route path="/test-mini-ia" element={<TestMiniIA />} />
        <Route path="/test-ai-badge" element={<TestAIBadge />} />
        {/* <Route path="/test-ia-dynamic" element={<TestTailorIAButtons />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
