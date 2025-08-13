import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import ProjectList from '../components/project/ProjectList';
import ProjectForm from '../components/project/ProjectForm';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import AppLayout from '../components/layout/AppLayout';
import { Plus, Shield, AlertTriangle, FileCheck } from 'lucide-react';

const Home: React.FC = () => {
  const { projects } = useProjects();
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <AppLayout>
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <Button
                variant="primary"
                icon={<Plus size={16} />}
                onClick={() => setNewProjectModalOpen(true)}
              >
                New Project
              </Button>
            </div>

            {projects.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Shield size={48} className="mx-auto mb-4 text-blue-500" />
                <h2 className="text-xl font-semibold mb-2">No Projects Yet</h2>
                <p className="text-gray-500 mb-6">
                  Create your first project to start identifying and managing risks.
                </p>
                <Button
                  variant="primary"
                  icon={<Plus size={16} />}
                  onClick={() => setNewProjectModalOpen(true)}
                >
                  Create Your First Project
                </Button>
              </div>
            ) : (
              <ProjectList />
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">About Risk Management</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-4">
                Effective risk management is crucial for project success. Use this tool to:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <AlertTriangle size={16} className="mt-1 mr-2 text-amber-500" />
                  <span className="text-gray-600">Identify potential risks before they occur</span>
                </li>
                <li className="flex items-start">
                  <FileCheck size={16} className="mt-1 mr-2 text-emerald-500" />
                  <span className="text-gray-600">Develop effective mitigation strategies</span>
                </li>
                <li className="flex items-start">
                  <Shield size={16} className="mt-1 mr-2 text-blue-500" />
                  <span className="text-gray-600">Track and manage risks throughout your project</span>
                </li>
              </ul>
              <p className="text-gray-600 italic text-sm">
                "Risk management is not about eliminating risks, but about identifying, assessing, and mitigating them effectively."
              </p>
            </div>
          </div>
        </div>

        <Modal
          isOpen={newProjectModalOpen}
          onClose={() => setNewProjectModalOpen(false)}
          title="Create New Project"
          allowOverflow={true}
        >
          <ProjectForm onComplete={() => setNewProjectModalOpen(false)} />
        </Modal>
      </div>
    </AppLayout>
  );
};

export default Home;