import React, { useState, useEffect } from 'react';
import { FiFolder, FiGrid, FiMail, FiServer, FiPlus, FiEdit, FiTrash, FiEye, FiUpload, FiX } from 'react-icons/fi';
import AdminLayout from '../layouts/AdminLayout';
import { useProjects } from '../context/ProjectContext';
import apiService from '../services/api';
import Modal from '../components/Common/Modal';
import ToastNotification from '../components/Common/ToastNotification';

const ITEMS_PER_PAGE = 5;

const AdminDashboard = () => {
  const { projects, loading, addProject, updateProject, deleteProject } = useProjects();
  
  // Local states
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Fullstack',
    tech: '',
    summary: '',
    description: '',
    features: '',
    images: [],
    imageFiles: [],
    imageItems: [],
    removeImageFilenames: [],
    githubUrl: '',
    liveUrl: '',
    createdDate: new Date().toISOString().split('T')[0]
  });
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Fetch inquiries on mount
  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      try {
        const data = await apiService.fetchContactMessages();
        setMessages(data || []);
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setLoadingMessages(false);
      }
    };
    getMessages();
  }, [toast]);

  // Form Change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Multiple Images selector handler
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const previews = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...files],
      images: [...prev.images, ...previews]
    }));
    e.target.value = '';
  };

  const removeUploadedImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
      imageFiles: prev.imageFiles.filter((_, idx) => idx + prev.imageItems.length !== indexToRemove),
      imageItems: prev.imageItems.filter((_, idx) => idx !== indexToRemove),
      removeImageFilenames: [
        ...prev.removeImageFilenames,
        prev.imageItems[indexToRemove]?.filename
      ].filter(Boolean)
    }));
  };

  // Trigger Add Modal
  const openAddModal = () => {
    setFormData({
      title: '',
      category: 'Fullstack',
      tech: '',
      summary: '',
      description: '',
      features: '',
      images: [],
      imageFiles: [],
      imageItems: [],
      removeImageFilenames: [],
      githubUrl: '',
      liveUrl: '',
      createdDate: new Date().toISOString().split('T')[0]
    });
    setIsAddOpen(true);
  };

  // Trigger Edit Modal
  const openEditModal = (proj) => {
    setSelectedProject(proj);
    setFormData({
      title: proj.title,
      category: proj.category,
      tech: proj.tech.join(', '),
      summary: proj.summary,
      description: proj.description,
      features: proj.features.join('\n'),
      images: proj.images || [],
      imageFiles: [],
      imageItems: proj.imageItems || [],
      removeImageFilenames: [],
      githubUrl: proj.githubUrl,
      liveUrl: proj.liveUrl,
      createdDate: proj.createdDate
    });
    setIsEditOpen(true);
  };

  // Trigger Delete Confirmation Modal
  const openDeleteModal = (proj) => {
    setSelectedProject(proj);
    setIsDeleteOpen(true);
  };

  // Submit Add Project
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setToast({ show: true, message: 'Project title is required.', type: 'error' });
      return;
    }

    const res = await addProject(formData);
    if (res.success) {
      setIsAddOpen(false);
      setToast({ show: true, message: 'Project created successfully!', type: 'success' });
    } else {
      setToast({ show: true, message: res.error || 'Failed to create project.', type: 'error' });
    }
  };

  // Submit Edit Project
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setToast({ show: true, message: 'Project title is required.', type: 'error' });
      return;
    }

    const res = await updateProject(selectedProject.id, formData);
    if (res.success) {
      setIsEditOpen(false);
      setToast({ show: true, message: 'Project updated successfully!', type: 'success' });
    } else {
      setToast({ show: true, message: res.error || 'Failed to update project.', type: 'error' });
    }
  };

  // Confirm Delete Project
  const handleDeleteConfirm = async () => {
    const res = await deleteProject(selectedProject.id);
    if (res.success) {
      setIsDeleteOpen(false);
      setToast({ show: true, message: 'Project deleted successfully.', type: 'success' });
    } else {
      setToast({ show: true, message: res.error || 'Failed to delete project.', type: 'error' });
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const shouldDelete = window.confirm('Delete this inquiry message?');
    if (!shouldDelete) return;

    try {
      const res = await apiService.deleteContactMessage(messageId);
      if (res.success) {
        setMessages((prev) => prev.filter((msg) => String(msg.id) !== String(messageId)));
        setToast({ show: true, message: 'Inquiry deleted successfully.', type: 'success' });
      } else {
        throw new Error(res.message || 'Failed to delete inquiry.');
      }
    } catch (err) {
      setToast({ show: true, message: err.message || 'Failed to delete inquiry.', type: 'error' });
    }
  };

  // Derived statistics variables
  const totalProjects = projects.length;
  const categoriesCount = new Set(projects.map(p => p.category)).size;
  const totalMessages = messages.length;

  // Search & Filter
  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tech.some(t => t.toLowerCase().includes(q))
    );
  });

  // Project Table Pagination
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="admin-dashboard-wrapper pb-5">
        
        {/* Statistics Cards Row */}
        <div className="row g-4 mb-5 text-start">
          {/* Card 1: Total Projects */}
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="stat-card-custom glass-card d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-bold">TOTAL PROJECTS</span>
                <h3 className="fs-2 fw-extrabold text-white mb-0 mt-1">{totalProjects}</h3>
              </div>
              <div className="stat-icon-wrapper primary">
                <FiFolder size={24} />
              </div>
            </div>
          </div>

          {/* Card 2: Categories */}
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="stat-card-custom glass-card d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-bold">CATEGORIES</span>
                <h3 className="fs-2 fw-extrabold text-white mb-0 mt-1">{categoriesCount}</h3>
              </div>
              <div className="stat-icon-wrapper secondary">
                <FiGrid size={24} />
              </div>
            </div>
          </div>

          {/* Card 3: Messages */}
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="stat-card-custom glass-card d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-bold">TOTAL INQUIRIES</span>
                <h3 className="fs-2 fw-extrabold text-white mb-0 mt-1">{totalMessages}</h3>
              </div>
              <div className="stat-icon-wrapper accent">
                <FiMail size={24} />
              </div>
            </div>
          </div>

          {/* Card 4: Server API Status */}
          <div className="col-lg-3 col-md-6 col-sm-12">
            <div className="stat-card-custom glass-card d-flex align-items-center justify-content-between">
              <div>
                <span className="text-secondary small fw-bold">API CONNECTIVITY</span>
                <h3 className="fs-5 fw-bold text-success mb-0 mt-2 d-flex align-items-center gap-1">
                  <span className="dot-pulse" /> Simulated Staging
                </h3>
              </div>
              <div className="stat-icon-wrapper success">
                <FiServer size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Tab 1: System Overview (Default) */}
        {activeTab === 'overview' && (
          <div className="row g-4 text-start">
            <div className="col-lg-8">
              <div className="glass-card p-4 h-100">
                <h3 className="fs-5 text-white mb-4">Recent Contact Messages</h3>
                {loadingMessages ? (
                  <p className="text-muted">Loading messages log...</p>
                ) : messages.length === 0 ? (
                  <p className="text-muted mb-0">No messages received yet.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-custom mb-0">
                      <thead>
                        <tr>
                          <th>Sender</th>
                          <th>Subject</th>
                          <th>Inquiry Text</th>
                          <th>Date Received</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.slice(0, 3).map((msg) => (
                          <tr key={msg.id}>
                            <td className="fw-semibold text-white">
                              {msg.name}<br />
                              <small className="text-muted">{msg.email}</small>
                              {msg.phone && <small className="text-muted d-block">{msg.phone}</small>}
                            </td>
                            <td>{msg.subject}</td>
                            <td className="text-truncate" style={{ maxWidth: '200px' }}>{msg.message}</td>
                            <td>{new Date(msg.date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="glass-card p-4 h-100">
                <h3 className="fs-5 text-white mb-3">Staging Configuration</h3>
                <p className="text-secondary small">
                  The frontend application includes simulated backend integrations. Adding, modifying, or deleting records will update the local mock database stored in the client browser storage.
                </p>
                <div className="p-3 bg-dark bg-opacity-40 rounded border border-secondary border-opacity-30">
                  <span className="text-white small fw-bold d-block mb-1">Local Settings:</span>
                  <ul className="text-secondary small mb-0 ps-3">
                    <li>Database: `localStorage`</li>
                    <li>Image uploads: converting blobs</li>
                    <li>JWT Session duration: 24 hours</li>
                    <li>AI Engine: keywords rule parser</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manage Projects */}
        {activeTab === 'projects' && (
          <div className="glass-card p-4 text-start">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
              <div className="d-flex align-items-center gap-2">
                <h3 className="fs-5 text-white mb-0">Registry Log</h3>
                <span className="badge bg-secondary-subtle text-secondary">{projects.length} Total</span>
              </div>
              
              <div className="d-flex gap-3">
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-white py-1 px-3"
                  placeholder="Filter by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '220px', outline: 'none' }}
                />
                
                <button onClick={openAddModal} className="btn-premium d-flex align-items-center gap-2 py-2 px-3 interactive">
                  <FiPlus /> Add Project
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-muted">Loading registry logs...</p>
            ) : paginatedProjects.length === 0 ? (
              <p className="text-muted">No projects found matching the filter query.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-custom">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Image</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Technologies</th>
                      <th>Created Date</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProjects.map((proj) => (
                      <tr key={proj.id}>
                        <td>
                          <img 
                            src={proj.images?.[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'} 
                            alt={proj.title} 
                            className="rounded"
                            style={{ width: '50px', height: '40px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                        </td>
                        <td className="fw-semibold text-white">{proj.title}</td>
                        <td>
                          <span className="badge bg-secondary">{proj.category}</span>
                        </td>
                        <td style={{ maxWidth: '250px' }} className="text-truncate">
                          {proj.tech.join(', ')}
                        </td>
                        <td>{proj.createdDate}</td>
                        <td className="text-end">
                          <div className="d-flex gap-2 justify-content-end">
                            <a 
                              href={`/projects/${proj.id}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn btn-outline-info btn-sm interactive"
                              title="View detail page"
                            >
                              <FiEye size={14} />
                            </a>
                            <button 
                              onClick={() => openEditModal(proj)} 
                              className="btn btn-outline-primary btn-sm interactive"
                              title="Edit fields"
                            >
                              <FiEdit size={14} />
                            </button>
                            <button 
                              onClick={() => openDeleteModal(proj)} 
                              className="btn btn-outline-danger btn-sm interactive"
                              title="Delete record"
                            >
                              <FiTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Table Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <small className="text-muted">Showing page {currentPage} of {totalPages}</small>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary px-3 interactive"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      >
                        Prev
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary px-3 interactive"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Message Log */}
        {activeTab === 'messages' && (
          <div className="glass-card p-4 text-start">
            <h3 className="fs-5 text-white mb-4">Inquiries Mail Log</h3>
            {loadingMessages ? (
              <p className="text-muted">Loading mail logs...</p>
            ) : messages.length === 0 ? (
              <p className="text-muted mb-0">No messages logged yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-custom">
                  <thead>
                    <tr>
                      <th>Sender</th>
                      <th>Email Address</th>
                      <th>Phone Number</th>
                      <th>Subject Header</th>
                      <th>Message Text</th>
                      <th>Logged Date</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg) => (
                      <tr key={msg.id}>
                        <td className="fw-semibold text-white">{msg.name}</td>
                        <td>
                          <a href={`mailto:${msg.email}`} className="text-secondary interactive">{msg.email}</a>
                        </td>
                        <td>
                          {msg.phone ? (
                            <a href={`tel:${msg.phone}`} className="text-secondary interactive">{msg.phone}</a>
                          ) : (
                            <span className="text-muted">Not provided</span>
                          )}
                        </td>
                        <td className="text-white">{msg.subject}</td>
                        <td style={{ whiteSpace: 'pre-line', maxWidth: '350px' }}>{msg.message}</td>
                        <td>{new Date(msg.date).toLocaleString()}</td>
                        <td className="text-end">
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="btn btn-outline-danger btn-sm interactive"
                            title="Delete inquiry"
                          >
                            <FiTrash size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            MODAL 1: ADD PROJECT FORM
            ========================================== */}
        <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create New Portfolio Entry">
          <form onSubmit={handleAddSubmit} className="text-start">
            <div className="row g-3">
              {/* Title */}
              <div className="col-md-6">
                <label className="form-label text-secondary small fw-semibold">PROJECT TITLE</label>
                <input
                  type="text"
                  name="title"
                  className="form-control bg-dark border-secondary text-white"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Apollo SaaS Workspace"
                />
              </div>

              {/* Category */}
              <div className="col-md-6">
                <label className="form-label text-secondary small fw-semibold">CATEGORY</label>
                <input
                  type="text"
                  name="category"
                  className="form-control bg-dark border-secondary text-white"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Fullstack, Frontend, UI/UX, AI..."
                />
              </div>

              {/* Technologies */}
              <div className="col-12">
                <label className="form-label text-secondary small fw-semibold">TECHNOLOGIES (COMMA SEPARATED)</label>
                <input
                  type="text"
                  name="tech"
                  className="form-control bg-dark border-secondary text-white"
                  value={formData.tech}
                  onChange={handleInputChange}
                  placeholder="React, Node.js, Express, MongoDB"
                />
              </div>

              {/* Summary */}
              <div className="col-12">
                <label className="form-label text-secondary small fw-semibold">SUMMARY (BRIEF INTRO)</label>
                <input
                  type="text"
                  name="summary"
                  className="form-control bg-dark border-secondary text-white"
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="Brief description showing on listings..."
                />
              </div>

              {/* Description */}
              <div className="col-12">
                <label className="form-label text-secondary small fw-semibold">FULL DESCRIPTION</label>
                <textarea
                  name="description"
                  className="form-control bg-dark border-secondary text-white"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed project summary explaining core logic, database setup..."
                />
              </div>

              {/* Features */}
              <div className="col-12">
                <label className="form-label text-secondary small fw-semibold">KEY FEATURES (ONE PER LINE)</label>
                <textarea
                  name="features"
                  className="form-control bg-dark border-secondary text-white"
                  rows="3"
                  value={formData.features}
                  onChange={handleInputChange}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                />
              </div>

              {/* Image files selector */}
              <div className="col-12">
                <label className="form-label text-secondary small fw-semibold d-block">PROJECT IMAGES (UPLOAD MULTIPLE)</label>
                <div className="d-flex align-items-center gap-3">
                  <label className="btn btn-outline-secondary d-flex align-items-center gap-2 interactive px-3 py-2 cursor-pointer mb-0">
                    <FiUpload /> Choose Files
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="d-none"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </label>
                  {uploading && <span className="spinner-border spinner-border-sm text-secondary" />}
                </div>
                
                {/* Uploaded thumbnails */}
                {formData.images.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="position-relative" style={{ width: '80px', height: '60px' }}>
                        <img 
                          src={img} 
                          alt="Thumbnail" 
                          className="w-100 h-100 rounded object-fit-cover border border-secondary" 
                        />
                        <button 
                          type="button" 
                          onClick={() => removeUploadedImage(idx)}
                          className="position-absolute top-0 right-0 bg-danger text-white border-0 rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: '18px', height: '18px', fontSize: '0.65rem', transform: 'translate(50%, -50%)' }}
                          title="Remove image"
                        >
                          <FiX size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="col-md-6">
                <label className="form-label text-secondary small fw-semibold">GITHUB CODE LINK</label>
                <input
                  type="url"
                  name="githubUrl"
                  className="form-control bg-dark border-secondary text-white"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-secondary small fw-semibold">LIVE SITE LINK</label>
                <input
                  type="url"
                  name="liveUrl"
                  className="form-control bg-dark border-secondary text-white"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-secondary small fw-semibold">CREATED DATE</label>
                <input
                  type="date"
                  name="createdDate"
                  className="form-control bg-dark border-secondary text-white"
                  value={formData.createdDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top border-secondary-subtle">
              <button type="button" onClick={() => setIsAddOpen(false)} className="btn btn-outline-secondary px-4 interactive">
                Cancel
              </button>
              <button type="submit" className="btn-premium px-4 interactive">
                Create Entry
              </button>
            </div>
          </form>
        </Modal>

        {/* ==========================================
            MODAL 2: EDIT PROJECT FORM
            ========================================== */}
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={`Modify Entry: ${selectedProject?.title}`}>
          <form onSubmit={handleEditSubmit} className="text-start">
            <div className="row g-3">
              {/* Title */}
              <div className="col-md-6">
                <label className="form-label text-secondary small fw-semibold">PROJECT TITLE</label>
                <input
                  type="text"
                  name="title"
                  className="form-control bg-dark border-secondary text-white"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              {/* Category */}
              <div className="col-md-6">
                <label className="form-label text-secondary small fw-semibold">CATEGORY</label>
                <input
                  type="text"
                  name="category"
                  className="form-control bg-dark border-secondary text-white"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Fullstack, Frontend, UI/UX, AI..."
                />
              </div>

              {/* Technologies */}
              <div className="col-12">
                <label className="form-label text-secondary small fw-semibold">TECHNOLOGIES (COMMA SEPARATED)</label>
                <input
                  type="text"
                  name="tech"
                  className="form-control bg-dark border-secondary text-white"
                  value={formData.tech}
                  onChange={handleInputChange}
                />
              </div>

              {/* Summary */}
              <div className="col-12">
                <label className="form-label text-secondary small fw-semibold">SUMMARY (BRIEF INTRO)</label>
                <input
                  type="text"
                  name="summary"
                  className="form-control bg-dark border-secondary text-white"
                  value={formData.summary}
                  onChange={handleInputChange}
                />
              </div>

              {/* Description */}
              <div className="col-12">
                <label className="form-label text-secondary small fw-semibold">FULL DESCRIPTION</label>
                <textarea
                  name="description"
                  className="form-control bg-dark border-secondary text-white"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              {/* Features */}
              <div className="col-12">
                <label className="form-label text-secondary small fw-semibold">KEY FEATURES (ONE PER LINE)</label>
                <textarea
                  name="features"
                  className="form-control bg-dark border-secondary text-white"
                  rows="3"
                  value={formData.features}
                  onChange={handleInputChange}
                />
              </div>

              {/* Image uploads */}
              <div className="col-12">
                <label className="form-label text-secondary small fw-semibold d-block">PROJECT IMAGES (UPLOAD MULTIPLE)</label>
                <div className="d-flex align-items-center gap-3">
                  <label className="btn btn-outline-secondary d-flex align-items-center gap-2 interactive px-3 py-2 cursor-pointer mb-0">
                    <FiUpload /> Choose Files
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="d-none"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </label>
                  {uploading && <span className="spinner-border spinner-border-sm text-secondary" />}
                </div>
                
                {formData.images.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="position-relative" style={{ width: '80px', height: '60px' }}>
                        <img 
                          src={img} 
                          alt="Thumbnail" 
                          className="w-100 h-100 rounded object-fit-cover border border-secondary" 
                        />
                        <button 
                          type="button" 
                          onClick={() => removeUploadedImage(idx)}
                          className="position-absolute top-0 right-0 bg-danger text-white border-0 rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: '18px', height: '18px', fontSize: '0.65rem', transform: 'translate(50%, -50%)' }}
                        >
                          <FiX size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="col-md-6">
                <label className="form-label text-secondary small fw-semibold">GITHUB CODE LINK</label>
                <input
                  type="url"
                  name="githubUrl"
                  className="form-control bg-dark border-secondary text-white"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-secondary small fw-semibold">LIVE SITE LINK</label>
                <input
                  type="url"
                  name="liveUrl"
                  className="form-control bg-dark border-secondary text-white"
                  value={formData.liveUrl}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label text-secondary small fw-semibold">CREATED DATE</label>
                <input
                  type="date"
                  name="createdDate"
                  className="form-control bg-dark border-secondary text-white"
                  value={formData.createdDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top border-secondary-subtle">
              <button type="button" onClick={() => setIsEditOpen(false)} className="btn btn-outline-secondary px-4 interactive">
                Cancel
              </button>
              <button type="submit" className="btn-premium px-4 interactive">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>

        {/* ==========================================
            MODAL 3: DELETE CONFIRMATION
            ========================================== */}
        <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Project Deletion" size="sm">
          <div className="text-start p-2">
            <p className="text-secondary">
              Are you sure you want to permanently delete **{selectedProject?.title}**? This operation is irreversible in the current registry logs.
            </p>
            <div className="d-flex justify-content-end gap-3 mt-4">
              <button onClick={() => setIsDeleteOpen(false)} className="btn btn-outline-secondary interactive">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} className="btn btn-danger px-4 interactive">
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>

        {/* Toast Alerts */}
        <ToastNotification
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
