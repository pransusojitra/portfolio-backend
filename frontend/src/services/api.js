import apiClient from '../api/client';

const API_ORIGIN = (apiClient.defaults.baseURL || '').replace(/\/api\/?$/, '');

const toAssetUrl = (url) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url}`;
};

const appendProjectFields = (formData, projectData) => {
  formData.append('title', projectData.title || '');
  formData.append('description', projectData.description || '');
  formData.append('shortDescription', projectData.summary || '');
  formData.append(
    'technologies',
    typeof projectData.tech === 'string'
      ? projectData.tech
      : (projectData.tech || []).join(',')
  );
  formData.append('githubUrl', projectData.githubUrl || '');
  formData.append('liveDemoUrl', projectData.liveUrl || '');
  formData.append('category', projectData.category || 'fullstack');

  (projectData.imageFiles || []).forEach((file) => {
    formData.append('images', file);
  });
};

const mapProject = (p) => {
  if (!p) return null;
  const imageItems = p.images || [];
  return {
    id: p._id,
    title: p.title || '',
    category: p.category || '',
    tech: p.technologies || [],
    summary: p.shortDescription || p.description?.substring(0, 50) || '',
    description: p.description || '',
    features: [],
    images: imageItems.map((img) => toAssetUrl(img.url)),
    imageItems,
    githubUrl: p.githubUrl || '',
    liveUrl: p.liveDemoUrl || '',
    createdDate: p.createdAt ? p.createdAt.split('T')[0] : '',
  };
};

const mapContact = (c) => {
  if (!c) return null;
  return {
    id: c._id,
    name: c.name,
    email: c.email,
    phone: c.phone || '',
    subject: c.subject,
    message: c.message,
    date: c.createdAt,
  };
};

export const apiService = {
  login: async (credentials) => {
    const payload = {
      email: credentials.email || credentials.username,
      password: credentials.password,
    };
    const response = await apiClient.post('/auth/login', payload);
    return response.data;
  },

  register: async (userData) => {
    const payload = {
      name: userData.name || userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'user',
    };
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  fetchProjects: async () => {
    const response = await apiClient.get('/projects');
    const projects = response.data.data || [];
    return projects.map(mapProject);
  },

  fetchProject: async (id) => {
    const response = await apiClient.get(`/projects/${id}`);
    return mapProject(response.data.data);
  },

  createProject: async (projectData) => {
    const payload = new FormData();
    appendProjectFields(payload, projectData);
    const response = await apiClient.post('/projects', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return mapProject(response.data.data);
  },

  updateProject: async (id, projectData) => {
    const payload = new FormData();
    appendProjectFields(payload, projectData);
    if (projectData.removeImageFilenames?.length) {
      payload.append('removeImages', JSON.stringify(projectData.removeImageFilenames));
    }
    const response = await apiClient.put(`/projects/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return mapProject(response.data.data);
  },

  deleteProject: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },

  submitContact: async (contactData) => {
    const response = await apiClient.post('/contact', contactData);
    return response.data;
  },

  fetchContactMessages: async () => {
    const response = await apiClient.get('/contact');
    const contacts = response.data.data || [];
    return contacts.map(mapContact);
  },

  deleteContactMessage: async (id) => {
    const response = await apiClient.delete(`/contact/${id}`);
    return response.data;
  },

  chatSendMessage: async (messageText) => {
    const response = await apiClient.post('/ai/chat', { message: messageText });
    return { text: response.data.data.reply };
  },
};

export default apiService;
