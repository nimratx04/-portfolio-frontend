import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/projects'

function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', technologies: '', githubLink: '', liveLink: '', imageUrl: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await axios.get(API_URL)
      setProjects(res.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const data = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim())
    }
    try {
      if (editingProject) {
        await axios.put(`${API_URL}/${editingProject._id}`, data)
        alert('Project updated!')
      } else {
        await axios.post(API_URL, data)
        alert('Project created!')
      }
      setShowForm(false)
      setEditingProject(null)
      setFormData({ title: '', description: '', technologies: '', githubLink: '', liveLink: '', imageUrl: '' })
      fetchProjects()
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Something went wrong'))
    }
    setLoading(false)
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || '',
      imageUrl: project.imageUrl || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this project?')) {
      try {
        await axios.delete(`${API_URL}/${id}`)
        alert('Project deleted!')
        fetchProjects()
      } catch (error) {
        alert('Delete failed')
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button onClick={() => { setShowForm(true); setEditingProject(null); setFormData({ title: '', description: '', technologies: '', githubLink: '', liveLink: '', imageUrl: '' }) }} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Add Project
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">{editingProject ? 'Edit Project' : 'New Project'}</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full border rounded p-2 mb-3" required />
            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border rounded p-2 mb-3" rows="3" required />
            <input type="text" placeholder="Technologies (comma-separated)" value={formData.technologies} onChange={(e) => setFormData({...formData, technologies: e.target.value})} className="w-full border rounded p-2 mb-3" required />
            <input type="url" placeholder="GitHub Link" value={formData.githubLink} onChange={(e) => setFormData({...formData, githubLink: e.target.value})} className="w-full border rounded p-2 mb-3" />
            <input type="url" placeholder="Live Link" value={formData.liveLink} onChange={(e) => setFormData({...formData, liveLink: e.target.value})} className="w-full border rounded p-2 mb-3" />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={loading}>{loading ? 'Saving...' : editingProject ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingProject(null) }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map(project => (
          <div key={project._id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg">{project.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{project.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {project.technologies.map((tech, i) => (
                <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{tech}</span>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleEdit(project)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Edit</button>
              <button onClick={() => handleDelete(project._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !showForm && <div className="text-center text-gray-500 py-8">No projects yet. Click "Add Project" to get started!</div>}
    </div>
  )
}

export default ProjectsPage