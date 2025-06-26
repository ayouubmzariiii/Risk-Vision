import React, { useState, useMemo } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { Risk, RiskStatus, RiskPriority } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import RiskForm from '../components/risk/RiskForm';
import MitigationModal from '../components/risk/MitigationModal';
import AppLayout from '../components/layout/AppLayout';
import { Edit, Activity, CheckCircle, Calendar, Building } from 'lucide-react';

const Tasks: React.FC = () => {
  const { projects, updateRisk } = useProjects();
  const { user } = useAuth();
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [mitigationModalOpen, setMitigationModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<RiskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<RiskPriority | 'all'>('all');
  const [sortField, setSortField] = useState<'priority' | 'createdAt'>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Get all risks assigned to the current user
  const userRisks = useMemo(() => {
    if (!user) return [];
    
    const allRisks: (Risk & { projectName: string })[] = [];
    
    projects.forEach(project => {
      project.risks
        .filter(risk => risk.assignedTo === user.email)
        .forEach(risk => {
          allRisks.push({
            ...risk,
            projectName: project.name
          });
        });
    });
    
    // Apply filters
    let filteredRisks = allRisks;
    
    if (filterStatus !== 'all') {
      filteredRisks = filteredRisks.filter(risk => risk.status === filterStatus);
    }
    
    if (filterPriority !== 'all') {
      filteredRisks = filteredRisks.filter(risk => risk.priority === filterPriority);
    }
    
    // Apply sorting
    return filteredRisks.sort((a, b) => {
      if (sortField === 'priority') {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
        const bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
        
        return sortDirection === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      } else {
        const aValue = new Date(a.createdAt).getTime();
        const bValue = new Date(b.createdAt).getTime();
        
        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }
    });
  }, [projects, user, filterStatus, filterPriority, sortField, sortDirection]);

  const handleStatusChange = (risk: Risk, newStatus: RiskStatus) => {
    updateRisk({
      ...risk,
      status: newStatus
    });
  };

  const handleSort = (field: 'priority' | 'createdAt') => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusCounts = () => {
    const counts = {
      all: userRisks.length,
      open: 0,
      mitigated: 0,
      closed: 0
    };
    
    userRisks.forEach(risk => {
      counts[risk.status]++;
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (!user) {
    return (
      <AppLayout>
        <div className="px-4 py-8 max-w-7xl mx-auto">
          <div className="text-center py-8">
            <p className="text-gray-500">Please sign in to view your tasks.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
          <p className="text-gray-600">Manage all risks assigned to you across your projects</p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.all}</div>
              <div className="text-sm text-blue-800">Total Tasks</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{statusCounts.open}</div>
              <div className="text-sm text-orange-800">Open</div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{statusCounts.mitigated}</div>
              <div className="text-sm text-purple-800">Mitigated</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{statusCounts.closed}</div>
              <div className="text-sm text-green-800">Closed</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Sorting */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium mb-3">Filters & Sorting</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as RiskStatus | 'all')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="mitigated">Mitigated</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as RiskPriority | 'all')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as 'priority' | 'createdAt')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="priority">Priority</option>
                <option value="createdAt">Date Created</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Direction
              </label>
              <select
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="desc">High to Low</option>
                <option value="asc">Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {userRisks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">No Tasks Found</h2>
              <p className="text-gray-500">
                {filterStatus !== 'all' || filterPriority !== 'all' 
                  ? 'No tasks match your current filters.' 
                  : 'You don\'t have any assigned risks yet.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {userRisks.map((risk) => (
              <Card key={`${risk.projectId}-${risk.id}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium mr-3">{risk.title}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Building size={14} className="mr-1" />
                          <span>{risk.projectName}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{risk.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="default">{risk.category}</Badge>
                        <Badge variant="priority" value={risk.priority}>
                          {risk.priority.charAt(0).toUpperCase() + risk.priority.slice(1)}
                        </Badge>
                        <Badge variant="status" value={risk.status}>
                          {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <span>Probability: {risk.probability}/10</span>
                          <span>Impact: {risk.impact}/10</span>
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            <span>Created: {new Date(risk.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {risk.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {risk.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 md:ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Edit size={14} />}
                        onClick={() => {
                          setSelectedRisk(risk);
                          setEditModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Activity size={14} />}
                        onClick={() => {
                          setSelectedRisk(risk);
                          setMitigationModalOpen(true);
                        }}
                      >
                        Strategy
                      </Button>
                    </div>
                  </div>
                  
                  {/* Status Change Buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Button
                        variant={risk.status === 'open' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusChange(risk, 'open')}
                      >
                        Open
                      </Button>
                      <Button
                        variant={risk.status === 'mitigated' ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => handleStatusChange(risk, 'mitigated')}
                      >
                        Mitigated
                      </Button>
                      <Button
                        variant={risk.status === 'closed' ? 'success' : 'outline'}
                        size="sm"
                        icon={<CheckCircle size={14} />}
                        onClick={() => handleStatusChange(risk, 'closed')}
                      >
                        Closed
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modals */}
        {selectedRisk && (
          <>
            <Modal
              isOpen={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              title="Edit Risk"
            >
              <RiskForm
                initialRisk={selectedRisk}
                onComplete={() => setEditModalOpen(false)}
                onCancel={() => setEditModalOpen(false)}
              />
            </Modal>

            <MitigationModal
              isOpen={mitigationModalOpen}
              onClose={() => setMitigationModalOpen(false)}
              risk={selectedRisk}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Tasks;