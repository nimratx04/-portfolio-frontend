import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Users, FolderGit2, Briefcase, Star, LayoutDashboard } from 'lucide-react';
import UsersPage from './pages/UsersPage';
import ProjectsPage from './pages/ProjectsPage';
import ServicesPage from './pages/ServicesPage';
import ReferencesPage from './pages/ReferencesPage';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/users', name: 'Users', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { path: '/projects', name: 'Projects', icon: FolderGit2, color: 'from-green-500 to-emerald-500' },
    { path: '/services', name: 'Services', icon: Briefcase, color: 'from-purple-500 to-pink-500' },
    { path: '/references', name: 'References', icon: Star, color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="fixed md:relative w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-full transition-all duration-300 z-50 transform md:translate-x-0" style={{ transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s' }}>
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-10">
              <LayoutDashboard className="w-8 h-8 text-indigo-400" />
              <h1 className="text-xl font-bold">Portfolio Manager</h1>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} shadow-lg`
                        : 'hover:bg-gray-700'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile Header */}
          <div className="md:hidden bg-white shadow-md p-4 sticky top-0 z-40">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="p-4 md:p-8 animate-fade-in">
            <Routes>
              <Route path="/" element={<UsersPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/references" element={<ReferencesPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;