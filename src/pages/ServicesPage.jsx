import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Briefcase, DollarSign, Clock, Package } from 'lucide-react';
import { serviceAPI } from '../services/api';
import toast from 'react-hot-toast';

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', price: '', duration: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await serviceAPI.getAll();
      setServices(response.data);
    } catch (error) {
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingService) {
        await serviceAPI.update(editingService._id, formData);
        toast.success('Service updated successfully');
      } else {
        await serviceAPI.create(formData);
        toast.success('Service created successfully');
      }
      setIsModalOpen(false);
      setEditingService(null);
      setFormData({ title: '', description: '', price: '', duration: '' });
      fetchServices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price || '',
      duration: service.duration || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setLoading(true);
      try {
        await serviceAPI.delete(id);
        toast.success('Service deleted successfully');
        fetchServices();
      } catch (error) {
        toast.error('Failed to delete service');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Services Catalog</h1>
          <p className="text-gray-600 mt-1">Manage the services you offer to clients</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="card hover:scale-105 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(service)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => handleDelete(service._id)} className="p-2 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{service.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {service.price && (
                <div className="flex items-center gap-1 text-indigo-600 font-semibold">
                  <DollarSign className="w-4 h-4" />
                  <span>{service.price}</span>
                </div>
              )}
              {service.duration && (
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && !loading && (
        <div className="card text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No services added yet. Add your first service!</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{editingService ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="label">Title *</label>
                <input type="text" name="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" required />
              </div>
              <div className="mb-4">
                <label className="label">Description *</label>
                <textarea name="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows="3" required />
              </div>
              <div className="mb-4">
                <label className="label">Price ($)</label>
                <input type="number" name="price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="input-field" placeholder="0" />
              </div>
              <div className="mb-6">
                <label className="label">Duration</label>
                <input type="text" name="duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="input-field" placeholder="e.g., 2 weeks, 1 month" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1" disabled={loading}>{loading ? 'Saving...' : editingService ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServicesPage;