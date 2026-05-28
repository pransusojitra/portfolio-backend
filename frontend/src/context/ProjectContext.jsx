import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import apiService from '../services/api';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.fetchProjects();
      // Ensure sorted by createdDate descending (newest first)
      const sorted = [...data].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setProjects(sorted);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = async (projectData) => {
    setLoading(true);
    try {
      const newProj = await apiService.createProject(projectData);
      setProjects((prev) => [newProj, ...prev]);
      return { success: true, project: newProj };
    } catch (err) {
      console.error('Failed to create project:', err);
      return { success: false, error: err.message || 'Failed to add project' };
    } finally {
      setLoading(false);
    }
  };

  const updateProjectDetails = async (id, projectData) => {
    setLoading(true);
    try {
      const updatedProj = await apiService.updateProject(id, projectData);
      setProjects((prev) => 
        prev.map((p) => (String(p.id) === String(id) ? updatedProj : p))
      );
      return { success: true, project: updatedProj };
    } catch (err) {
      console.error('Failed to update project:', err);
      return { success: false, error: err.message || 'Failed to update project' };
    } finally {
      setLoading(false);
    }
  };

  const removeProject = async (id) => {
    setLoading(true);
    try {
      await apiService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => String(p.id) !== String(id)));
      return { success: true };
    } catch (err) {
      console.error('Failed to delete project:', err);
      return { success: false, error: err.message || 'Failed to delete project' };
    } finally {
      setLoading(false);
    }
  };

  const getProject = useCallback(async (id) => {
    // Return cached project if available
    const cached = projects.find(p => String(p.id) === String(id));
    if (cached) return cached;
    
    // Otherwise fetch from api
    try {
      return await apiService.fetchProject(id);
    } catch (err) {
      console.error(`Failed to fetch project ${id}:`, err);
      throw err;
    }
  }, [projects]);

  return (
    <ProjectContext.Provider value={{
      projects,
      loading,
      error,
      fetchProjects,
      addProject,
      updateProject: updateProjectDetails,
      deleteProject: removeProject,
      getProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
export default ProjectContext;
