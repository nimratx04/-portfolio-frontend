import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/services'

function ServicesPage() {
  const [services, setServices] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', price: '', duration: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await axios.get(API_URL)
      setServices(res.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingService) {
        await axios.put(`${API_URL}/${editingService._id}`, formData)
        alert('Service updated!')
      } else {
        await axios.post(API_URL, formData)
        alert('Service created!')
      }
      setShowForm(false)
      setEditingService(null)
      setFormData({ title: '', description: '', price: '', duration: '' })
      fetchServices()
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Something went wrong'))
    }
    setLoading(false)
  }

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price || '',
      duration: service.duration || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this service?')) {
      try {
        await axios.delete(`${API_URL}/${id}`)
        alert('Service deleted!')
        fetchServices()
      } catch (error) {
        alert('Delete failed')
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <button onClick={() => { setShowForm(true); setEditingService(null); setFormData({ title: '', description: '', price: '', duration: '' }) }} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Add Service
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">{editingService ? 'Edit Service' : 'New Service'}</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full border rounded p-2 mb-3" required />
            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border rounded p-2 mb-3" rows="3" required />
            <input type="number" placeholder="Price ($)" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full border rounded p-2 mb-3" />
            <input type="text" placeholder="Duration" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="w-full border rounded p-2 mb-3" />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={loading}>{loading ? 'Saving...' : editingService ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingService(null) }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(service => (
          <div key={service._id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg">{service.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{service.description}</p>
            {service.price && <p className="text-indigo-600 font-semibold mt-2">${service.price}</p>}
            {service.duration && <p className="text-gray-500 text-sm">{service.duration}</p>}
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleEdit(service)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Edit</button>
              <button onClick={() => handleDelete(service._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && !showForm && <div className="text-center text-gray-500 py-8">No services yet. Click "Add Service" to get started!</div>}
    </div>
  )
}

export default ServicesPage