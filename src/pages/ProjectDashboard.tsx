import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import RiskForm from '../components/risk/RiskForm';
import RiskList from '../components/risk/RiskList';
import RiskGenerator from '../components/risk/RiskGenerator';
import RiskMatrix from '../components/risk/RiskMatrix';
import ExportOptions from '../components/export/ExportOptions';
import AppLayout from '../components/layout/AppLayout';
import { Plus, Wand2, BarChart3, FileDown, ArrowLeft } from 'lucide-react';

const ProjectDashboard: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, selectProject, currentProject } = useProjects();
  const { user } = useAuth();
  const [newRiskModalOpen, setNewRiskModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'risks' | 'generate' | 'matrix' | 'export'>('risks');

  // Check if current user is a manager
  const isManager = useMemo(() => {
    if (!user || !currentProject?.teamMembersData) return false;
    const currentUserMember = currentProject.teamMembersData.find(member => member.email === user.email);
    return currentUserMember?.role === 'manager';
  }, [user, currentProject?.teamMembersData]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToTop();
    if (id) {
      selectProject(id);
    }
  }, [id, selectProject]);

  if (!currentProject) {
    return (
      <AppLayout>
        <div className="px-4 py-8 max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Project Not Found</h2>
              <p className="text-gray-500 mb-6">The project you're looking for doesn't exist or has been deleted.</p>
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                Return to Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<ArrowLeft size={16} />}
                      onClick={() => navigate('/dashboard')}
                    >
                      Back to Projects
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">{currentProject.name}</h1>
                  </div>
                </div>
                <p className="text-gray-500 mt-1">{currentProject.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={activeTab === 'risks' ? 'primary' : 'outline'}
                    onClick={() => setActiveTab('risks')}
                  >
                    Risks
                  </Button>
                  {isManager && (
                    <Button
                      variant={activeTab === 'generate' ? 'primary' : 'outline'}
                      icon={<Wand2 size={16} />}
                      onClick={() => setActiveTab('generate')}
                    >
                      Generate Risks
                    </Button>
                  )}
                  <Button
                    variant={activeTab === 'matrix' ? 'primary' : 'outline'}
                    icon={<BarChart3 size={16} />}
                    onClick={() => setActiveTab('matrix')}
                  >
                    Risk Matrix
                  </Button>
                  <Button
                    variant={activeTab === 'export' ? 'primary' : 'outline'}
                    icon={<FileDown size={16} />}
                    onClick={() => setActiveTab('export')}
                  >
                    Export
                  </Button>
                  {isManager && (
                    <div className="ml-auto">
                      <Button
                        variant="secondary"
                        icon={<Plus size={16} />}
                        onClick={() => setNewRiskModalOpen(true)}
                      >
                        Add Risk
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            {activeTab === 'risks' && <RiskList />}
            {activeTab === 'generate' && (
              <RiskGenerator onComplete={() => setActiveTab('risks')} />
            )}
            {activeTab === 'matrix' && <RiskMatrix />}
            {activeTab === 'export' && <ExportOptions />}
          </div>

          <Modal
            isOpen={newRiskModalOpen}
            onClose={() => setNewRiskModalOpen(false)}
            title="Add New Risk"
          >
            <RiskForm
              onComplete={() => setNewRiskModalOpen(false)}
              onCancel={() => setNewRiskModalOpen(false)}
            />
          </Modal>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectDashboard;