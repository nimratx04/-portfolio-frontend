import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, FolderGit2, Github, Globe, Code, Calendar } from 'lucide-react';
import { projectAPI } from '../services/api';
import toast from 'react-hot-toast';

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubLink: '',
    liveLink: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await projectAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const projectData = {
      ...formData,
      technologies: formData.technologies.split(',').map(t => t.trim())
    };
    try {
      if (editingProject) {
        await projectAPI.update(editingProject._id, projectData);
        toast.success('Project updated successfully');
      } else {
        await projectAPI.create(projectData);
        toast.success('Project created successfully');
      }
      setIsModalOpen(false);
      setEditingProject(null);
      setFormData({ title: '', description: '', technologies: '', githubLink: '', liveLink: '', imageUrl: '' });
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || '',
      imageUrl: project.imageUrl || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setLoading(true);
      try {
        await projectAPI.delete(id);
        toast.success('Project deleted successfully');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to delete project');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Projects Portfolio</h1>
          <p className="text-gray-600 mt-1">Showcase your amazing work and projects</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="card hover:shadow-2xl transition-all duration-300 group">
            <div className="relative">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover rounded-lg mb-4" />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg mb-4 flex items-center justify-center">
                  <FolderGit2 className="w-16 h-16 text-white opacity-50" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(project)} className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50">
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => handleDelete(project._id)} className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.technologies.map((tech, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                  <Github className="w-5 h-5" />
                </a>
              )}
              {project.liveLink && (
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !loading && (
        <div className="card text-center py-12">
          <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No projects yet. Start by adding your first project!</p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
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
                <label className="label">Technologies * (comma-separated)</label>
                <input type="text" name="technologies" value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} className="input-field" placeholder="React, Node.js, MongoDB" required />
              </div>
              <div className="mb-4">
                <label className="label">GitHub Link</label>
                <input type="url" name="githubLink" value={formData.githubLink} onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })} className="input-field" />
              </div>
              <div className="mb-4">
                <label className="label">Live Link</label>
                <input type="url" name="liveLink" value={formData.liveLink} onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })} className="input-field" />
              </div>
              <div className="mb-6">
                <label className="label">Image URL</label>
                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="input-field" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1" disabled={loading}>{loading ? 'Saving...' : editingProject ? 'Update' : 'Create'}</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;