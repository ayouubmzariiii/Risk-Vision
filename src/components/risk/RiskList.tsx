import React, { useState, useMemo, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { Risk, RiskCategory, RiskPriority, RiskStatus } from '../../types';
import { Card, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Edit, Trash2, Activity, CheckCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import RiskForm from './RiskForm';
import MitigationModal from './MitigationModal';

const RiskList: React.FC = () => {
  const { currentProject, removeRisk, updateRisk, selectProject } = useProjects();
  const { user } = useAuth();
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [mitigationModalOpen, setMitigationModalOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof Risk>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterCategory, setFilterCategory] = useState<RiskCategory | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<RiskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<RiskPriority | 'all'>('all');

  // Refresh project data when component mounts
  useEffect(() => {
    if (currentProject) {
      selectProject(currentProject.id);
    }
  }, []);

  const risks = useMemo(() => {
    if (!currentProject) return [];
    
    // Filter risks
    let filteredRisks = [...currentProject.risks];
    
    if (filterCategory !== 'all') {
      filteredRisks = filteredRisks.filter(risk => risk.category === filterCategory);
    }
    
    if (filterStatus !== 'all') {
      filteredRisks = filteredRisks.filter(risk => risk.status === filterStatus);
    }
    
    if (filterPriority !== 'all') {
      filteredRisks = filteredRisks.filter(risk => risk.priority === filterPriority);
    }
    
    // Sort risks
    return filteredRisks.sort((a, b) => {
      if (sortField === 'priority') {
        // Custom sorting for priority
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
        const bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
        
        return sortDirection === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      }
      
      // Default sorting for other fields
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [currentProject, sortField, sortDirection, filterCategory, filterStatus, filterPriority]);

  const handleSort = (field: keyof Risk) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending for new sort field
    }
  };

  // Check if current user is a manager
  const isManager = useMemo(() => {
    if (!user || !currentProject?.teamMembersData) return false;
    const currentUserMember = currentProject.teamMembersData.find(member => member.email === user.email);
    return currentUserMember?.role === 'manager';
  }, [user, currentProject?.teamMembersData]);

  const handleStatusChange = (risk: Risk, newStatus: RiskStatus) => {
    updateRisk({
      ...risk,
      status: newStatus
    });
  };

  const categories = useMemo(() => {
    const uniqueCategories = new Set<RiskCategory>();
    
    if (currentProject) {
      currentProject.risks.forEach(risk => {
        uniqueCategories.add(risk.category);
      });
    }
    
    return Array.from(uniqueCategories);
  }, [currentProject]);

  if (!currentProject) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Select a project to manage risks.</p>
      </div>
    );
  }

  if (currentProject.risks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No risks have been added to this project yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium mb-3">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as RiskCategory | 'all')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
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
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button 
                className={`text-sm font-medium ${sortField === 'title' ? 'text-blue-600' : 'text-gray-500'}`}
                onClick={() => handleSort('title')}
              >
                Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className={`text-sm font-medium ${sortField === 'category' ? 'text-blue-600' : 'text-gray-500'}`}
                onClick={() => handleSort('category')}
              >
                Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`text-sm font-medium ${sortField === 'priority' ? 'text-blue-600' : 'text-gray-500'}`}
                onClick={() => handleSort('priority')}
              >
                Priority {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button 
                className={`text-sm font-medium ${sortField === 'status' ? 'text-blue-600' : 'text-gray-500'}`}
                onClick={() => handleSort('status')}
              >
                Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </button>
            </div>
          </div>
          
          {risks.map((risk) => (
            <Card key={risk.id} className="m-4">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-1">{risk.title}</h3>
                    <p className="text-gray-600 mb-2">{risk.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="default">{risk.category}</Badge>
                      <Badge variant="priority" value={risk.priority}>
                        {risk.priority.charAt(0).toUpperCase() + risk.priority.slice(1)}
                      </Badge>
                      <Badge variant="status" value={risk.status}>
                        {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      <div>Probability: {risk.probability}/10</div>
                      <div>Impact: {risk.impact}/10</div>
                      {risk.assignedTo && <div>Assigned to: {risk.assignedTo}</div>}
                    </div>
                    {risk.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
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
                  <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
                    {isManager && (
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
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Activity size={14} />}
                      onClick={() => {
                        setSelectedRisk(risk);
                        setMitigationModalOpen(true);
                      }}
                    >
                      Mitigation
                    </Button>
                    {isManager && (
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<Trash2 size={14} />}
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this risk?')) {
                            removeRisk(risk.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
                {isManager && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between">
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
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

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
  );
};

export default RiskList;