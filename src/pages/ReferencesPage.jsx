import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/references'

function ReferencesPage() {
  const [references, setReferences] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingReference, setEditingReference] = useState(null)
  const [formData, setFormData] = useState({ clientName: '', company: '', testimonial: '', rating: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchReferences()
  }, [])

  const fetchReferences = async () => {
    try {
      const res = await axios.get(API_URL)
      setReferences(res.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingReference) {
        await axios.put(`${API_URL}/${editingReference._id}`, formData)
        alert('Reference updated!')
      } else {
        await axios.post(API_URL, formData)
        alert('Reference created!')
      }
      setShowForm(false)
      setEditingReference(null)
      setFormData({ clientName: '', company: '', testimonial: '', rating: '' })
      fetchReferences()
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Something went wrong'))
    }
    setLoading(false)
  }

  const handleEdit = (ref) => {
    setEditingReference(ref)
    setFormData({
      clientName: ref.clientName,
      company: ref.company || '',
      testimonial: ref.testimonial,
      rating: ref.rating || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this reference?')) {
      try {
        await axios.delete(`${API_URL}/${id}`)
        alert('Reference deleted!')
        fetchReferences()
      } catch (error) {
        alert('Delete failed')
      }
    }
  }

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">References</h1>
        <button onClick={() => { setShowForm(true); setEditingReference(null); setFormData({ clientName: '', company: '', testimonial: '', rating: '' }) }} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Add Reference
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">{editingReference ? 'Edit Reference' : 'New Reference'}</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Client Name" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} className="w-full border rounded p-2 mb-3" required />
            <input type="text" placeholder="Company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full border rounded p-2 mb-3" />
            <textarea placeholder="Testimonial" value={formData.testimonial} onChange={(e) => setFormData({...formData, testimonial: e.target.value})} className="w-full border rounded p-2 mb-3" rows="3" required />
            <input type="number" placeholder="Rating (1-5)" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} className="w-full border rounded p-2 mb-3" min="1" max="5" />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={loading}>{loading ? 'Saving...' : editingReference ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingReference(null) }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {references.map(ref => (
          <div key={ref._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{ref.clientName}</h3>
                {ref.company && <p className="text-gray-600 text-sm">{ref.company}</p>}
                {ref.rating && <div className="text-yellow-500 text-sm mt-1">{renderStars(ref.rating)}</div>}
                <p className="text-gray-600 mt-2 italic">"{ref.testimonial}"</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(ref)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Edit</button>
                <button onClick={() => handleDelete(ref._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {references.length === 0 && !showForm && <div className="text-center text-gray-500 py-8">No references yet. Click "Add Reference" to get started!</div>}
    </div>
  )
}

export default ReferencesPage