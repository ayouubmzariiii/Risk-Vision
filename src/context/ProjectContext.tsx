import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { Project, Risk, GenerateRiskParams, RiskPriority, GenerationProgress } from '../types';
import { generateMitigationStrategy, generateRisks, generateSolutions } from '../services/api';

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  generationProgress: GenerationProgress;
  createProject: (name: string, description: string, teamMembers: string[]) => Promise<Project>;
  selectProject: (id: string) => void;
  updateProject: (project: Project) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  addRisk: (risk: Omit<Risk, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRisk: (risk: Risk) => Promise<void>;
  removeRisk: (riskId: string) => Promise<void>;
  generateProjectRisks: (params: GenerateRiskParams) => Promise<Risk[]>;
  generateRiskMitigation: (risk: Risk) => Promise<string>;
  generateSolutions: (risk: Risk) => Promise<string[]>;
  calculateRiskPriority: (probability: number, impact: number) => RiskPriority;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    status: 'idle',
    currentItem: 0,
    totalItems: 0,
    message: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setCurrentProject(null);
      return;
    }

    const q = query(
      collection(db, 'projects'),
      where('teamMembers', 'array-contains', user.email)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData: Project[] = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
        risks: doc.data().risks.map((risk: any) => ({
          ...risk,
          createdAt: risk.createdAt.toDate(),
          updatedAt: risk.updatedAt.toDate()
        }))
      })) as Project[];
      
      setProjects(projectsData);
      
      if (currentProject) {
        const updatedCurrentProject = projectsData.find(p => p.id === currentProject.id);
        if (updatedCurrentProject) {
          setCurrentProject(updatedCurrentProject);
        }
      }
    });

    return () => unsubscribe();
  }, [user]);

  const createProject = async (name: string, description: string, teamMembers: string[]): Promise<Project> => {
    if (!user) throw new Error('User must be logged in');

    const newProject = {
      userId: user.uid,
      name,
      description,
      teamMembers: [user.email, ...teamMembers],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      risks: []
    };

    const docRef = await addDoc(collection(db, 'projects'), newProject);
    const project = {
      ...newProject,
      id: docRef.id,
      createdAt: newProject.createdAt.toDate(),
      updatedAt: newProject.updatedAt.toDate(),
      risks: []
    } as Project;

    setCurrentProject(project);
    return project;
  };

  const selectProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setCurrentProject(project);
    }
  };

  const updateProject = async (project: Project): Promise<void> => {
    if (!user) throw new Error('User must be logged in');

    const projectRef = doc(db, 'projects', project.id);
    await updateDoc(projectRef, {
      ...project,
      updatedAt: Timestamp.now(),
      risks: project.risks.map(risk => ({
        ...risk,
        createdAt: Timestamp.fromDate(new Date(risk.createdAt)),
        updatedAt: Timestamp.fromDate(new Date(risk.updatedAt))
      }))
    });
  };

  const removeProject = async (id: string): Promise<void> => {
    if (!user) throw new Error('User must be logged in');

    await deleteDoc(doc(db, 'projects', id));
    
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
  };

  const addRisk = async (risk: Omit<Risk, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    if (!currentProject || !user) return;

    const newRisk: Risk = {
      ...risk,
      id: uuidv4(),
      projectId: currentProject.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedProject: Project = {
      ...currentProject,
      risks: [...currentProject.risks, newRisk],
      updatedAt: new Date()
    };

    await updateProject(updatedProject);
  };

  const updateRisk = async (risk: Risk): Promise<void> => {
    if (!currentProject || !user) return;

    const updatedRisk: Risk = {
      ...risk,
      updatedAt: new Date()
    };

    const updatedProject: Project = {
      ...currentProject,
      risks: currentProject.risks.map(r => 
        r.id === risk.id ? updatedRisk : r
      ),
      updatedAt: new Date()
    };

    await updateProject(updatedProject);
  };

  const removeRisk = async (riskId: string): Promise<void> => {
    if (!currentProject || !user) return;

    const updatedProject: Project = {
      ...currentProject,
      risks: currentProject.risks.filter(r => r.id !== riskId),
      updatedAt: new Date()
    };

    await updateProject(updatedProject);
  };

  const calculateRiskPriority = (probability: number, impact: number): RiskPriority => {
    const score = probability * impact;
    if (score >= 64) return 'critical';
    if (score >= 36) return 'high';
    if (score >= 16) return 'medium';
    return 'low';
  };

  const generateProjectRisks = async (params: GenerateRiskParams): Promise<Risk[]> => {
    if (!currentProject || !user) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const riskCount = params.count || 20;
      setGenerationProgress({
        status: 'generating-risks',
        currentItem: 0,
        totalItems: riskCount * 3, // Risks + Strategies + Solutions
        message: 'Generating risks...'
      });

      const generatedRisks = await generateRisks(params);
      let updatedRisks = [...currentProject.risks];

      for (let i = 0; i < generatedRisks.length; i++) {
        const risk = generatedRisks[i];
        const probability = risk.probability || 5;
        const impact = risk.impact || 5;
        const priority = calculateRiskPriority(probability, impact);
        
        const newRisk: Risk = {
          id: uuidv4(),
          projectId: currentProject.id,
          title: risk.title || 'Untitled Risk',
          description: risk.description || '',
          category: risk.category || 'technical',
          probability,
          impact,
          priority,
          status: 'open',
          assignedTo: risk.assignedTo || '',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        setGenerationProgress({
          status: 'generating-strategies',
          currentItem: i * 3 + 1,
          totalItems: riskCount * 3,
          message: `Generating strategy for risk: ${newRisk.title}`
        });

        const strategy = await generateMitigationStrategy({
          risk: newRisk,
          teamMembers: params.teamMembers
        });
        newRisk.mitigationStrategy = strategy;

        setGenerationProgress({
          status: 'generating-solutions',
          currentItem: i * 3 + 2,
          totalItems: riskCount * 3,
          message: `Generating solutions for risk: ${newRisk.title}`
        });

        const solutions = await generateSolutions(newRisk);
        newRisk.solutions = solutions;

        updatedRisks = [...updatedRisks, newRisk];

        // Update project with accumulated risks
        const updatedProject = {
          ...currentProject,
          risks: updatedRisks,
          updatedAt: new Date()
        };
        await updateProject(updatedProject);
      }

      setGenerationProgress({
        status: 'idle',
        currentItem: 0,
        totalItems: 0,
        message: ''
      });

      return generatedRisks;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate risks');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateRiskMitigation = async (risk: Risk): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const mitigation = await generateMitigationStrategy({ risk });
      return mitigation;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate mitigation strategy');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    projects,
    currentProject,
    loading,
    error,
    generationProgress,
    createProject,
    selectProject,
    updateProject,
    removeProject,
    addRisk,
    updateRisk,
    removeRisk,
    generateProjectRisks,
    generateRiskMitigation,
    generateSolutions,
    calculateRiskPriority
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};