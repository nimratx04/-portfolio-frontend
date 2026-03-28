import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/users'

function UsersPage() {
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', role: '', bio: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL)
      setUsers(res.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingUser) {
        await axios.put(`${API_URL}/${editingUser._id}`, formData)
        alert('User updated!')
      } else {
        await axios.post(API_URL, formData)
        alert('User created!')
      }
      setShowForm(false)
      setEditingUser(null)
      setFormData({ name: '', email: '', role: '', bio: '' })
      fetchUsers()
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || 'Something went wrong'))
    }
    setLoading(false)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role || '',
      bio: user.bio || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this user?')) {
      try {
        await axios.delete(`${API_URL}/${id}`)
        alert('User deleted!')
        fetchUsers()
      } catch (error) {
        alert('Delete failed')
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <button 
          onClick={() => { setShowForm(true); setEditingUser(null); setFormData({ name: '', email: '', role: '', bio: '' }) }}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Add User
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">{editingUser ? 'Edit User' : 'New User'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border rounded p-2 mb-3"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full border rounded p-2 mb-3"
              required
            />
            <input
              type="text"
              placeholder="Role"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full border rounded p-2 mb-3"
            />
            <textarea
              placeholder="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full border rounded p-2 mb-3"
              rows="3"
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={loading}>
                {loading ? 'Saving...' : editingUser ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingUser(null) }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <div key={user._id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg">{user.name}</h3>
            <p className="text-gray-600 text-sm">{user.email}</p>
            {user.role && <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded mt-2">{user.role}</span>}
            {user.bio && <p className="text-gray-500 text-sm mt-2">{user.bio}</p>}
            <div className="flex gap-2 mt-3">
              <button onClick={() => handleEdit(user)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Edit</button>
              <button onClick={() => handleDelete(user._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && !showForm && (
        <div className="text-center text-gray-500 py-8">No users yet. Click "Add User" to get started!</div>
      )}
    </div>
  )
}

export default UsersPage