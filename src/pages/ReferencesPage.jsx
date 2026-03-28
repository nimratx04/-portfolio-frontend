import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Star, Building, User, Quote } from 'lucide-react';
import { referenceAPI } from '../services/api';
import toast from 'react-hot-toast';

function ReferencesPage() {
  const [references, setReferences] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReference, setEditingReference] = useState(null);
  const [formData, setFormData] = useState({ clientName: '', company: '', testimonial: '', rating: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReferences();
  }, []);

  const fetchReferences = async () => {
    setLoading(true);
    try {
      const response = await referenceAPI.getAll();
      setReferences(response.data);
    } catch (error) {
      toast.error('Failed to fetch references');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingReference) {
        await referenceAPI.update(editingReference._id, formData);
        toast.success('Reference updated successfully');
      } else {
        await referenceAPI.create(formData);
        toast.success('Reference created successfully');
      }
      setIsModalOpen(false);
      setEditingReference(null);
      setFormData({ clientName: '', company: '', testimonial: '', rating: '' });
      fetchReferences();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (reference) => {
    setEditingReference(reference);
    setFormData({
      clientName: reference.clientName,
      company: reference.company || '',
      testimonial: reference.testimonial,
      rating: reference.rating || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reference?')) {
      setLoading(true);
      try {
        await referenceAPI.delete(id);
        toast.success('Reference deleted successfully');
        fetchReferences();
      } catch (error) {
        toast.error('Failed to delete reference');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Client Testimonials</h1>
          <p className="text-gray-600 mt-1">What your clients say about your work</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {references.map((reference) => (
          <div key={reference._id} className="card hover:shadow-2xl transition-all duration-300 group relative">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleEdit(reference)} className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50">
                <Edit2 className="w-4 h-4 text-gray-600" />
              </button>
              <button onClick={() => handleDelete(reference._id)} className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50">
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-14 h-14 rounded-full flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{reference.clientName}</h3>
                {reference.company && (
                  <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                    <Building className="w-3 h-3" />
                    <span>{reference.company}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <div className="flex gap-1 mb-3">
                {reference.rating && renderStars(reference.rating)}
              </div>
              <div className="relative">
                <Quote className="w-8 h-8 text-gray-200 absolute -top-2 -left-2" />
                <p className="text-gray-600 italic pl-6">"{reference.testimonial}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {references.length === 0 && !loading && (
        <div className="card text-center py-12">
          <Quote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No testimonials yet. Add your first client review!</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{editingReference ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="label">Client Name *</label>
                <input type="text" name="clientName" value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} className="input-field" required />
              </div>
              <div className="mb-4">
                <label className="label">Company</label>
                <input type="text" name="company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="input-field" />
              </div>
              <div className="mb-4">
                <label className="label">Testimonial *</label>
                <textarea name="testimonial" value={formData.testimonial} onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })} className="input-field" rows="3" required />
              </div>
              <div className="mb-6">
                <label className="label">Rating (1-5)</label>
                <input type="number" name="rating" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} className="input-field" min="1" max="5" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1" disabled={loading}>{loading ? 'Saving...' : editingReference ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReferencesPage;