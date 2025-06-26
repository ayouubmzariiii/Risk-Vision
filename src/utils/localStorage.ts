import { Project, Risk } from '../types';

const PROJECTS_KEY = 'risk-manager-projects';

export const saveProjects = (projects: Project[]): void => {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

export const getProjects = (): Project[] => {
  const projects = localStorage.getItem(PROJECTS_KEY);
  if (!projects) return [];
  
  try {
    const parsed = JSON.parse(projects);
    // Convert string dates back to Date objects
    return parsed.map((project: any) => ({
      ...project,
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt),
      risks: project.risks.map((risk: any) => ({
        ...risk,
        createdAt: new Date(risk.createdAt),
        updatedAt: new Date(risk.updatedAt)
      }))
    }));
  } catch (error) {
    console.error('Failed to parse projects from localStorage', error);
    return [];
  }
};

export const saveProject = (project: Project): void => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  
  if (index !== -1) {
    projects[index] = project;
  } else {
    projects.push(project);
  }
  
  saveProjects(projects);
};

export const getProject = (id: string): Project | undefined => {
  const projects = getProjects();
  return projects.find((project) => project.id === id);
};

export const deleteProject = (id: string): void => {
  const projects = getProjects();
  const filtered = projects.filter((project) => project.id !== id);
  saveProjects(filtered);
};