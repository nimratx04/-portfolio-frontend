import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import UsersPage from './pages/UsersPage'
import ProjectsPage from './pages/ProjectsPage'
import ServicesPage from './pages/ServicesPage'
import ReferencesPage from './pages/ReferencesPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-indigo-600 text-white p-4 shadow-lg">
          <div className="container mx-auto flex gap-6">
            <Link to="/" className="hover:text-indigo-200 font-semibold">Users</Link>
            <Link to="/projects" className="hover:text-indigo-200 font-semibold">Projects</Link>
            <Link to="/services" className="hover:text-indigo-200 font-semibold">Services</Link>
            <Link to="/references" className="hover:text-indigo-200 font-semibold">References</Link>
          </div>
        </nav>
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<UsersPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/references" element={<ReferencesPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App