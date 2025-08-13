import React, { useState, useEffect, useRef } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import { Wand2, Users, Edit2, Check, X, Loader, Trash2 } from 'lucide-react';
import { RiskCategory, TeamMember } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { db } from '../../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Modal from '../ui/Modal';

const RiskGenerator: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const { generateProjectRisks, loading, error, currentProject, updateProject, generationProgress } = useProjects();
  const { user } = useAuth();
  const [industry, setIndustry] = useState('');
  const [projectType, setProjectType] = useState('');
  const [count, setCount] = useState<number>(5);
  const [selectedCategories, setSelectedCategories] = useState<RiskCategory[]>([]);
  const [useCount, setUseCount] = useState(true);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editedRole, setEditedRole] = useState('');
  const [teamMembersData, setTeamMembersData] = useState<TeamMember[]>([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberJobTitle, setNewMemberJobTitle] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  // Additional fields
  const [country, setCountry] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [stakeholders, setStakeholders] = useState('');
  const [regulations, setRegulations] = useState('');

  useEffect(() => {
    if (currentProject?.teamMembersData) {
      setTeamMembersData(currentProject.teamMembersData);
      setLoadingTeamMembers(false);
    } else {
      setTeamMembersData([]);
      setLoadingTeamMembers(false);
    }
  }, [currentProject?.teamMembersData]);

  const RISK_CATEGORIES: RiskCategory[] = [
    'technical',
    'financial',
    'operational',
    'schedule',
    'scope',
    'resource',
    'stakeholder',
    'legal',
    'security',
    'quality'
  ];

  const handleCategoryToggle = (category: RiskCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSelectAllCategories = () => {
    if (selectedCategories.length === RISK_CATEGORIES.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([...RISK_CATEGORIES]);
    }
  };

  const handleEditRole = (member: TeamMember) => {
    setEditingMember(member.email);
    setEditedRole(member.projectRole || '');
  };

  const handleSaveRole = async () => {
    if (!currentProject || !editingMember) return;

    const updatedTeamMembers = teamMembersData.map(member => 
      member.email === editingMember 
        ? { ...member, projectRole: editedRole }
        : member
    );

    setTeamMembersData(updatedTeamMembers);
    setEditingMember(null);
    setEditedRole('');

    await updateProject({
      ...currentProject,
      teamMembersData: updatedTeamMembers
    });
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setEditedRole('');
  };

  const handleAddMember = async () => {
    if (!currentProject || !newMemberName.trim() || !newMemberEmail.trim()) return;

    setAddingMember(true);
    try {
      const newMember: TeamMember = {
        email: newMemberEmail.trim(),
        displayName: newMemberName.trim(),
        jobTitle: newMemberJobTitle.trim() || 'Team Member',
        projectRole: newMemberJobTitle.trim() || 'Team Member',
        role: 'worker'
      };

      const updatedTeamMembersData = [...teamMembersData, newMember];
      setTeamMembersData(updatedTeamMembersData);

      // Update the project with new team member
      const updatedProject = {
        ...currentProject,
        teamMembers: [...(currentProject.teamMembers || []), newMemberEmail.trim()],
        teamMembersData: updatedTeamMembersData
      };

      await updateProject(updatedProject);

      // Reset form
      setNewMemberName('');
      setNewMemberEmail('');
      setNewMemberJobTitle('');
      setShowAddMember(false);
    } catch (error) {
      console.error('Error adding team member:', error);
    } finally {
      setAddingMember(false);
    }
  };

  const handleCancelAddMember = () => {
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberJobTitle('');
    setShowAddMember(false);
  };

  const handleRemoveMember = async (memberEmail: string) => {
    if (!currentProject || !memberEmail) return;

    try {
      // Filter out the member from both arrays
      const updatedTeamMembersData = teamMembersData.filter(member => member.email !== memberEmail);
      const updatedTeamMembers = currentProject.teamMembers?.filter(email => email !== memberEmail) || [];

      setTeamMembersData(updatedTeamMembersData);

      // Update the project
      const updatedProject = {
        ...currentProject,
        teamMembers: updatedTeamMembers,
        teamMembersData: updatedTeamMembersData
      };

      await updateProject(updatedProject);
    } catch (error) {
      console.error('Error removing team member:', error);
    }
  };



  const handleGenerateRisks = async () => {
    if (!currentProject) return;

    try {
      setIsGenerating(true);
      await generateProjectRisks({
        industry: industry || undefined,
        projectType: projectType || undefined,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        count: useCount ? count : 20,
        country: country || undefined,
        budget: budget || undefined,
        timeline: timeline || undefined,
        teamSize: teamSize || undefined,
        stakeholders: stakeholders || undefined,
        regulations: regulations || undefined,
        teamMembers: teamMembersData
      });

      if (onComplete) onComplete();
    } catch (err) {
      console.error('Error generating risks:', err);
    }
  };

  const handleCancelGeneration = () => {
    setIsGenerating(false);
    // Add logic to cancel the generation process if needed
  };

  return (
    <Card>
      <CardHeader>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Generate Project Risks</h2>
        </div>
        <p className="text-sm text-gray-500">
          Provide project details to generate relevant risks using AI. The more information you provide,
          the more accurate and specific the generated risks will be.
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {loadingTeamMembers ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Loading team members...</span>
              </div>
            </div>
          ) : teamMembersData.length > 0 ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Users size={16} className="text-blue-600 mr-2" />
                  <h3 className="text-sm font-medium text-gray-900">Project Team</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddMember(true)}
                >
                  Add Member
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembersData.map((member) => (
                  <div key={member.email} className="bg-white p-3 rounded-lg shadow-sm border">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-medium text-sm truncate">{member.displayName}</div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            member.role === 'manager' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {member.role === 'manager' ? 'Manager' : 'Worker'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">{member.email}</div>
                        {editingMember === member.email ? (
                          <div className="mt-2 flex items-center space-x-2">
                            <Input
                              value={editedRole}
                              onChange={(e) => setEditedRole(e.target.value)}
                              placeholder="Project role"
                              className="text-sm h-8"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Check size={14} />}
                              onClick={handleSaveRole}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<X size={14} />}
                              onClick={handleCancelEdit}
                            />
                          </div>
                        ) : (
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-xs text-gray-600">
                              {member.projectRole || member.jobTitle}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<Edit2 size={14} />}
                                onClick={() => handleEditRole(member)}
                              />
                              {member.role !== 'manager' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  icon={<Trash2 size={14} />}
                                  onClick={() => handleRemoveMember(member.email)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Software, Construction, Healthcare"
              />
              
              <Input
                label="Project Type"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                placeholder="e.g., Mobile App, Building Construction"
              />
              
              <Input
                label="Country/Region"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., United States, European Union"
              />
              
              <Input
                label="Project Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g., $500,000, 1M EUR"
              />
            </div>
            
            <div className="space-y-4">
              <Input
                label="Timeline"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g., 6 months, 1 year"
              />
              
              <Input
                label="Team Size"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                placeholder="e.g., 10 developers, 50 employees"
              />
              
              <Input
                label="Key Stakeholders"
                value={stakeholders}
                onChange={(e) => setStakeholders(e.target.value)}
                placeholder="e.g., Government agencies, Investors"
              />
              
              <Input
                label="Regulatory Requirements"
                value={regulations}
                onChange={(e) => setRegulations(e.target.value)}
                placeholder="e.g., GDPR, HIPAA, ISO 27001"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Risk Categories
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllCategories}
                >
                  {selectedCategories.length === RISK_CATEGORIES.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {RISK_CATEGORIES.map((category) => (
                  <div
                    key={category}
                    className={`
                      px-4 py-2 rounded-lg border cursor-pointer transition-colors
                      ${selectedCategories.includes(category)
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 hover:border-blue-400'
                      }
                    `}
                    onClick={() => handleCategoryToggle(category)}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm capitalize">{category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useCount"
                  checked={useCount}
                  onChange={(e) => setUseCount(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="useCount" className="text-sm font-medium text-gray-700">
                  Specify number of risks to generate
                </label>
              </div>
              
              {useCount && (
                <Input
                  type="number"
                  label="Number of Risks"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  min={1}
                  className="w-full"
                />
              )}
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          
          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              icon={<Wand2 size={16} />}
              onClick={handleGenerateRisks}
              isLoading={loading || generationProgress.status !== 'idle'}
              disabled={loading || generationProgress.status !== 'idle'}
              className="w-full md:w-auto"
            >
              Generate Risks
            </Button>
          </div>
        </div>
      </CardContent>

      <Modal
        isOpen={isGenerating && generationProgress.status !== 'idle'}
        onClose={() => {}}
        title="Generating Risks"
      >
        <div className="p-6 space-y-6">
          <div className="text-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {generationProgress.message}
            </h3>
            <p className="text-sm text-gray-500">
              Please wait while we generate risks and strategies for your project.
            </p>
          </div>

          <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{
                width: `${(generationProgress.currentItem / generationProgress.totalItems) * 100}%`
              }}
            />
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={handleCancelGeneration}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showAddMember}
        onClose={handleCancelAddMember}
        title="Add Team Member"
      >
        <div className="p-6 space-y-4">
          <Input
            label="Name"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            placeholder="Enter member name"
            required
          />
          
          <Input
            label="Email"
            type="email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            placeholder="Enter member email"
            required
          />
          
          <Input
            label="Job Title"
            value={newMemberJobTitle}
            onChange={(e) => setNewMemberJobTitle(e.target.value)}
            placeholder="Enter job title (optional)"
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancelAddMember}
              disabled={addingMember}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddMember}
              isLoading={addingMember}
              disabled={!newMemberName.trim() || !newMemberEmail.trim() || addingMember}
            >
              Add Member
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default RiskGenerator;